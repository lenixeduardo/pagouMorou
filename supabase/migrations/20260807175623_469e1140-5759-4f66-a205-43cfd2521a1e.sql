-- Criação da tabela de logs de auditoria para assinaturas digitais
CREATE TABLE public.signature_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    document_hash TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.signature_audit_logs ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT SELECT ON public.signature_audit_logs TO authenticated;
GRANT ALL ON public.signature_audit_logs TO service_role;

-- Políticas de RLS
CREATE POLICY "Users can view audit logs for their proposals"
ON public.signature_audit_logs
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.proposals p
        WHERE p.id = proposal_id
        AND (p.tenant_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.apartments a
            WHERE a.id = p.apartment_id AND a.owner_id = auth.uid()
        ))
    )
);

-- Índice para performance
CREATE INDEX idx_signature_audit_proposal ON public.signature_audit_logs(proposal_id);
