-- 1. Criar enums se não existirem
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'proposal_status') THEN
        CREATE TYPE public.proposal_status AS ENUM (
            'pending', 
            'accepted', 
            'rejected', 
            'cancelled',
            'counter_offer',
            'waiting_payment',
            'payment_sent',
            'payment_verified',
            'contract_signed'
        );
    END IF;
END $$;

-- 2. Criar tabela proposals
CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    apartment_id UUID NOT NULL REFERENCES public.apartments(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rent_amount NUMERIC(10,2) NOT NULL,
    counter_rent_amount NUMERIC(10,2),
    message TEXT,
    status public.proposal_status NOT NULL DEFAULT 'pending',
    payment_proof_url TEXT,
    contract_url TEXT,
    signed_contract_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Conceder permissões
GRANT SELECT, INSERT, UPDATE, DELETE ON public.proposals TO authenticated;
GRANT ALL ON public.proposals TO service_role;

-- 4. Habilitar RLS
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- 5. Criar Políticas de RLS
CREATE POLICY "Tenants can view their own proposals"
ON public.proposals FOR SELECT
TO authenticated
USING (auth.uid() = tenant_id);

CREATE POLICY "Owners can view proposals for their apartments"
ON public.proposals FOR SELECT
TO authenticated
USING (auth.uid() = owner_id);

CREATE POLICY "Tenants can create proposals"
ON public.proposals FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = tenant_id);

CREATE POLICY "Owners and Tenants can update proposal status/fields"
ON public.proposals FOR UPDATE
TO authenticated
USING (auth.uid() = tenant_id OR auth.uid() = owner_id);

-- 6. Adicionar campo de documentos ao perfil
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS document_urls JSONB DEFAULT '[]'::jsonb;

-- 7. Trigger para updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_proposals_updated_at ON public.proposals;
CREATE TRIGGER set_proposals_updated_at
BEFORE UPDATE ON public.proposals
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Comentários para documentação
COMMENT ON TABLE public.proposals IS 'Propostas de aluguel entre inquilinos e proprietários';
COMMENT ON COLUMN public.proposals.counter_rent_amount IS 'Valor da contraproposta feita pelo proprietário';
