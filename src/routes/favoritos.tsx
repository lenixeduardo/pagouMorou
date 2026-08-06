import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { Page } from "@/components/layout/page";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Meus favoritos | PagouMorou" },
      { name: "description", content: "Apartamentos que você salvou para alugar depois." },
      { property: "og:title", content: "Meus favoritos | PagouMorou" },
      { property: "og:description", content: "Sua lista de apartamentos salvos no PagouMorou." },
    ],
  }),
  component: FavoritosPage,
});

function FavoritosPage() {
  return (
    <Page title="Favoritos" description="Seus apartamentos salvos aparecerão aqui." component="main">
      <EmptyState
        icon={Heart}
        title="Nenhum favorito ainda"
        description="Ao explorar apartamentos, toque no coração para salvar os que mais gostar."
      />
    </Page>
  );
}