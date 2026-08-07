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
      const { data, error } = await getBrowserSupabase().rpc("list_proposals");
      if (error) throw error;

      return (data ?? []).map((row) => ({
        id: row.id,
        apartmentId: row.apartment_id,
        apartmentTitle: row.apartment_title,
        apartmentSlug: row.apartment_slug,
        tenantId: row.tenant_id,
        tenantName: row.tenant_name,
        ownerId: row.owner_id,
        ownerName: row.owner_name,
        rentAmount: row.rent_amount,
        message: row.message,
        status: row.status,
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
    mutationFn: async (input: { id: string; status: Exclude<ProposalStatus, "pending"> }) => {
      const { data, error } = await getBrowserSupabase().rpc("respond_proposal", {
        p_id: input.id,
        p_status: input.status,
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (_data, variables) => {
      toast[variables.status === "approved" ? "success" : "message"](
        variables.status === "approved" ? "Proposta aprovada!" : "Proposta recusada.",
      );
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
    (id: string) => respondMutation({ id, status: "approved" }),
    [respondMutation],
  );

  const rejectProposal = useCallback(
    (id: string) => respondMutation({ id, status: "rejected" }),
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
  };
}
