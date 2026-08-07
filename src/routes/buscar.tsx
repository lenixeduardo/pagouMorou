import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Sparkles, Star, Train } from "lucide-react";

import { Page } from "@/components/layout/page";
import { apartmentSearchQueryOptions } from "@/lib/queries/apartments";
import type { SearchSort } from "@/lib/api/search";
import { PropertyCard } from "@/components/cards/property-card";
import { useFavorites } from "@/hooks/use-favorites";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SkeletonCardGrid } from "@/components/cards/skeleton-card";
import { EmptyState } from "@/components/feedback/empty-state";
import type { Apartment, PropertyType } from "@/types";
import { container, fadeIn } from "@/lib/motion";

const PAGE_SIZE = 12;

/** Os chips mapeiam direto para o enum `property_type` do banco — nada de
 * adivinhar tipo de imóvel procurando substring no título. */
const TYPE_FILTERS: { label: string; value: PropertyType | null }[] = [
  { label: "Todos", value: null },
  { label: "Apartamentos", value: "apartamento" },
  { label: "Casas", value: "casa" },
  { label: "Studios", value: "studio" },
  { label: "Lofts", value: "loft" },
  { label: "Kitnets", value: "kitnet" },
  { label: "Coberturas", value: "cobertura" },
];

const SORT_OPTIONS: { label: string; value: SearchSort }[] = [
  { label: "Mais relevantes", value: "relevance" },
  { label: "Recém adicionados", value: "recent" },
  { label: "Menor aluguel", value: "price_asc" },
  { label: "Maior aluguel", value: "price_desc" },
  { label: "Melhor avaliados", value: "rating" },
  { label: "Mais perto do metrô", value: "metro" },
];

export const Route = createFileRoute("/buscar")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(apartmentSearchQueryOptions({ sort: "rating", limit: 8 })),
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
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
  const [sort, setSort] = useState<SearchSort>("relevance");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const debouncedTerm = useDebouncedValue(searchTerm);
  const isSearching = debouncedTerm.trim() !== "" || propertyType !== null || sort !== "relevance";

  const results = useQuery(
    apartmentSearchQueryOptions({
      ...(debouncedTerm.trim() ? { query: debouncedTerm.trim() } : {}),
      ...(propertyType ? { propertyType } : {}),
      sort,
      limit: visible,
    }),
  );

  // Vitrines curadas da tela inicial de busca. Cada uma é uma ordenação
  // diferente da mesma RPC, resolvida no Postgres.
  const topRated = useQuery(apartmentSearchQueryOptions({ sort: "rating", limit: 8 }));
  const nearMetro = useQuery(apartmentSearchQueryOptions({ sort: "metro", limit: 8 }));
  const newest = useQuery(apartmentSearchQueryOptions({ sort: "recent", limit: 8 }));

  const total = results.data?.total ?? 0;
  const items = useMemo(() => results.data?.items ?? [], [results.data]);

  const resetFilters = () => {
    setSearchTerm("");
    setPropertyType(null);
    setSort("relevance");
    setVisible(PAGE_SIZE);
  };

  return (
    <Page fullWidth className="bg-white pb-20 pt-6" component="main">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col gap-6 mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Buscar seu novo lar</h1>
            <div className="flex items-center gap-2">
              <Select value={sort} onValueChange={(value) => setSort(value as SearchSort)}>
                <SelectTrigger
                  className="h-11 w-[220px] rounded-full px-6"
                  aria-label="Ordenar resultados"
                >
                  <SlidersHorizontal className="size-4 text-text-secondary" aria-hidden />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="relative group max-w-2xl">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground transition-colors group-focus-within:text-primary"
              aria-hidden
            />
            <Input
              type="search"
              aria-label="Buscar imóveis"
              placeholder="Busque por bairro, cidade ou rua..."
              className="pl-12 h-14 rounded-2xl bg-slate-50 border-none shadow-sm text-lg focus-visible:ring-primary/20"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setVisible(PAGE_SIZE);
              }}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {TYPE_FILTERS.map((filter) => {
              const active = propertyType === filter.value;
              return (
                <Badge
                  key={filter.label}
                  variant={active ? "default" : "secondary"}
                  className={`cursor-pointer px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    active
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  onClick={() => {
                    setPropertyType(filter.value);
                    setVisible(PAGE_SIZE);
                  }}
                >
                  {filter.label}
                </Badge>
              );
            })}
          </div>
        </div>

        {isSearching ? (
          <section className="mb-20">
            <div className="mb-6 flex items-center justify-between gap-4">
              <p className="text-text-secondary" aria-live="polite">
                {results.isLoading
                  ? "Buscando imóveis..."
                  : total === 1
                    ? "1 imóvel encontrado"
                    : `${total} imóveis encontrados`}
              </p>
              <Button variant="ghost" className="rounded-full font-bold" onClick={resetFilters}>
                Limpar filtros
              </Button>
            </div>

            {results.isLoading ? (
              <SkeletonCardGrid count={6} />
            ) : items.length === 0 ? (
              <EmptyState
                icon={Search}
                title="Nenhum imóvel encontrado"
                description="Tente outro bairro, mude o tipo de imóvel ou limpe os filtros para ver tudo o que está disponível."
                action={
                  <Button className="rounded-xl font-bold" onClick={resetFilters}>
                    Limpar filtros
                  </Button>
                }
              />
            ) : (
              <>
                <motion.div
                  variants={container}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                  {items.map((apartment) => (
                    <motion.div key={apartment.id} variants={fadeIn}>
                      <PropertyCard
                        apartment={apartment}
                        favorite={isFavorite(apartment.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {items.length < total && (
                  <div className="mt-10 flex justify-center">
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-xl px-10 font-bold"
                      disabled={results.isFetching}
                      onClick={() => setVisible((current) => current + PAGE_SIZE)}
                    >
                      {results.isFetching ? "Carregando..." : "Carregar mais imóveis"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </section>
        ) : (
          <>
            <ApartmentCarousel
              title="Os mais procurados"
              description="Os favoritos da nossa comunidade nesta semana."
              icon={Star}
              apartments={topRated.data?.items ?? []}
              isLoading={topRated.isLoading}
              emptyMessage="Nenhum imóvel avaliado por enquanto."
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />

            <ApartmentCarousel
              title="Próximos ao metrô"
              description="Mobilidade e rapidez para o seu dia a dia."
              icon={Train}
              apartments={nearMetro.data?.items ?? []}
              isLoading={nearMetro.isLoading}
              emptyMessage="Continue explorando mais bairros."
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />

            <ApartmentCarousel
              title="Recém adicionados"
              description="As últimas oportunidades publicadas."
              icon={Sparkles}
              apartments={newest.data?.items ?? []}
              isLoading={newest.isLoading}
              emptyMessage="Fique atento às novidades."
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              className="mb-20"
            />
          </>
        )}
      </div>
    </Page>
  );
}

function ApartmentCarousel({
  title,
  description,
  icon: Icon,
  apartments,
  isLoading,
  emptyMessage,
  isFavorite,
  onToggleFavorite,
  className = "mb-16",
}: {
  title: string;
  description: string;
  icon: typeof Sparkles;
  apartments: Apartment[];
  isLoading: boolean;
  emptyMessage: string;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Icon className="size-5 text-primary" aria-hidden />
          {title}
        </h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="min-w-[320px] md:min-w-[380px]">
              <SkeletonCardGrid count={1} />
            </div>
          ))
        ) : apartments.length > 0 ? (
          apartments.map((apartment) => (
            <div key={apartment.id} className="min-w-[320px] md:min-w-[380px]">
              <PropertyCard
                apartment={apartment}
                favorite={isFavorite(apartment.id)}
                onToggleFavorite={onToggleFavorite}
              />
            </div>
          ))
        ) : (
          <p className="text-muted-foreground py-10 px-4">{emptyMessage}</p>
        )}
      </div>
    </section>
  );
}
