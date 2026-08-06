import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { createPublicSupabase } from "@/lib/supabase/server";
import {
  getApartmentBySlug,
  getApartmentsByIds,
  listApartments,
  listApartmentsByOwner,
} from "@/lib/api/apartments";

export const fetchApartments = createServerFn({ method: "GET" })
  .validator(z.object({ limit: z.number().int().positive().optional() }).optional())
  .handler(async ({ data }) =>
    listApartments(createPublicSupabase(), data?.limit !== undefined ? { limit: data.limit } : {}),
  );

export const fetchApartmentBySlug = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().min(1) }))
  .handler(async ({ data }) => getApartmentBySlug(createPublicSupabase(), data.slug));

export const fetchApartmentsByIds = createServerFn({ method: "GET" })
  .validator(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ data }) => getApartmentsByIds(createPublicSupabase(), data.ids));

export const fetchApartmentsByOwner = createServerFn({ method: "GET" })
  .validator(z.object({ ownerId: z.string().min(1) }))
  .handler(async ({ data }) => listApartmentsByOwner(createPublicSupabase(), data.ownerId));
