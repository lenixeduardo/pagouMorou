import { neighborhoods } from "@/mock";
import type { Apartment, ID, Neighborhood } from "@/types";

const neighborhoodById = new Map<ID, Neighborhood>(neighborhoods.map((nb) => [nb.id, nb]));

/** Resolve o id interno do bairro (`nb-1`) para o nome exibível ("Vila Madalena"). */
export function neighborhoodName(id: ID): string {
  return neighborhoodById.get(id)?.name ?? id;
}

/** Minúsculas e sem acentos, para que "metro" encontre "metrô" e "sao" encontre "São". */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

/**
 * Casa o texto digitado com título, bairro, cidade, estado e rua — o que a interface
 * promete no placeholder da busca.
 */
export function matchesQuery(apartment: Apartment, term: string): boolean {
  const query = normalize(term.trim());
  if (!query) return true;

  const haystack = [
    apartment.title,
    neighborhoodName(apartment.address.neighborhoodId),
    apartment.address.city,
    apartment.address.state,
    apartment.address.street,
  ].map(normalize);

  return haystack.some((field) => field.includes(query));
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Apartamentos: ["apartamento", "apto"],
  Casas: ["casa", "sobrado"],
  Studios: ["studio", "kitnet"],
  Lofts: ["loft"],
};

/** Categoriza pelo título do anúncio, sem depender do plural do rótulo do filtro. */
export function matchesCategory(apartment: Apartment, filter: string): boolean {
  if (filter === "Todos") return true;

  const keywords = CATEGORY_KEYWORDS[filter];
  if (!keywords) return true;

  const title = normalize(apartment.title);
  return keywords.some((keyword) => title.includes(normalize(keyword)));
}

/**
 * Proximidade de metrô derivada do que o catálogo realmente contém: um destaque de
 * metrô no bairro ou a menção explícita na descrição do anúncio.
 */
export function isNearMetro(apartment: Apartment): boolean {
  const neighborhood = neighborhoodById.get(apartment.address.neighborhoodId);
  const highlightsMetro = neighborhood?.highlights.some((highlight) =>
    normalize(highlight).includes("metro"),
  );
  if (highlightsMetro) return true;

  const description = normalize(apartment.description);
  return description.includes("metro") || description.includes("estacao");
}

/** Mais recentes primeiro, por `createdAt` — não pela ordem do array. */
export function sortByRecency(list: Apartment[]): Apartment[] {
  return [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
