import { createFileRoute } from "@tanstack/react-router";
import { LogIn } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { Page } from "@/components/layout/page";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar na sua conta | PagouMorou" },
      { name: "description", content: "Acesse sua conta para negociar e assinar contratos digitais." },
      { property: "og:title", content: "Entrar | PagouMorou" },
      { property: "og:description", content: "Acesse o PagouMorou e alugue sem burocracia." },
    ],
  }),
  component: EntrarPage,
});

function EntrarPage() {
  return (
    <Page title="Entrar" description="O formulário de acesso será construído aqui.">
      <EmptyState
        icon={LogIn}
        title="Login em construção"
        description="Autenticação e recuperação de senha entram na próxima etapa."
      />
    </Page>
  );
}