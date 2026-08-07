import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";
import type { Neighborhood } from "@/types";
import { mapNeighborhoodStatsRow } from "./mappers";

type Client = SupabaseClient<Database>;

export async function listNeighborhoodStats(
  client: Client,
  city?: string,
): Promise<(Neighborhood & { availableProperties: number })[]> {
  let query = client.from("neighborhood_stats").select("*");
  if (city) query = query.ilike("city", `%${city}%`);

  const { data, error } = await query;
  if (error) throw error;
  return data.map(mapNeighborhoodStatsRow);
}
