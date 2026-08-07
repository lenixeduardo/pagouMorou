import { z } from "zod";

import type { PropertyType, SortOption } from "@/types";

export const PROPERTY_TYPES = [
  "apartamento",
  "casa",
  "studio",
  "loft",
  "kitnet",
  "cobertura",
] as const satisfies readonly PropertyType[];

export const SORT_OPTIONS = [
  "relevance",
  "recent",
  "price_asc",
  "price_desc",
  "rating",
  "metro",
] as const satisfies readonly SortOption[];

/**
 * Contrato de busca compartilhado por `/buscar` (`validateSearch`), pela
 * server function `searchApartments` e pela tool MCP `search_properties` —
 * os três aplicam este schema contra a mesma função SQL `search_apartments`.
 *
 * Todos os campos são opcionais no schema (nenhum `.default()`) de propósito:
 * TanStack Router só torna `search` opcional em `<Link to="/buscar">` quando
 * o tipo resolvido do schema é inteiramente `Partial` — um `.default()`
 * torna o campo obrigatório no tipo de saída do Zod e quebra isso em todo
 * link que aponta para `/buscar` sem passar `search`. Os valores padrão de
 * UI (ver `DEFAULT_SEARCH`) são aplicados em `resolveSearchFilters`, no
 * ponto de consumo, não no schema.
 */
export const searchFiltersSchema = z.object({
  q: z.string().trim().max(120).optional(),
  city: z.string().trim().optional(),
  neighborhood: z.string().trim().optional(),
  type: z.enum(["todos", ...PROPERTY_TYPES]).optional(),
  minRent: z.coerce.number().int().min(0).optional(),
  maxRent: z.coerce.number().int().min(0).optional(),
  bedrooms: z.coerce.number().int().min(0).max(6).optional(),
  furnished: z.coerce.boolean().optional(),
  petFriendly: z.coerce.boolean().optional(),
  sort: z.enum(SORT_OPTIONS).optional(),
  page: z.coerce.number().int().min(1).optional(),
  perPage: z.coerce.number().int().min(1).max(48).optional(),
});

export type ValidatedSearchFilters = z.infer<typeof searchFiltersSchema>;

export const DEFAULT_SEARCH = {
  type: "todos",
  sort: "relevance",
  page: 1,
  perPage: 12,
} as const;

export interface ResolvedSearchFilters extends ValidatedSearchFilters {
  type: "todos" | PropertyType;
  sort: SortOption;
  page: number;
  perPage: number;
}

/** Fills in `DEFAULT_SEARCH` for the four UI-only fields; everything else
 * (free-text/range filters) stays `undefined` when absent — that's what
 * `searchApartments` expects to omit them from the SQL call entirely. */
export function resolveSearchFilters(filters: ValidatedSearchFilters): ResolvedSearchFilters {
  return {
    ...filters,
    type: filters.type ?? DEFAULT_SEARCH.type,
    sort: filters.sort ?? DEFAULT_SEARCH.sort,
    page: filters.page ?? DEFAULT_SEARCH.page,
    perPage: filters.perPage ?? DEFAULT_SEARCH.perPage,
  };
}

/** Same fields, no UI pagination defaults — what the MCP tool exposes to agents. */
export const searchFiltersInputSchema = searchFiltersSchema
  .omit({ page: true, perPage: true })
  .extend({
    limit: z.number().int().min(1).max(50).optional(),
  });

export const PROPERTY_TYPE_LABELS: Record<(typeof PROPERTY_TYPES)[number], string> = {
  apartamento: "Apartamentos",
  casa: "Casas",
  studio: "Studios",
  loft: "Lofts",
  kitnet: "Kitnets",
  cobertura: "Coberturas",
};

export const SORT_LABELS: Record<SortOption, string> = {
  relevance: "Relevância",
  recent: "Mais recentes",
  price_asc: "Menor preço",
  price_desc: "Maior preço",
  rating: "Melhor avaliados",
  metro: "Mais perto do metrô",
};
