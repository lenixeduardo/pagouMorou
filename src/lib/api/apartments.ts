import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";
import type { Apartment } from "@/types";
import { resolveSearchFilters, type ValidatedSearchFilters } from "@/lib/search/filters";
import { mapApartmentRow, mapSearchResultRow, type ApartmentRowWithImages } from "./mappers";

type Client = SupabaseClient<Database>;

const APARTMENT_SELECT = "*, apartment_images(*)";

export interface SearchApartmentsResult {
  items: Apartment[];
  total: number;
  page: number;
  perPage: number;
}

export async function searchApartments(
  client: Client,
  rawFilters: ValidatedSearchFilters,
): Promise<SearchApartmentsResult> {
  const filters = resolveSearchFilters(rawFilters);
  const { page, perPage } = filters;

  // `exactOptionalPropertyTypes` forbids passing `undefined` for an optional
  // RPC arg key — only include a key when the filter actually has a value.
  const rpcArgs: Database["public"]["Functions"]["search_apartments"]["Args"] = {
    p_sort: filters.sort,
    p_limit: perPage,
    p_offset: (page - 1) * perPage,
    ...(filters.q !== undefined ? { p_query: filters.q } : {}),
    ...(filters.city !== undefined ? { p_city: filters.city } : {}),
    ...(filters.neighborhood !== undefined ? { p_neighborhood: filters.neighborhood } : {}),
    ...(filters.type !== "todos" ? { p_property_type: filters.type } : {}),
    ...(filters.minRent !== undefined ? { p_min_rent: filters.minRent } : {}),
    ...(filters.maxRent !== undefined ? { p_max_rent: filters.maxRent } : {}),
    ...(filters.bedrooms !== undefined ? { p_bedrooms: filters.bedrooms } : {}),
    ...(filters.furnished !== undefined ? { p_furnished: filters.furnished } : {}),
    ...(filters.petFriendly !== undefined ? { p_pet_friendly: filters.petFriendly } : {}),
  };

  const { data, error } = await client.rpc("search_apartments", rpcArgs);
  if (error) throw error;

  return {
    items: data.map(mapSearchResultRow),
    total: data[0]?.total_count ?? 0,
    page,
    perPage,
  };
}

export async function listApartmentsNearMetro(client: Client, limit = 5): Promise<Apartment[]> {
  const { data, error } = await client
    .from("apartments")
    .select(APARTMENT_SELECT)
    .eq("published", true)
    .not("metro_distance_m", "is", null)
    .order("metro_distance_m", { ascending: true })
    .limit(limit)
    .returns<ApartmentRowWithImages[]>();
  if (error) throw error;
  return data.map(mapApartmentRow);
}

export async function listApartments(
  client: Client,
  opts: { limit?: number; orderBy?: "created_at" | "reviews_count" | "rating" } = {},
): Promise<Apartment[]> {
  const { limit, orderBy = "created_at" } = opts;
  let query = client
    .from("apartments")
    .select(APARTMENT_SELECT)
    .eq("published", true)
    .order(orderBy, { ascending: false });
  if (limit) query = query.limit(limit);

  const { data, error } = await query.returns<ApartmentRowWithImages[]>();
  if (error) throw error;
  return data.map(mapApartmentRow);
}

export async function getApartmentBySlug(client: Client, slug: string): Promise<Apartment | null> {
  const { data, error } = await client
    .from("apartments")
    .select(APARTMENT_SELECT)
    .eq("slug", slug)
    .maybeSingle<ApartmentRowWithImages>();
  if (error) throw error;
  return data ? mapApartmentRow(data) : null;
}

export async function getApartmentsByIds(client: Client, ids: string[]): Promise<Apartment[]> {
  if (ids.length === 0) return [];
  const { data, error } = await client
    .from("apartments")
    .select(APARTMENT_SELECT)
    .in("id", ids)
    .returns<ApartmentRowWithImages[]>();
  if (error) throw error;
  return data.map(mapApartmentRow);
}

export async function listApartmentsByOwner(client: Client, ownerId: string): Promise<Apartment[]> {
  const { data, error } = await client
    .from("apartments")
    .select(APARTMENT_SELECT)
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false })
    .returns<ApartmentRowWithImages[]>();
  if (error) throw error;
  return data.map(mapApartmentRow);
}
