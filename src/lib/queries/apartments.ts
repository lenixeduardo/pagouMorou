import { queryOptions } from "@tanstack/react-query";

import {
  fetchApartmentBySlug,
  fetchApartments,
  fetchApartmentsByIds,
  fetchApartmentsByOwner,
  fetchApartmentsNearMetro,
  searchApartmentsFn,
} from "@/lib/server-fns/apartments";
import type { ValidatedSearchFilters } from "@/lib/search/filters";

export const apartmentsQueryOptions = (
  opts: { limit?: number; orderBy?: "created_at" | "reviews_count" | "rating" } = {},
) =>
  queryOptions({
    queryKey: ["apartments", "list", opts],
    queryFn: () => fetchApartments({ data: opts }),
    staleTime: 30_000,
  });

export const apartmentBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["apartments", "bySlug", slug],
    queryFn: () => fetchApartmentBySlug({ data: { slug } }),
    staleTime: 30_000,
  });

export const apartmentsByIdsQueryOptions = (ids: string[]) =>
  queryOptions({
    queryKey: ["apartments", "byIds", ids],
    queryFn: () => fetchApartmentsByIds({ data: { ids } }),
    staleTime: 30_000,
    enabled: ids.length > 0,
  });

export const apartmentsByOwnerQueryOptions = (ownerId: string) =>
  queryOptions({
    queryKey: ["apartments", "byOwner", ownerId],
    queryFn: () => fetchApartmentsByOwner({ data: { ownerId } }),
    staleTime: 30_000,
    enabled: ownerId.length > 0,
  });

export const apartmentsNearMetroQueryOptions = (limit = 5) =>
  queryOptions({
    queryKey: ["apartments", "nearMetro", limit],
    queryFn: () => fetchApartmentsNearMetro({ data: { limit } }),
    staleTime: 30_000,
  });

export const searchApartmentsQueryOptions = (filters: ValidatedSearchFilters) =>
  queryOptions({
    queryKey: ["apartments", "search", filters],
    queryFn: () => searchApartmentsFn({ data: filters }),
    staleTime: 15_000,
  });
