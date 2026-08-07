import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { createPublicSupabase } from "@/lib/supabase/server";
import {
  getApartmentBySlug,
  getApartmentsByIds,
  listApartments,
  listApartmentsByOwner,
} from "@/lib/api/apartments";
import { searchApartments } from "@/lib/api/search";

const propertyType = z.enum(["apartamento", "casa", "studio", "loft", "kitnet", "cobertura"]);

const searchInput = z.object({
  query: z.string().optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  propertyType: propertyType.optional(),
  minRent: z.number().nonnegative().optional(),
  maxRent: z.number().nonnegative().optional(),
  bedrooms: z.number().int().min(0).max(10).optional(),
  furnished: z.boolean().optional(),
  petFriendly: z.boolean().optional(),
  sort: z.enum(["relevance", "recent", "price_asc", "price_desc", "rating", "metro"]).optional(),
  status: z.enum(["available", "reserved", "rented"]).nullish(),
  limit: z.number().int().positive().max(48).optional(),
  offset: z.number().int().min(0).optional(),
});

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

export const fetchApartmentSearch = createServerFn({ method: "GET" })
  .validator(searchInput.optional())
  .handler(async ({ data }) => searchApartments(createPublicSupabase(), data ?? {}));
