import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { apartmentsByIdsQueryOptions } from "@/lib/queries/apartments";
import { PropertyCard } from "@/components/cards/property-card";
import { motion } from "framer-motion";
import { container, fadeIn } from "@/lib/motion";

import { EmptyState } from "@/components/feedback/empty-state";
import { Page } from "@/components/layout/page";
import { SkeletonCardGrid } from "@/components/cards/skeleton-card";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Meus favoritos | PagouMorou" },
      {
        name: "description",
        content:
          "Veja os imóveis que você favoritou no PagouMorou, compare preço, bairro e distância do metrô e escolha seu próximo endereço com tranquilidade.",
      },
      { property: "og:title", content: "Meus favoritos | PagouMorou" },
      {
        property: "og:description",
        content:
          "Veja os imóveis que você favoritou no PagouMorou, compare preço, bairro e distância do metrô e escolha seu próximo endereço com tranquilidade.",
      },
    ],
  }),
  component: FavoritosPage,
});

function FavoritosPage() {
  const { isAuthenticated, isLoading: isLoadingSession } = useRequireAuth();
  const { favorites, toggleFavorite, isFavorite, isLoading: isLoadingFavorites } = useFavorites();
  const { data: favoriteApartments = [], isLoading: isLoadingApartments } = useQuery(
    apartmentsByIdsQueryOptions(favorites),
  );

  // A sessão só é conhecida depois da hidratação; até lá, skeleton em vez de
  // um empty state que some meio segundo depois.
  const isLoading = isLoadingSession || isLoadingFavorites || isLoadingApartments;

  if (!isLoadingSession && !isAuthenticated) return null;

  return (
    <Page
      title="Favoritos"
      description="Seus apartamentos salvos aparecerão aqui."
      component="main"
    >
      {isLoading ? (
        <SkeletonCardGrid count={4} />
      ) : favoriteApartments.length > 0 ? (
        <motion.div
          variants={container}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {favoriteApartments.map((apt) => (
            <motion.div key={apt.id} variants={fadeIn}>
              <PropertyCard
                apartment={apt}
                favorite={isFavorite(apt.id)}
                onToggleFavorite={toggleFavorite}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState
          icon={Heart}
          title="Nenhum favorito ainda"
          description="Ao explorar apartamentos, toque no coração para salvar os que mais gostar."
        />
      )}
    </Page>
  );
}
