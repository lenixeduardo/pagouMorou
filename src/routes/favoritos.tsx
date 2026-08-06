import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/hooks/use-auth";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { apartments } from "@/mock";
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
      { name: "description", content: "Apartamentos que você salvou para alugar depois." },
      { property: "og:title", content: "Meus favoritos | PagouMorou" },
      { property: "og:description", content: "Sua lista de apartamentos salvos no PagouMorou." },
    ],
  }),
  component: FavoritosPage,
});

function FavoritosPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/entrar" });
    } else {
      const timer = setTimeout(() => setIsLoading(false), 1500);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isAuthenticated, navigate]);



  if (!isAuthenticated) return null;

  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const favoriteApartments = apartments.filter((apt) => favorites.includes(apt.id));

  return (
    <Page title="Favoritos" description="Seus apartamentos salvos aparecerão aqui." component="main">
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