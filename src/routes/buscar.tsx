import { useEffect, useState } from "react";
import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Sparkles,
  Train,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Page } from "@/components/layout/page";
import {
  apartmentsNearMetroQueryOptions,
  apartmentsQueryOptions,
  searchApartmentsQueryOptions,
} from "@/lib/queries/apartments";
import {
  PROPERTY_TYPES,
  PROPERTY_TYPE_LABELS,
  SORT_LABELS,
  SORT_OPTIONS,
  resolveSearchFilters,
  searchFiltersSchema,
} from "@/lib/search/filters";
import { PropertyCard } from "@/components/cards/property-card";
import { useFavorites } from "@/hooks/use-favorites";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Carousel, CarouselContent, CarouselItem, useCarousel } from "@/components/ui/carousel";
import { EmptyState } from "@/components/feedback/empty-state";
import type { Apartment } from "@/types";

const DEFAULT_SEARCH = { type: "todos", sort: "relevance", page: 1, perPage: 12 } as const;
const MAX_RENT_BOUND = 20000;

export const Route = createFileRoute("/buscar")({
  validateSearch: (raw: Record<string, unknown>) => searchFiltersSchema.parse(raw),
  search: {
    middlewares: [stripSearchParams(DEFAULT_SEARCH)],
  },
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) =>
    Promise.all([
      context.queryClient.ensureQueryData(searchApartmentsQueryOptions(deps)),
      context.queryClient.ensureQueryData(
        apartmentsQueryOptions({ limit: 5, orderBy: "reviews_count" }),
      ),
      context.queryClient.ensureQueryData(apartmentsNearMetroQueryOptions(5)),
      context.queryClient.ensureQueryData(
        apartmentsQueryOptions({ limit: 5, orderBy: "created_at" }),
      ),
    ]),
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

function RailNav() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full border border-border"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label="Anterior"
      >
        <ChevronLeft className="size-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full border border-border"
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label="Próximo"
      >
        <ChevronRight className="size-5" />
      </Button>
    </div>
  );
}

function Rail({
  title,
  subtitle,
  icon: Icon,
  apartments,
  emptyMessage,
  favorite,
  onToggleFavorite,
}: {
  title: string;
  subtitle: string;
  icon: typeof Sparkles;
  apartments: Apartment[];
  emptyMessage: string;
  favorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
}) {
  if (apartments.length === 0) {
    return (
      <section className="mb-16">
        <div className="mb-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Icon className="size-5 text-primary" />
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <p className="px-4 py-10 text-muted-foreground">{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section className="mb-16">
      <Carousel opts={{ align: "start", dragFree: true }}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Icon className="size-5 text-primary" />
              {title}
            </h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <RailNav />
        </div>
        <CarouselContent>
          {apartments.map((apt) => (
            <CarouselItem key={apt.id} className="basis-[320px] md:basis-[380px]">
              <PropertyCard
                apartment={apt}
                favorite={favorite(apt.id)}
                onToggleFavorite={onToggleFavorite}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}

function SearchPage() {
  const search = Route.useSearch();
  const resolved = resolveSearchFilters(search);
  const navigate = Route.useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();

  const { data: results } = useSuspenseQuery(searchApartmentsQueryOptions(search));
  const { data: popular } = useSuspenseQuery(
    apartmentsQueryOptions({ limit: 5, orderBy: "reviews_count" }),
  );
  const { data: nearMetro } = useSuspenseQuery(apartmentsNearMetroQueryOptions(5));
  const { data: recent } = useSuspenseQuery(
    apartmentsQueryOptions({ limit: 5, orderBy: "created_at" }),
  );

  const [searchInput, setSearchInput] = useState(search.q ?? "");
  const [rentRange, setRentRange] = useState<[number, number]>([
    search.minRent ?? 0,
    search.maxRent ?? MAX_RENT_BOUND,
  ]);

  useEffect(() => {
    setSearchInput(search.q ?? "");
  }, [search.q]);

  useEffect(() => {
    setRentRange([search.minRent ?? 0, search.maxRent ?? MAX_RENT_BOUND]);
  }, [search.minRent, search.maxRent]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchInput.trim();
      if (trimmed === (search.q ?? "")) return;
      navigate({
        search: (prev) => ({ ...prev, q: trimmed || undefined, page: 1 }),
        replace: true,
      });
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const commitRentRange = (value: number[]) => {
    const [min, max] = value;
    navigate({
      search: (prev) => ({
        ...prev,
        minRent: min && min > 0 ? min : undefined,
        maxRent: max && max < MAX_RENT_BOUND ? max : undefined,
        page: 1,
      }),
    });
  };

  const activeFilterCount = [
    search.minRent,
    search.maxRent,
    search.bedrooms,
    search.furnished,
    search.petFriendly,
  ].filter((value) => value !== undefined).length;

  return (
    <Page fullWidth className="bg-white pb-20 pt-6" component="main">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12 flex flex-col gap-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <h1 className="text-3xl font-bold tracking-tight">Buscar seu novo lar</h1>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2 rounded-full px-6">
                    <Filter className="size-4" />
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
                              navigate({
                                search: (prev) => ({
                                  ...prev,
                                  bedrooms: prev.bedrooms === n ? undefined : n,
                                  page: 1,
                                }),
                              })
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
                          navigate({
                            search: (prev) => ({
                              ...prev,
                              furnished: checked === true ? true : undefined,
                              page: 1,
                            }),
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="filter-pet">Aceita pet</Label>
                      <Checkbox
                        id="filter-pet"
                        checked={search.petFriendly ?? false}
                        onCheckedChange={(checked) =>
                          navigate({
                            search: (prev) => ({
                              ...prev,
                              petFriendly: checked === true ? true : undefined,
                              page: 1,
                            }),
                          })
                        }
                      />
                    </div>

                    {activeFilterCount > 0 && (
                      <Button
                        variant="ghost"
                        className="w-full text-text-secondary"
                        onClick={() =>
                          navigate({
                            search: (prev) => ({
                              ...prev,
                              minRent: undefined,
                              maxRent: undefined,
                              bedrooms: undefined,
                              furnished: undefined,
                              petFriendly: undefined,
                              page: 1,
                            }),
                          })
                        }
                      >
                        Limpar filtros
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 rounded-full px-6">
                    <SlidersHorizontal className="size-4" />
                    Ordenar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {SORT_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option}
                      onClick={() =>
                        navigate({ search: (prev) => ({ ...prev, sort: option, page: 1 }) })
                      }
                      className="flex items-center justify-between gap-4"
                    >
                      {SORT_LABELS[option]}
                      {resolved.sort === option && <Check className="size-4 text-primary" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="group relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Busque por título, bairro, cidade ou rua..."
              className="h-14 rounded-2xl border-none bg-slate-50 pl-12 text-lg shadow-sm focus-visible:ring-primary/20"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {(["todos", ...PROPERTY_TYPES] as const).map((type) => (
              <Badge
                key={type}
                variant={resolved.type === type ? "default" : "secondary"}
                className={`cursor-pointer whitespace-nowrap rounded-full px-6 py-2 text-sm font-medium transition-all ${
                  resolved.type === type
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
                onClick={() => navigate({ search: (prev) => ({ ...prev, type, page: 1 }) })}
              >
                {type === "todos" ? "Todos" : PROPERTY_TYPE_LABELS[type]}
              </Badge>
            ))}
          </div>
        </div>

        <section className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {results.total} {results.total === 1 ? "imóvel encontrado" : "imóveis encontrados"}
            </h2>
          </div>

          {results.items.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.items.map((apt) => (
                <PropertyCard
                  key={apt.id}
                  apartment={apt}
                  favorite={isFavorite(apt.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title="Nenhum imóvel encontrado"
              description="Tente ajustar os filtros ou buscar por outro bairro, cidade ou título."
            />
          )}

          {results.total > results.perPage && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                className="rounded-full"
                disabled={results.page <= 1}
                onClick={() =>
                  navigate({ search: (prev) => ({ ...prev, page: results.page - 1 }) })
                }
              >
                Anterior
              </Button>
              <span className="px-4 text-sm text-text-secondary">
                Página {results.page} de {Math.max(1, Math.ceil(results.total / results.perPage))}
              </span>
              <Button
                variant="outline"
                className="rounded-full"
                disabled={results.page >= Math.ceil(results.total / results.perPage)}
                onClick={() =>
                  navigate({ search: (prev) => ({ ...prev, page: results.page + 1 }) })
                }
              >
                Próxima
              </Button>
            </div>
          )}
        </section>

        <Rail
          title="Os mais procurados"
          subtitle="Os favoritos da nossa comunidade nesta semana."
          icon={Sparkles}
          apartments={popular}
          emptyMessage="Nenhum imóvel disponível no momento."
          favorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />

        <Rail
          title="Próximos ao metrô"
          subtitle="Mobilidade e rapidez para o seu dia a dia."
          icon={Train}
          apartments={nearMetro}
          emptyMessage="Nenhum imóvel com distância do metrô cadastrada ainda."
          favorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />

        <Rail
          title="Recém adicionados"
          subtitle="As últimas oportunidades publicadas."
          icon={Sparkles}
          apartments={recent}
          emptyMessage="Fique atento às novidades."
          favorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />
      </div>
    </Page>
  );
}

function formatShort(value: number): string {
  if (value >= 1000) return `R$ ${Math.round(value / 1000)} mil`;
  return `R$ ${value}`;
}
