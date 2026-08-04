import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { Page } from "@/components/layout/page";

export const Route = createFileRoute("/apartamento/$id")({
  head: () => ({
    meta: [
      { title: "Detalhes do apartamento | PagouMorou" },
      {
        name: "description",
        content: "Fotos, valores, características e negociação direta com o proprietário.",
      },
      { property: "og:title", content: "Detalhes do apartamento | PagouMorou" },
      {
        property: "og:description",
        content: "Veja tudo sobre o apartamento e negocie direto com o proprietário.",
      },
    ],
  }),
  component: ApartamentoPage,
});

function ApartamentoPage() {
  const { id } = Route.useParams();

  return (
    <Page title="Apartamento" description={`Identificador do anúncio: ${id}`}>
      <EmptyState
        icon={Building2}
        title="Página do apartamento em construção"
        description="Galeria, valores, comodidades e negociação serão adicionados em seguida."
      />
    </Page>
  );
}