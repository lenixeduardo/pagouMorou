import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";
import type { Apartment } from "@/types";
import { mapApartmentRow, type ApartmentRowWithImages } from "./mappers";

type Client = SupabaseClient<Database>;

const APARTMENT_SELECT = "*, apartment_images(*)";

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
