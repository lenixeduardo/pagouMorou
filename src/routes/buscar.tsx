import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, Building2, MapPin, Sparkles, Train } from "lucide-react";
import { Page } from "@/components/layout/page";
import { apartments } from "@/mock";
import { PropertyCard } from "@/components/cards/property-card";
import { useFavorites } from "@/hooks/use-favorites";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SkeletonCardGrid } from "@/components/cards/skeleton-card";


export const Route = createFileRoute("/buscar")({
  head: () => ({
    meta: [
      { title: "Explorar Imóveis para Alugar | PagouMorou" },
      {
        name: "description",
        content:
          "Busque seu próximo lar entre os imóveis selecionados do PagouMorou: filtre por bairro, preço e metrô e negocie direto com o proprietário, sem burocracia.",
      },
      { property: "og:title", content: "Explorar Imóveis para Alugar | PagouMorou" },
      {
        property: "og:description",
        content:
          "Busque seu próximo lar entre os imóveis selecionados do PagouMorou: filtre por bairro, preço e metrô e negocie direto com o proprietário, sem burocracia.",
      },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [isLoading, setIsLoading] = useState(true);

  // Simular carregamento inicial para mostrar esqueletos
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const filters = ["Todos", "Apartamentos", "Casas", "Studios", "Lofts"];

  const filteredApartments = useMemo(() => {
    return apartments.filter((apt) => {
      const matchesSearch = 
        apt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.address.neighborhoodId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.address.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        activeFilter === "Todos" || 
        apt.title.toLowerCase().includes(activeFilter.toLowerCase().slice(0, -1));

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  const carousel1 = filteredApartments.slice(0, 5);
  const carousel2 = filteredApartments.slice(5, 10);


  return (
    <Page fullWidth className="bg-white pb-20 pt-6" component="main">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col gap-6 mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Buscar seu novo lar</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-full gap-2 px-6">
                <Filter className="size-4" />
                Filtros
              </Button>
              <Button variant="outline" className="rounded-full gap-2 px-6">
                <SlidersHorizontal className="size-4" />
                Ordenar
              </Button>
            </div>
          </div>

          <div className="relative group max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input 
              placeholder="Busque por bairro, cidade ou rua..." 
              className="pl-12 h-14 rounded-2xl bg-slate-50 border-none shadow-sm text-lg focus-visible:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter) => (
              <Badge
                key={filter}
                variant={activeFilter === filter ? "default" : "secondary"}
                className={`cursor-pointer px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter 
                    ? "bg-primary text-white" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </Badge>
            ))}
          </div>
        </div>

        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                Os mais procurados
              </h2>
              <p className="text-muted-foreground text-sm">Os favoritos da nossa comunidade nesta semana.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full border border-border">
                <ChevronLeft className="size-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full border border-border">
                <ChevronRight className="size-5" />
              </Button>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="min-w-[320px] md:min-w-[380px]">
                  <SkeletonCardGrid count={1} />
                </div>
              ))
            ) : carousel1.length > 0 ? (
              carousel1.map((apt) => (
                <div key={apt.id} className="min-w-[320px] md:min-w-[380px]">
                  <PropertyCard 
                    apartment={apt} 
                    favorite={isFavorite(apt.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground py-10 px-4">Nenhum imóvel encontrado.</p>
            )}
          </div>
        </section>


        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Train className="size-5 text-primary" />
                Próximos ao metrô
              </h2>
              <p className="text-muted-foreground text-sm">Mobilidade e rapidez para o seu dia a dia.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full border border-border">
                <ChevronLeft className="size-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full border border-border">
                <ChevronRight className="size-5" />
              </Button>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="min-w-[320px] md:min-w-[380px]">
                  <SkeletonCardGrid count={1} />
                </div>
              ))
            ) : carousel2.length > 0 ? (
              carousel2.map((apt) => (
                <div key={apt.id} className="min-w-[320px] md:min-w-[380px]">
                  <PropertyCard 
                    apartment={apt} 
                    favorite={isFavorite(apt.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground py-10 px-4">Continue explorando mais bairros.</p>
            )}
          </div>
        </section>

        <section className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                Recém adicionados
              </h2>
              <p className="text-muted-foreground text-sm">As últimas oportunidades publicadas hoje.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full border border-border">
                <ChevronLeft className="size-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full border border-border">
                <ChevronRight className="size-5" />
              </Button>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="min-w-[320px] md:min-w-[380px]">
                  <SkeletonCardGrid count={1} />
                </div>
              ))
            ) : filteredApartments.length > 0 ? (
              [...filteredApartments].reverse().slice(0, 5).map((apt) => (
                <div key={apt.id} className="min-w-[320px] md:min-w-[380px]">
                  <PropertyCard 
                    apartment={apt} 
                    favorite={isFavorite(apt.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground py-10 px-4">Fique atento às novidades.</p>
            )}
          </div>
        </section>
      </div>
    </Page>
  );
}
