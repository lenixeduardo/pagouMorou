import { createFileRoute } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { Page } from "@/components/layout/page";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta | PagouMorou" },
      { name: "description", content: "Crie sua conta gratuita e alugue um apartamento sem fiador." },
      { property: "og:title", content: "Criar conta | PagouMorou" },
      { property: "og:description", content: "Cadastro rápido para alugar sem burocracia." },
    ],
  }),
  component: CadastroPage,
});

function CadastroPage() {
  return (
    <Page title="Criar conta" description="O fluxo de cadastro será construído aqui.">
      <EmptyState
        icon={UserPlus}
        title="Cadastro em construção"
        description="Formulário, validação e verificação por código chegam em seguida."
      />
    </Page>
  );
}