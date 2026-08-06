import { queryOptions } from "@tanstack/react-query";

import {
  fetchApartmentBySlug,
  fetchApartments,
  fetchApartmentsByIds,
  fetchApartmentsByOwner,
} from "@/lib/server-fns/apartments";

export const apartmentsQueryOptions = (opts: { limit?: number } = {}) =>
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
  });
