import type { Database } from "@/types/database";
import type { Apartment, Neighborhood } from "@/types";

type ApartmentRow = Database["public"]["Tables"]["apartments"]["Row"];
type ApartmentImageRow = Database["public"]["Tables"]["apartment_images"]["Row"];
type NeighborhoodRow = Database["public"]["Tables"]["neighborhoods"]["Row"];
type NeighborhoodStatsRow = Database["public"]["Views"]["neighborhood_stats"]["Row"];
type SearchApartmentRow = Database["public"]["Functions"]["search_apartments"]["Returns"][number];

export type ApartmentRowWithImages = ApartmentRow & {
  apartment_images: ApartmentImageRow[] | null;
};

/** `exactOptionalPropertyTypes` rejects `{ floor: null }` and `{ floor: undefined }`
 * alike for an optional field — this only assigns the key when the DB value exists. */
function optional<K extends string, V>(key: K, value: V | null | undefined): { [P in K]?: V } {
  return (value === null || value === undefined ? {} : { [key]: value }) as { [P in K]?: V };
}

function imageUrl(image: ApartmentImageRow): string | null {
  return image.external_url ?? image.storage_path;
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
    ownerId: row.owner_id,
    rating: row.rating,
    reviewsCount: row.reviews_count,
    ...optional("metroDistanceM", row.metro_distance_m),
    createdAt: row.created_at,
  };
}

interface SearchResultImage {
  id: string;
  external_url: string | null;
  storage_path: string | null;
  position: number;
  alt: string | null;
  width: number | null;
  height: number | null;
}

/** Maps one row of `search_apartments(...)` RPC output — same shape as
 * `mapApartmentRow`, except images arrive pre-aggregated as jsonb (the RPC
 * has no relational embedding, so it packs them itself; see the migration
 * `0009_search_apartments_rpc`). */
export function mapSearchResultRow(row: SearchApartmentRow): Apartment {
  const rawImages = Array.isArray(row.images) ? (row.images as unknown as SearchResultImage[]) : [];
  const images = rawImages
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((image) => image.external_url ?? image.storage_path)
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
