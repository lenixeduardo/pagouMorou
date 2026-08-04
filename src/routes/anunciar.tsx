import { createFileRoute } from "@tanstack/react-router";
import { BuildingPlus } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { Page } from "@/components/layout/page";

export const Route = createFileRoute("/anunciar")({
  head: () => ({
    meta: [
      { title: "Anunciar imóvel para aluguel | PagouMorou" },
      { name: "description", content: "Cadastre seu apartamento e alugue direto para o inquilino." },
      { property: "og:title", content: "Anunciar imóvel | PagouMorou" },
      { property: "og:description", content: "Publique seu apartamento e negocie sem intermediários." },
    ],
  }),
  component: AnunciarPage,
});

function AnunciarPage() {
  return (
    <Page title="Anunciar imóvel" description="O fluxo de publicação do anúncio será construído aqui.">
      <EmptyState
        icon={BuildingPlus}
        title="Publicação em construção"
        description="Etapas de fotos, valores e características do imóvel chegam nas próximas etapas."
      />
    </Page>
  );
}