import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { createPublicSupabase } from "@/lib/supabase/server";
import {
  getApartmentBySlug,
  getApartmentsByIds,
  listApartments,
  listApartmentsByOwner,
  listApartmentsNearMetro,
  searchApartments,
} from "@/lib/api/apartments";
import { searchFiltersSchema } from "@/lib/search/filters";

export const fetchApartments = createServerFn({ method: "GET" })
  .validator(
    z
      .object({
        limit: z.number().int().positive().optional(),
        orderBy: z.enum(["created_at", "reviews_count", "rating"]).optional(),
      })
      .optional(),
  )
  .handler(async ({ data }) => {
    const opts: { limit?: number; orderBy?: "created_at" | "reviews_count" | "rating" } = {};
    if (data?.limit !== undefined) opts.limit = data.limit;
    if (data?.orderBy !== undefined) opts.orderBy = data.orderBy;
    return listApartments(createPublicSupabase(), opts);
  });

export const fetchApartmentBySlug = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().min(1) }))
  .handler(async ({ data }) => getApartmentBySlug(createPublicSupabase(), data.slug));

export const fetchApartmentsByIds = createServerFn({ method: "GET" })
  .validator(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ data }) => getApartmentsByIds(createPublicSupabase(), data.ids));

export const fetchApartmentsByOwner = createServerFn({ method: "GET" })
  .validator(z.object({ ownerId: z.string().min(1) }))
  .handler(async ({ data }) => listApartmentsByOwner(createPublicSupabase(), data.ownerId));

export const fetchApartmentsNearMetro = createServerFn({ method: "GET" })
  .validator(z.object({ limit: z.number().int().positive().optional() }).optional())
  .handler(async ({ data }) => listApartmentsNearMetro(createPublicSupabase(), data?.limit ?? 5));

export const searchApartmentsFn = createServerFn({ method: "GET" })
  .validator(searchFiltersSchema)
  .handler(async ({ data }) => searchApartments(createPublicSupabase(), data));
