-- 1. Recriar list_proposals para incluir novos campos
CREATE OR REPLACE FUNCTION public.list_proposals()
RETURNS TABLE (
    id UUID,
    apartment_id UUID,
    apartment_title TEXT,
    apartment_slug TEXT,
    tenant_id UUID,
    tenant_name TEXT,
    owner_id UUID,
    owner_name TEXT,
    rent_amount NUMERIC,
    counter_rent_amount NUMERIC,
    message TEXT,
    status public.proposal_status,
    payment_proof_url TEXT,
    contract_url TEXT,
    signed_contract_url TEXT,
    direction TEXT,
    created_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.apartment_id,
        a.title as apartment_title,
        a.slug as apartment_slug,
        p.tenant_id,
        tp.name as tenant_name,
        p.owner_id,
        op.name as owner_name,
        p.rent_amount,
        p.counter_rent_amount,
        p.message,
        p.status,
        p.payment_proof_url,
        p.contract_url,
        p.signed_contract_url,
        CASE WHEN auth.uid() = p.owner_id THEN 'received' ELSE 'sent' END as direction,
        p.created_at
    FROM public.proposals p
    JOIN public.apartments a ON a.id = p.apartment_id
    JOIN public.profiles tp ON tp.id = p.tenant_id
    JOIN public.profiles op ON op.id = p.owner_id
    WHERE auth.uid() = p.tenant_id OR auth.uid() = p.owner_id
    ORDER BY p.created_at DESC;
END;
$$;

-- 2. Recriar send_proposal
CREATE OR REPLACE FUNCTION public.send_proposal(
    p_apartment_id UUID,
    p_rent NUMERIC DEFAULT NULL,
    p_message TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_owner_id UUID;
    v_rent NUMERIC;
    v_proposal_id UUID;
BEGIN
    SELECT owner_id, rent INTO v_owner_id, v_rent FROM public.apartments WHERE id = p_apartment_id;
    
    IF v_owner_id = auth.uid() THEN
        RAISE EXCEPTION 'Você não pode enviar uma proposta para o seu próprio imóvel.';
    END IF;

    INSERT INTO public.proposals (
        apartment_id,
        tenant_id,
        owner_id,
        rent_amount,
        message,
        status
    ) VALUES (
        p_apartment_id,
        auth.uid(),
        v_owner_id,
        COALESCE(p_rent, v_rent),
        p_message,
        'pending'
    ) RETURNING id INTO v_proposal_id;

    -- Notificar proprietário
    INSERT INTO public.notifications (profile_id, title, description, kind, href)
    VALUES (v_owner_id, 'Nova Proposta', 'Você recebeu uma nova proposta de aluguel.', 'message', '/perfil');

    RETURN v_proposal_id;
END;
$$;

-- 3. Recriar respond_proposal
CREATE OR REPLACE FUNCTION public.respond_proposal(
    p_id UUID,
    p_status public.proposal_status,
    p_counter_rent NUMERIC DEFAULT NULL,
    p_payment_proof TEXT DEFAULT NULL,
    p_contract TEXT DEFAULT NULL,
    p_signed_contract TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_proposal RECORD;
    v_notification_id UUID;
BEGIN
    SELECT * INTO v_proposal FROM public.proposals WHERE id = p_id;
    
    IF NOT FOUND THEN RETURN FALSE; END IF;

    -- Validar se quem está respondendo tem permissão
    IF p_status IN ('accepted', 'rejected', 'counter_offer', 'waiting_payment', 'payment_verified') AND auth.uid() != v_proposal.owner_id THEN
        RAISE EXCEPTION 'Apenas o proprietário pode realizar esta ação.';
    END IF;

    IF p_status IN ('payment_sent', 'contract_signed', 'cancelled') AND auth.uid() != v_proposal.tenant_id THEN
        RAISE EXCEPTION 'Apenas o inquilino pode realizar esta ação.';
    END IF;

    UPDATE public.proposals SET
        status = p_status,
        counter_rent_amount = COALESCE(p_counter_rent, counter_rent_amount),
        payment_proof_url = COALESCE(p_payment_proof, payment_proof_url),
        contract_url = COALESCE(p_contract, contract_url),
        signed_contract_url = COALESCE(p_signed_contract, signed_contract_url),
        updated_at = now()
    WHERE id = p_id;

    -- Notificar a outra parte
    IF auth.uid() = v_proposal.owner_id THEN
        INSERT INTO public.notifications (profile_id, title, description, kind, href)
        VALUES (v_proposal.tenant_id, 'Atualização de Proposta', 'Sua proposta foi atualizada pelo proprietário.', 'message', '/perfil');
    ELSE
        INSERT INTO public.notifications (profile_id, title, description, kind, href)
        VALUES (v_proposal.owner_id, 'Atualização de Proposta', 'A proposta foi atualizada pelo inquilino.', 'message', '/perfil');
    END IF;

    RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.list_proposals() TO authenticated;
GRANT EXECUTE ON FUNCTION public.send_proposal(UUID, NUMERIC, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.respond_proposal(UUID, public.proposal_status, NUMERIC, TEXT, TEXT, TEXT) TO authenticated;
