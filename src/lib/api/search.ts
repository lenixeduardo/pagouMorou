import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";
import type { Apartment } from "@/types";
import { mapApartmentSearchRow } from "./mappers";

type Client = SupabaseClient<Database>;
type SearchArgs = Database["public"]["Functions"]["search_apartments"]["Args"];

export type SearchSort = "relevance" | "recent" | "price_asc" | "price_desc" | "rating" | "metro";

// Os `| undefined` são explícitos porque o projeto usa
// `exactOptionalPropertyTypes`: quem monta o filtro (a rota, o validador zod)
// entrega objetos com chaves presentes e valor undefined.
export type SearchApartmentsInput = {
  query?: string | undefined;
  city?: string | undefined;
  neighborhood?: string | undefined;
  propertyType?: Database["public"]["Enums"]["property_type"] | undefined;
  minRent?: number | undefined;
  maxRent?: number | undefined;
  bedrooms?: number | undefined;
  furnished?: boolean | undefined;
  petFriendly?: boolean | undefined;
  sort?: SearchSort | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
  /** `null` (padrão) traz todo imóvel publicado, inclusive reservado ou
   * alugado — é o mesmo recorte da home e dos favoritos. A RPC sozinha
   * assume `available`, o que fazia um imóvel reservado sumir da busca
   * mesmo aparecendo em outras telas. */
  status?: Database["public"]["Enums"]["apartment_status"] | null | undefined;
};

export type SearchApartmentsResult = {
  items: Apartment[];
  /** Total de imóveis que casam com o filtro, ignorando limit/offset. */
  total: number;
};

/**
 * Busca no Postgres, não em memória: full-text em português (com unaccent e
 * fallback por similaridade no título e no bairro) mais os filtros
 * estruturados, ordenação e paginação — tudo dentro da RPC
 * `search_apartments`.
 */
export async function searchApartments(
  client: Client,
  input: SearchApartmentsInput = {},
): Promise<SearchApartmentsResult> {
  // Chave ausente = parâmetro default da função (NULL, "sem filtro"). Mandar
  // a chave com `undefined` não é a mesma coisa para o PostgREST.
  // O cast cobre só `p_status`: os tipos gerados não modelam "passar NULL
  // de propósito", que é como se derruba o default 'available' da função.
  const args = {
    p_sort: input.sort ?? "relevance",
    p_limit: input.limit ?? 12,
    p_offset: input.offset ?? 0,
    p_status: input.status ?? null,
  } as SearchArgs;

  const query = input.query?.trim();
  if (query) args.p_query = query;

  const city = input.city?.trim();
  if (city) args.p_city = city;

  const neighborhood = input.neighborhood?.trim();
  if (neighborhood) args.p_neighborhood = neighborhood;

  if (input.propertyType !== undefined) args.p_property_type = input.propertyType;
  if (input.minRent !== undefined) args.p_min_rent = input.minRent;
  if (input.maxRent !== undefined) args.p_max_rent = input.maxRent;
  if (input.bedrooms !== undefined) args.p_bedrooms = input.bedrooms;
  if (input.furnished !== undefined) args.p_furnished = input.furnished;
  if (input.petFriendly !== undefined) args.p_pet_friendly = input.petFriendly;

  const { data, error } = await client.rpc("search_apartments", args);

  if (error) throw error;

  const rows = data ?? [];
  return {
    items: rows.map(mapApartmentSearchRow),
    // `total_count` é um count(*) over() — vem repetido em toda linha e some
    // quando a busca não casa com nada.
    total: rows[0]?.total_count ?? 0,
  };
}
