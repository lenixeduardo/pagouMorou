import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SearchX, Filter, SlidersHorizontal, MapPin } from "lucide-react";
import { apartments } from "@/mock";
import { PropertyCard } from "@/components/cards/property-card";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo, useEffect } from "react";
import { EmptyState } from "@/components/feedback/empty-state";
import { Page } from "@/components/layout/page";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, stagger as staggerContainer } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useFavorites } from "@/hooks/use-favorites";

export const Route = createFileRoute("/buscar")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      type: (search["type"] as string) || "Todos",
      bedrooms: (search["bedrooms"] as string) || undefined,
      minPrice: Number(search["minPrice"]) || 0,
      maxPrice: Number(search["maxPrice"]) || 20000,
      sort: (search["sort"] as string) || "relevance",
      q: (search["q"] as string) || "",
    };
  },
  head: () => ({
    meta: [
      { title: "Buscar Imóveis | PagouMorou" },
      {
        name: "description",
        content: "Explore centenas de apartamentos e casas prontos para morar. Filtre por bairro e preço no PagouMorou.",
      },
      { property: "og:title", content: "Buscar Imóveis | PagouMorou" },
      {
        property: "og:description",
        content: "Explore centenas de apartamentos e casas prontos para morar. Filtre por bairro e preço no PagouMorou.",
      },
    ],
  }),
  component: BuscarPage,
});

type PropertyType = "Todos" | "Studio" | "Apartamento";
type SortOption = "relevance" | "price_asc" | "price_desc";

function BuscarPage() {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { type, bedrooms, minPrice, maxPrice, sort, q } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState([minPrice, maxPrice]);
  const [localQuery, setLocalQuery] = useState(q);

  // Sync local query with URL search param
  useEffect(() => {
    setLocalQuery(q);
  }, [q]);

  const updateFilters = (updates: Partial<ReturnType<typeof Route.useSearch>>) => {
    navigate({
      search: (prev: any) => ({ ...prev, ...updates }),
      replace: true,
    });
  };

  const filteredApartments = useMemo(() => {
    let result = [...apartments];

    // Filter by text query
    if (q) {
      const searchLower = q.toLowerCase();
      result = result.filter(
        (apt) =>
          apt.title.toLowerCase().includes(searchLower) ||
          apt.description.toLowerCase().includes(searchLower) ||
          apt.address.neighborhoodId.toLowerCase().includes(searchLower) ||
          apt.address.city.toLowerCase().includes(searchLower)
      );
    }

    // Filter by type
    if (type !== "Todos") {
      result = result.filter(
        (apt) =>
          apt.title.toLowerCase().includes(type.toLowerCase()) ||
          apt.description.toLowerCase().includes(type.toLowerCase())
      );
    }

    // Filter by bedrooms
    if (bedrooms !== undefined) {
      if (bedrooms === "4+") {
        result = result.filter((apt) => apt.features.bedrooms >= 4);
      } else {
        result = result.filter((apt) => apt.features.bedrooms === Number(bedrooms));
      }
    }

    // Filter by price
    result = result.filter((apt) => apt.rent >= minPrice && apt.rent <= maxPrice);

    // Sort
    if (sort === "price_asc") {
      result.sort((a, b) => a.rent - b.rent);
    } else if (sort === "price_desc") {
      result.sort((a, b) => b.rent - a.rent);
    }

    return result;
  }, [type, bedrooms, minPrice, maxPrice, sort, q]);

  const clearFilters = () => {
    navigate({
      search: { type: "Todos", bedrooms: undefined, minPrice: 0, maxPrice: 20000, sort: "relevance", q: "" },
      replace: true,
    });
    setLocalPriceRange([0, 20000]);
    setLocalQuery("");
  };

  const hasActiveFilters = type !== "Todos" || bedrooms !== undefined || minPrice > 0 || maxPrice < 20000 || q !== "";

  return (
    <Page fullWidth className="pb-20" component="main">
      <div className="container mx-auto px-6 pt-10">
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Busque por bairro, cidade ou região..."
              className="h-14 w-full rounded-2xl border border-border bg-white pl-12 pr-4 text-body shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") updateFilters({ q: localQuery });
              }}
            />
            {localQuery !== q && (
              <Button 
                size="sm" 
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl"
                onClick={() => updateFilters({ q: localQuery })}
              >
                Buscar
              </Button>
            )}
          </div>
        </div>

        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h1 className="text-display text-4xl font-bold mb-2">
              {q ? `Resultados em "${q}"` : "Encontre seu novo lar"}
            </h1>
            <p className="text-text-secondary">Explore centenas de apartamentos prontos para morar em todo o Brasil.</p>
          </div>
          
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex md:hidden items-center gap-2 px-4 py-2 rounded-xl border border-border bg-white font-medium"
          >
            <Filter className="h-4 w-4" />
            Filtros
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                !
              </span>
            )}
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filters Sidebar */}
          <aside className={cn(
            "space-y-8 md:block",
            isFilterOpen ? "block" : "hidden"
          )}>
            <div className="rounded-3xl border border-border p-6 shadow-xs bg-white sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtros
                </h3>
                {hasActiveFilters && (
                  <button 
                    onClick={clearFilters}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    Limpar
                  </button>
                )}
              </div>
              
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">Tipo de imóvel</label>
                  <div className="flex flex-wrap gap-2">
                    {(["Todos", "Studio", "Apartamento"] as PropertyType[]).map((t) => (
                      <Badge 
                        key={t}
                        variant={type === t ? "secondary" : "outline"} 
                        className={cn(
                          "cursor-pointer transition-all px-4 py-1.5 rounded-full border-border",
                          type === t ? "bg-primary text-white border-primary" : "hover:border-primary hover:text-primary"
                        )}
                        onClick={() => updateFilters({ type: t })}
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">Preço mensal</label>
                    <span className="text-xs font-bold text-primary">
                      R$ {localPriceRange[0].toLocaleString()} - R$ {localPriceRange[1].toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[minPrice, maxPrice]}
                    max={20000}
                    step={500}
                    minStepsBetweenThumbs={1}
                    value={localPriceRange}
                    onValueChange={setLocalPriceRange}
                    onValueCommit={(val) => updateFilters({ minPrice: val[0], maxPrice: val[1] })}
                    className="py-4"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                    <span>R$ 0</span>
                    <span>R$ 20.000+</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">Quartos</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, "4+"].map((n) => (
                      <button 
                        key={n} 
                        onClick={() => updateFilters({ bedrooms: bedrooms === String(n) ? null : String(n) })}
                        className={cn(
                          "flex h-10 items-center justify-center rounded-xl border text-sm font-medium transition-all",
                          bedrooms === String(n)
                            ? "border-primary bg-primary-soft text-primary shadow-sm" 
                            : "border-border hover:border-primary hover:text-primary bg-white"
                        )}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm text-text-secondary bg-surface/50 p-4 rounded-2xl border border-border/50">
              <span className="font-medium">
                {filteredApartments.length === 0 
                  ? "Nenhum imóvel encontrado" 
                  : `Mostrando ${filteredApartments.length} ${filteredApartments.length === 1 ? 'imóvel' : 'imóveis'}`
                }
              </span>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline">Ordenar por:</span>
                <select 
                  className="bg-transparent font-bold text-foreground cursor-pointer focus:outline-none appearance-none pr-6 relative"
                  value={sort}
                  onChange={(e) => updateFilters({ sort: e.target.value as SortOption })}
                >
                  <option value="relevance">Relevância</option>
                  <option value="price_asc">Menor preço</option>
                  <option value="price_desc">Maior preço</option>
                </select>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {filteredApartments.length > 0 ? (
                <motion.div 
                  key="results"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                >
                  {filteredApartments.map((apt) => (
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
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="py-20"
                >
                  <EmptyState 
                    icon={SearchX}
                    title="Nenhum imóvel encontrado"
                    description="Tente ajustar seus filtros para encontrar o que procura."
                    action={
                      <Button variant="outline" onClick={clearFilters} className="mt-4">
                        Limpar todos os filtros
                      </Button>
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Page>
  );
}