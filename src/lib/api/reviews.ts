import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function listApartmentReviews(client: Client, apartmentId: string) {
  const { data, error } = await client
    .from("reviews")
    .select("rating, comment, created_at")
    .eq("apartment_id", apartmentId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map((row) => ({
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
  }));
}
