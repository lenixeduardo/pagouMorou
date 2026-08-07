-- Revogar acesso público padrão (anon)
REVOKE EXECUTE ON FUNCTION public.list_proposals() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.send_proposal(UUID, NUMERIC, TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.respond_proposal(UUID, public.proposal_status, NUMERIC, TEXT, TEXT, TEXT) FROM PUBLIC;

-- Conceder apenas para usuários autenticados e role de serviço
GRANT EXECUTE ON FUNCTION public.list_proposals() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.send_proposal(UUID, NUMERIC, TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.respond_proposal(UUID, public.proposal_status, NUMERIC, TEXT, TEXT, TEXT) TO authenticated, service_role;
