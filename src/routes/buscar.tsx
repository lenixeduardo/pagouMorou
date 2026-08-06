import { createFileRoute } from "@tanstack/react-router";
import { SearchX, Filter, SlidersHorizontal, ChevronDown } from "lucide-react";
import { apartments } from "@/mock";
import { PropertyCard } from "@/components/cards/property-card";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { EmptyState } from "@/components/feedback/empty-state";
import { Page } from "@/components/layout/page";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, stagger as staggerContainer } from "@/lib/motion";
import { Button } from "@/components/ui/button";

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

type PropertyType = "Todos" | "Studio" | "Apartamento";
type SortOption = "relevance" | "price_asc" | "price_desc";

function BuscarPage() {
  const [selectedType, setSelectedType] = useState<PropertyType>("Todos");
  const [selectedBedrooms, setSelectedBedrooms] = useState<number | string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredApartments = useMemo(() => {
    let result = [...apartments];

    // Filter by type (Simplified logic based on title/description as mock doesn't have explicit type field)
    if (selectedType !== "Todos") {
      result = result.filter(apt => 
        apt.title.toLowerCase().includes(selectedType.toLowerCase()) || 
        apt.description.toLowerCase().includes(selectedType.toLowerCase())
      );
    }

    // Filter by bedrooms
    if (selectedBedrooms !== null) {
      if (selectedBedrooms === "4+") {
        result = result.filter(apt => apt.features.bedrooms >= 4);
      } else {
        result = result.filter(apt => apt.features.bedrooms === Number(selectedBedrooms));
      }
    }

    // Sort
    if (sortBy === "price_asc") {
      result.sort((a, b) => a.rent - b.rent);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.rent - a.rent);
    }

    return result;
  }, [selectedType, selectedBedrooms, sortBy]);

  const clearFilters = () => {
    setSelectedType("Todos");
    setSelectedBedrooms(null);
  };

  const hasActiveFilters = selectedType !== "Todos" || selectedBedrooms !== null;

  return (
    <Page fullWidth className="pb-20">
      <div className="container mx-auto px-6 pt-10">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h1 className="text-display text-4xl font-bold mb-2">Encontre seu novo lar</h1>
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
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">Tipo de imóvel</label>
                  <div className="flex flex-wrap gap-2">
                    {(["Todos", "Studio", "Apartamento"] as PropertyType[]).map((type) => (
                      <Badge 
                        key={type}
                        variant={selectedType === type ? "secondary" : "outline"} 
                        className={cn(
                          "cursor-pointer transition-all px-4 py-1.5 rounded-full border-border",
                          selectedType === type ? "bg-primary text-white border-primary" : "hover:border-primary hover:text-primary"
                        )}
                        onClick={() => setSelectedType(type)}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">Quartos</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, "4+"].map((n) => (
                      <button 
                        key={n} 
                        onClick={() => setSelectedBedrooms(selectedBedrooms === n ? null : n)}
                        className={cn(
                          "flex h-10 items-center justify-center rounded-xl border text-sm font-medium transition-all",
                          selectedBedrooms === n 
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
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
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
                  className="grid gap-6 sm:grid-cols-2"
                >
                  {filteredApartments.map((apt) => (
                    <motion.div key={apt.id} variants={fadeIn}>
                      <PropertyCard apartment={apt} />
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