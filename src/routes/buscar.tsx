import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Building2, Filter, Search, SlidersHorizontal, Sparkles, Star, Train } from "lucide-react";
import { z } from "zod";

import { Page } from "@/components/layout/page";
import { apartmentSearchQueryOptions } from "@/lib/queries/apartments";
import type { SearchApartmentsInput, SearchSort } from "@/lib/api/search";
import { PropertyCard } from "@/components/cards/property-card";
import { useFavorites } from "@/hooks/use-favorites";
import { useAuth } from "@/hooks/use-auth";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
const MAX_RENT_BOUND = 20000;

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

const PROPERTY_TYPE_VALUES = TYPE_FILTERS.flatMap((filter) => (filter.value ? [filter.value] : []));
const SORT_VALUES = SORT_OPTIONS.map((option) => option.value);

/**
 * Todos os campos ficam opcionais e sem `.default()` de propósito: um
 * `.default()` torna o campo obrigatório no tipo de saída do Zod, o que
 * quebra o tipo dos `<Link to="/buscar">` sem `search` espalhados pelo app
 * (`index.tsx`, `apartamento.$id.tsx`, `mensagens.tsx`) — já vivi esse erro
 * de compilador uma vez, não repetir.
 */
const searchParamsSchema = z.object({
  q: z.string().trim().max(120).optional(),
  type: z.enum(PROPERTY_TYPE_VALUES as [PropertyType, ...PropertyType[]]).optional(),
  sort: z.enum(SORT_VALUES as [SearchSort, ...SearchSort[]]).optional(),
  minRent: z.coerce.number().int().min(0).optional(),
  maxRent: z.coerce.number().int().min(0).optional(),
  bedrooms: z.coerce.number().int().min(0).max(6).optional(),
  furnished: z.coerce.boolean().optional(),
  petFriendly: z.coerce.boolean().optional(),
});

type SearchParams = z.infer<typeof searchParamsSchema>;

function toSearchInput(search: SearchParams, limit: number): SearchApartmentsInput {
  return {
    ...(search.q ? { query: search.q } : {}),
    ...(search.type ? { propertyType: search.type } : {}),
    ...(search.minRent !== undefined ? { minRent: search.minRent } : {}),
    ...(search.maxRent !== undefined ? { maxRent: search.maxRent } : {}),
    ...(search.bedrooms !== undefined ? { bedrooms: search.bedrooms } : {}),
    ...(search.furnished !== undefined ? { furnished: search.furnished } : {}),
    ...(search.petFriendly !== undefined ? { petFriendly: search.petFriendly } : {}),
    sort: search.sort ?? "relevance",
    limit,
  };
}

export const Route = createFileRoute("/buscar")({
  validateSearch: (raw: Record<string, unknown>) => searchParamsSchema.parse(raw),
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(
      apartmentSearchQueryOptions(toSearchInput(deps, PAGE_SIZE)),
    ),
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
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [searchTerm, setSearchTerm] = useState(search.q ?? "");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [rentRange, setRentRange] = useState<[number, number]>([
    search.minRent ?? 0,
    search.maxRent ?? MAX_RENT_BOUND,
  ]);

  const debouncedTerm = useDebouncedValue(searchTerm);

  // Volta/avança do navegador ou "Limpar filtros" mudam `search.q` sem
  // passar pelo input — mantém o campo de texto em sincronia com a URL.
  useEffect(() => {
    setSearchTerm(search.q ?? "");
  }, [search.q]);

  useEffect(() => {
    setRentRange([search.minRent ?? 0, search.maxRent ?? MAX_RENT_BOUND]);
  }, [search.minRent, search.maxRent]);

  // Sincroniza o texto debounced na URL, sem disparar uma navegação a cada
  // tecla — é o que torna a busca compartilhável por link.
  useEffect(() => {
    const trimmed = debouncedTerm.trim();
    if (trimmed === (search.q ?? "")) return;
    navigate({ search: (prev: any) => ({ ...prev, q: trimmed || undefined }), replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTerm]);

  const activeFilterCount = [
    search.minRent,
    search.maxRent,
    search.bedrooms,
    search.furnished,
    search.petFriendly,
  ].filter((value) => value !== undefined).length;

  const isSearching =
    debouncedTerm.trim() !== "" ||
    search.type !== undefined ||
    (search.sort !== undefined && search.sort !== "relevance") ||
    activeFilterCount > 0;

  const results = useQuery(
    apartmentSearchQueryOptions(
      toSearchInput({ ...search, q: debouncedTerm.trim() || undefined }, visible),
    ),
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
    setRentRange([0, MAX_RENT_BOUND]);
    setVisible(PAGE_SIZE);
    navigate({ search: {} });
  };

  const updateSearch = (patch: Partial<SearchParams>) => {
    setVisible(PAGE_SIZE);
    navigate({ search: (prev: any) => ({ ...prev, ...patch }) });
  };

  const commitRentRange = (value: number[]) => {
    const [min, max] = value;
    updateSearch({
      minRent: min && min > 0 ? min : undefined,
      maxRent: max && max < MAX_RENT_BOUND ? max : undefined,
    });
  };

  if (!isAuthenticated && !isAuthLoading) {
    return (
      <Page fullWidth className="bg-white flex items-center justify-center py-20" component="main">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-8">
            <Building2 className="size-10" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Acesso restrito</h1>
          <p className="text-text-secondary text-lg mb-10">
            Você precisa estar logado para visualizar o catálogo de imóveis e realizar buscas.
          </p>
          <div className="flex flex-col gap-4">
            <Button size="lg" className="rounded-2xl h-14 font-bold" asChild>
              <Link to="/cadastro">Criar conta grátis</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-2xl h-14 font-bold" asChild>
              <Link to="/entrar">Entrar</Link>
            </Button>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page fullWidth className="bg-white pb-20 pt-6" component="main">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col gap-6 mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Buscar seu novo lar</h1>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="h-11 gap-2 rounded-full px-6">
                    <Filter className="size-4" aria-hidden />
                    Filtros
                    {activeFilterCount > 0 && (
                      <Badge className="ml-1 size-5 rounded-full p-0 text-center leading-5">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full overflow-y-auto sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="mt-8 space-y-8">
                    <div className="space-y-4">
                      <Label>Faixa de aluguel</Label>
                      <Slider
                        min={0}
                        max={MAX_RENT_BOUND}
                        step={100}
                        value={rentRange}
                        onValueChange={(value) => setRentRange(value as [number, number])}
                        onValueCommit={commitRentRange}
                      />
                      <div className="flex justify-between text-sm text-text-secondary">
                        <span>{formatShort(rentRange[0])}</span>
                        <span>{formatShort(rentRange[1])}+</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Dormitórios</Label>
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4].map((n) => (
                          <Badge
                            key={n}
                            variant={search.bedrooms === n ? "default" : "secondary"}
                            className={`cursor-pointer rounded-full px-4 py-2 ${
                              search.bedrooms === n
                                ? "bg-primary text-white"
                                : "bg-slate-100 text-slate-600"
                            }`}
                            onClick={() =>
                              updateSearch({ bedrooms: search.bedrooms === n ? undefined : n })
                            }
                          >
                            {n}+ {n === 1 ? "quarto" : "quartos"}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="filter-furnished">Mobiliado</Label>
                      <Checkbox
                        id="filter-furnished"
                        checked={search.furnished ?? false}
                        onCheckedChange={(checked) =>
                          updateSearch({ furnished: checked === true ? true : undefined })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="filter-pet">Aceita pet</Label>
                      <Checkbox
                        id="filter-pet"
                        checked={search.petFriendly ?? false}
                        onCheckedChange={(checked) =>
                          updateSearch({ petFriendly: checked === true ? true : undefined })
                        }
                      />
                    </div>

                    {activeFilterCount > 0 && (
                      <Button
                        variant="ghost"
                        className="w-full text-text-secondary"
                        onClick={() =>
                          updateSearch({
                            minRent: undefined,
                            maxRent: undefined,
                            bedrooms: undefined,
                            furnished: undefined,
                            petFriendly: undefined,
                          })
                        }
                      >
                        Limpar filtros
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              <Select
                value={search.sort ?? "relevance"}
                onValueChange={(value) => updateSearch({ sort: value as SearchSort })}
              >
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
              const active = (search.type ?? null) === filter.value;
              return (
                <Badge
                  key={filter.label}
                  variant={active ? "default" : "secondary"}
                  className={`cursor-pointer px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    active
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  onClick={() => updateSearch({ type: filter.value ?? undefined })}
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

function formatShort(value: number): string {
  if (value >= 1000) return `R$ ${Math.round(value / 1000)} mil`;
  return `R$ ${value}`;
}
