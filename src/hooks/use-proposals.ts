// Propostas de aluguel persistidas. A criação e a resposta passam pelas
// funções `send_proposal` / `respond_proposal` do Postgres: elas validam as
// regras (não propor no próprio imóvel, imóvel disponível, uma proposta
// aberta por imóvel) e notificam o outro lado numa única transação.
import { useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getBrowserSupabase } from "@/lib/supabase/browser";
import { useAuth } from "@/hooks/use-auth";
import { notificationsRefreshKey } from "@/lib/queries/keys";

export type ProposalStatus = 
  | "pending" 
  | "accepted" 
  | "rejected" 
  | "cancelled"
  | "counter_offer"
  | "waiting_payment"
  | "payment_sent"
  | "payment_verified"
  | "contract_signed";

export interface Proposal {
  id: string;
  apartmentId: string;
  apartmentTitle: string;
  apartmentSlug: string;
  tenantId: string;
  tenantName: string;
  ownerId: string;
  ownerName: string;
  rentAmount: number;
  counterRentAmount?: number;
  message: string;
  status: ProposalStatus;
  paymentProofUrl?: string;
  contractUrl?: string;
  signedContractUrl?: string;
  /** `received` = sou o proprietário; `sent` = sou o inquilino. */
  direction: "received" | "sent";
  createdAt: string;
}

const proposalsQueryKey = (profileId: string) => ["proposals", profileId] as const;

export function useProposals() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const profileId = user?.id ?? "";
  const queryKey = proposalsQueryKey(profileId);

  const { data: proposals = [], isLoading } = useQuery({
    queryKey,
    queryFn: async (): Promise<Proposal[]> => {
      // Usamos any para evitar erros de tipagem com Database['public']['Functions']['list_proposals']['Returns']
      // até que os tipos sejam regerados.
      const { data, error } = await getBrowserSupabase().rpc("list_proposals") as any;
      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        id: row.id,
        apartmentId: row.apartment_id,
        apartmentTitle: row.apartment_title,
        apartmentSlug: row.apartment_slug,
        tenantId: row.tenant_id,
        tenantName: row.tenant_name,
        ownerId: row.owner_id,
        ownerName: row.owner_name,
        rentAmount: row.rent_amount,
        counterRentAmount: row.counter_rent_amount,
        message: row.message,
        status: row.status as ProposalStatus,
        paymentProofUrl: row.payment_proof_url,
        contractUrl: row.contract_url,
        signedContractUrl: row.signed_contract_url,
        direction: row.direction === "received" ? "received" : "sent",
        createdAt: row.created_at,
      }));
    },
    enabled: profileId !== "",
    staleTime: 30_000,
  });

  const invalidate = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey });
    void queryClient.invalidateQueries({ queryKey: notificationsRefreshKey });
  }, [queryClient, queryKey]);

  const { mutateAsync: sendProposalMutation, isPending: isSending } = useMutation({
    mutationFn: async (input: { apartmentId: string; rentAmount?: number; message?: string }) => {
      const { data, error } = await getBrowserSupabase().rpc("send_proposal", {
        p_apartment_id: input.apartmentId,
        ...(input.rentAmount !== undefined ? { p_rent: input.rentAmount } : {}),
        p_message: input.message ?? "",
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      toast.success("Proposta enviada com sucesso!");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const { mutate: respondMutation } = useMutation({
    mutationFn: async (input: { 
      id: string; 
      status: ProposalStatus; // Removido Exclude para evitar conflitos de tipos
      counterRentAmount?: number;
      paymentProofUrl?: string;
      contractUrl?: string;
      signedContractUrl?: string;
    }) => {
      const { data, error } = await getBrowserSupabase().rpc("respond_proposal", {
        p_id: input.id,
        p_status: input.status as any,
        p_counter_rent: input.counterRentAmount,
        p_payment_proof: input.paymentProofUrl,
        p_contract: input.contractUrl,
        p_signed_contract: input.signedContractUrl,
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (_data, variables) => {
      const statusLabels: Record<string, string> = {
        accepted: "Proposta aceita!",
        rejected: "Proposta recusada.",
        counter_offer: "Contraproposta enviada!",
        waiting_payment: "Solicitação de pagamento enviada!",
        payment_sent: "Comprovante enviado com sucesso!",
        payment_verified: "Pagamento verificado!",
        contract_signed: "Contrato assinado!",
      };
      
      const label = statusLabels[variables.status] || "Status atualizado!";
      toast.success(label);
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const { received, sent } = useMemo(
    () => ({
      received: proposals.filter((item) => item.direction === "received"),
      sent: proposals.filter((item) => item.direction === "sent"),
    }),
    [proposals],
  );

  const sendProposal = useCallback(
    async (input: { apartmentId: string; rentAmount?: number; message?: string }) => {
      if (profileId === "") {
        toast.error("Entre na sua conta para enviar uma proposta.");
        return false;
      }
      try {
        await sendProposalMutation(input);
        return true;
      } catch {
        // O toast de erro já saiu no onError da mutation.
        return false;
      }
    },
    [profileId, sendProposalMutation],
  );

  const approveProposal = useCallback(
    (id: string) => respondMutation({ id, status: "accepted" }),
    [respondMutation],
  );

  const rejectProposal = useCallback(
    (id: string) => respondMutation({ id, status: "rejected" }),
    [respondMutation],
  );

  const counterOffer = useCallback(
    (id: string, amount: number) => respondMutation({ id, status: "counter_offer", counterRentAmount: amount }),
    [respondMutation],
  );

  const requestPayment = useCallback(
    (id: string) => respondMutation({ id, status: "waiting_payment" }),
    [respondMutation],
  );

  const sendPaymentProof = useCallback(
    (id: string, url: string) => respondMutation({ id, status: "payment_sent", paymentProofUrl: url }),
    [respondMutation],
  );

  return {
    proposals,
    received,
    sent,
    isLoading,
    isSending,
    sendProposal,
    approveProposal,
    rejectProposal,
    counterOffer,
    requestPayment,
    sendPaymentProof,
    respondMutation,
  };
}
