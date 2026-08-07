import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { searchApartments } from "@/lib/api/apartments";
import { createPublicSupabase } from "@/lib/supabase/server";
import { PROPERTY_TYPES } from "@/lib/search/filters";
import type { Apartment } from "@/types";

/**
 * Serializa um imóvel para um formato compacto e estável para consumo por agentes.
 * Mantemos apenas dados públicos do catálogo (sem informações de contato).
 */
function serialize(apartment: Apartment) {
  return {
    id: apartment.id,
    title: apartment.title,
    status: apartment.status,
    propertyType: apartment.propertyType,
    rent: apartment.rent,
    condoFee: apartment.condoFee,
    iptu: apartment.iptu,
    totalMonthlyCost: apartment.rent + apartment.condoFee + apartment.iptu,
    neighborhood: apartment.address.neighborhoodName || null,
    city: apartment.address.city,
    state: apartment.address.state,
    bedrooms: apartment.features.bedrooms,
    bathrooms: apartment.features.bathrooms,
    areaM2: apartment.features.areaM2,
    furnished: apartment.features.furnished,
    petFriendly: apartment.features.petFriendly,
    rating: apartment.rating,
    url: `/apartamento/${apartment.slug}`,
  };
}

export default defineTool({
  name: "search_properties",
  title: "Buscar imóveis",
  description:
    "Busca imóveis residenciais disponíveis para alugar no catálogo do PagouMorou, com filtros por texto, cidade, bairro, tipo de imóvel, faixa de aluguel, dormitórios, mobília e pet. Por padrão retorna apenas imóveis com status 'available'.",
  inputSchema: {
    query: z.string().optional().describe("Texto livre: título, descrição, bairro, cidade ou rua."),
    city: z.string().optional().describe("Filtra pela cidade, ex: São Paulo."),
    neighborhood: z.string().optional().describe("Filtra pelo nome do bairro, ex: Pinheiros."),
    propertyType: z
      .enum(PROPERTY_TYPES)
      .optional()
      .describe("Tipo de imóvel: apartamento, casa, studio, loft, kitnet ou cobertura."),
    minRent: z.number().optional().describe("Aluguel mínimo em reais."),
    maxRent: z.number().optional().describe("Aluguel máximo em reais."),
    bedrooms: z.number().optional().describe("Número mínimo de dormitórios."),
    furnished: z.boolean().optional().describe("Somente imóveis mobiliados."),
    petFriendly: z.boolean().optional().describe("Somente imóveis que aceitam pets."),
    sort: z
      .enum(["relevance", "recent", "price_asc", "price_desc", "rating", "metro"])
      .optional()
      .describe("Critério de ordenação. Padrão: relevância (ou mais recentes sem texto de busca)."),
    limit: z.number().optional().describe("Máximo de resultados (padrão 10, máx. 50)."),
  },
  outputSchema: {
    count: z.number(),
    results: z.array(z.record(z.string(), z.unknown())),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (input) => {
    const limit = Math.min(Math.max(input.limit ?? 10, 1), 50);

    const { items, total } = await searchApartments(createPublicSupabase(), {
      q: input.query,
      city: input.city,
      neighborhood: input.neighborhood,
      type: input.propertyType ?? "todos",
      minRent: input.minRent,
      maxRent: input.maxRent,
      bedrooms: input.bedrooms,
      furnished: input.furnished,
      petFriendly: input.petFriendly,
      sort: input.sort ?? "relevance",
      page: 1,
      perPage: limit,
    });

    const results = items.map(serialize);

    return {
      content: [
        {
          type: "text" as const,
          text:
            results.length === 0
              ? "Nenhum imóvel encontrado com esses critérios."
              : JSON.stringify({ count: total, results }, null, 2),
        },
      ],
      structuredContent: { count: total, results },
    };
  },
});
