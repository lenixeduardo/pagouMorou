import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { Page } from "@/components/layout/page";

export const Route = createFileRoute("/mensagens")({
  head: () => ({
    meta: [
      { title: "Mensagens com proprietários | PagouMorou" },
      { name: "description", content: "Negocie direto com o proprietário pelo chat do PagouMorou." },
      { property: "og:title", content: "Mensagens | PagouMorou" },
      { property: "og:description", content: "Converse e negocie o aluguel sem intermediários." },
    ],
  }),
  component: MensagensPage,
});

function MensagensPage() {
  return (
    <Page title="Mensagens" description="As conversas com proprietários ficarão aqui.">
      <EmptyState
        icon={MessageCircle}
        title="Sem conversas por enquanto"
        description="Quando você iniciar uma negociação, o histórico aparece nesta página."
      />
    </Page>
  );
}