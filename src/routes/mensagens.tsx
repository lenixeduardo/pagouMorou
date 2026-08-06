import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { Page } from "@/components/layout/page";

export const Route = createFileRoute("/mensagens")({
  head: () => ({
    meta: [
      { title: "Mensagens | PagouMorou" },
      {
        name: "description",
        content:
          "Converse direto com proprietários e inquilinos pelo chat do PagouMorou: combine visitas, negocie valores e feche o aluguel de forma rápida e sem burocracia.",
      },
      { property: "og:title", content: "Mensagens | PagouMorou" },
      {
        property: "og:description",
        content:
          "Converse direto com proprietários e inquilinos pelo chat do PagouMorou: combine visitas, negocie valores e feche o aluguel de forma rápida e sem burocracia.",
      },
    ],
  }),
  component: MensagensPage,
});

function MensagensPage() {
  return (
    <Page title="Mensagens" description="As conversas com proprietários ficarão aqui." component="main">
      <EmptyState
        icon={MessageCircle}
        title="Sem conversas por enquanto"
        description="Quando você iniciar uma negociação, o histórico aparece nesta página."
      />
    </Page>
  );
}