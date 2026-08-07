import type { Database } from "@/types/database";
import type { Apartment, Neighborhood } from "@/types";
import { APARTMENT_PHOTOS_BUCKET, buildPublicStorageUrl } from "@/lib/supabase/buckets";
import { getSupabaseUrl } from "@/lib/supabase/env.server";

type ApartmentRow = Database["public"]["Tables"]["apartments"]["Row"];
type ApartmentImageRow = Database["public"]["Tables"]["apartment_images"]["Row"];
type NeighborhoodRow = Database["public"]["Tables"]["neighborhoods"]["Row"];
type NeighborhoodStatsRow = Database["public"]["Views"]["neighborhood_stats"]["Row"];
type ApartmentSearchRow = Database["public"]["Functions"]["search_apartments"]["Returns"][number];

export type ApartmentRowWithImages = ApartmentRow & {
  apartment_images: ApartmentImageRow[] | null;
};

/** Formato das imagens agregadas em jsonb pela RPC `search_apartments`. */
type SearchImage = {
  external_url?: string | null;
  storage_path?: string | null;
  position?: number | null;
};

/** `exactOptionalPropertyTypes` rejects `{ floor: null }` and `{ floor: undefined }`
 * alike for an optional field — this only assigns the key when the DB value exists. */
function optional<K extends string, V>(key: K, value: V | null | undefined): { [P in K]?: V } {
  return (value === null || value === undefined ? {} : { [key]: value }) as { [P in K]?: V };
}

/** Fotos do seed vieram como URL externa; as enviadas pelo proprietário
 * moram no Storage e viram URL pública aqui. */
function imageUrl(image: {
  external_url?: string | null;
  storage_path?: string | null;
}): string | null {
  if (image.external_url) return image.external_url;
  if (image.storage_path) {
    return buildPublicStorageUrl(getSupabaseUrl(), APARTMENT_PHOTOS_BUCKET, image.storage_path);
  }
  return null;
}

export function mapApartmentRow(row: ApartmentRowWithImages): Apartment {
  const images = (row.apartment_images ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map(imageUrl)
    .filter((url): url is string => url !== null);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    status: row.status,
    propertyType: row.property_type,
    rent: row.rent,
    condoFee: row.condo_fee,
    iptu: row.iptu,
    images,
    address: {
      street: row.street,
      number: row.number,
      neighborhoodId: row.neighborhood_id ?? "",
      neighborhoodName: row.neighborhood_name ?? "",
      city: row.city,
      state: row.state,
      zipCode: row.zip_code,
    },
    features: {
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      parkingSpots: row.parking_spots,
      areaM2: row.area_m2,
      furnished: row.furnished,
      petFriendly: row.pet_friendly,
      ...optional("floor", row.floor),
    },
    amenities: row.amenities,
    standardClauses: (row as any).standard_clauses ?? [],
    ownerId: row.owner_id,
    rating: row.rating,
    reviewsCount: row.reviews_count,
    ...optional("metroDistanceM", row.metro_distance_m),
    createdAt: row.created_at,
  };
}

/** A RPC de busca devolve as imagens já agregadas em jsonb, então a linha
 * tem o mesmo conteúdo de `mapApartmentRow` mas outro formato de imagens. */
export function mapApartmentSearchRow(row: ApartmentSearchRow): Apartment {
  const images = (Array.isArray(row.images) ? (row.images as SearchImage[]) : [])
    .slice()
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map(imageUrl)
    .filter((url): url is string => url !== null);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    status: row.status,
    propertyType: row.property_type,
    rent: row.rent,
    condoFee: row.condo_fee,
    iptu: row.iptu,
    images,
    address: {
      street: row.street,
      number: row.number,
      neighborhoodId: row.neighborhood_id ?? "",
      neighborhoodName: row.neighborhood_name ?? "",
      city: row.city,
      state: row.state,
      zipCode: row.zip_code,
    },
    features: {
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      parkingSpots: row.parking_spots,
      areaM2: row.area_m2,
      furnished: row.furnished,
      petFriendly: row.pet_friendly,
      ...optional("floor", row.floor),
    },
    amenities: row.amenities,
    standardClauses: (row as any).standard_clauses ?? [],
    ownerId: row.owner_id,
    rating: row.rating,
    reviewsCount: row.reviews_count,
    ...optional("metroDistanceM", row.metro_distance_m),
    createdAt: row.created_at,
  };
}

export function mapNeighborhoodRow(row: NeighborhoodRow): Neighborhood {
  return {
    id: row.id,
    name: row.name,
    city: row.city,
    state: row.state,
    slug: row.slug,
    averageRent: row.average_rent,
    highlights: row.highlights,
  };
}

export function mapNeighborhoodStatsRow(
  row: NeighborhoodStatsRow,
): Neighborhood & { availableProperties: number } {
  return {
    id: row.id ?? "",
    name: row.name ?? "",
    city: row.city ?? "",
    state: row.state ?? "",
    slug: row.slug ?? "",
    averageRent: row.average_rent ?? 0,
    highlights: row.highlights ?? [],
    availableProperties: row.available_properties ?? 0,
  };
}
