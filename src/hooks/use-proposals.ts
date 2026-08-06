import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

export type ProposalStatus = "pending" | "approved" | "rejected";

export interface Proposal {
  id: string;
  apartmentId: string;
  tenantId: string;
  tenantName: string;
  rentAmount: number;
  status: ProposalStatus;
  createdAt: string;
}

interface ProposalsStore {
  proposals: Proposal[];
  addProposal: (proposal: Omit<Proposal, "id" | "status" | "createdAt">) => void;
  updateStatus: (id: string, status: ProposalStatus) => void;
}

export const useProposals = create<ProposalsStore>()(
  persist(
    (set) => ({
      proposals: [],
      addProposal: (data) => {
        const newProposal: Proposal = {
          ...data,
          id: Math.random().toString(36).substring(7),
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ proposals: [...state.proposals, newProposal] }));
        toast.success("Proposta enviada com sucesso!");
      },
      updateStatus: (id, status) => {
        set((state) => ({
          proposals: state.proposals.map((p) =>
            p.id === id ? { ...p, status } : p
          ),
        }));
        if (status === "approved") {
          toast.success("Proposta aprovada!");
        } else if (status === "rejected") {
          toast.error("Proposta recusada.");
        }
      },
    }),
    { name: "proposals-storage" }
  )
);
