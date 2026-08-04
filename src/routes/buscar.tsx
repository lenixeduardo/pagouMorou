import { createFileRoute } from "@tanstack/react-router";
import { SearchX } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { Page } from "@/components/layout/page";

export const Route = createFileRoute("/buscar")({
  head: () => ({
    meta: [
      { title: "Buscar apartamentos para alugar | PagouMorou" },
      {
        name: "description",
        content: "Filtre apartamentos por bairro, preço e características e alugue sem burocracia.",
      },
      { property: "og:title", content: "Buscar apartamentos | PagouMorou" },
      {
        property: "og:description",
        content: "Encontre apartamentos residenciais para alugar direto com o proprietário.",
      },
    ],
  }),
  component: BuscarPage,
});

function BuscarPage() {
  return (
    <Page
      title="Buscar apartamentos"
      description="Os filtros e resultados de busca serão construídos aqui."
    >
      <EmptyState
        icon={SearchX}
        title="Busca em construção"
        description="A listagem de apartamentos entra nas próximas etapas do produto."
      />
    </Page>
  );
}