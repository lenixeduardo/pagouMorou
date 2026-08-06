import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { apartments, neighborhoods } from "@/mock";
import type { Apartment } from "@/types";

/**
 * Serializa um imóvel para um formato compacto e estável para consumo por agentes.
 * Mantemos apenas dados públicos do catálogo (sem informações de contato).
 */
function serialize(apartment: Apartment) {
  const neighborhood = neighborhoods.find(
    (item) => item.id === apartment.address.neighborhoodId,
  );

  return {
    id: apartment.id,
    title: apartment.title,
    status: apartment.status,
    rent: apartment.rent,
    condoFee: apartment.condoFee,
    iptu: apartment.iptu,
    totalMonthlyCost: apartment.rent + apartment.condoFee + apartment.iptu,
    neighborhood: neighborhood?.name ?? null,
    city: apartment.address.city,
    state: apartment.address.state,
    bedrooms: apartment.features.bedrooms,
    bathrooms: apartment.features.bathrooms,
    areaM2: apartment.features.areaM2,
    furnished: apartment.features.furnished,
    petFriendly: apartment.features.petFriendly,
    rating: apartment.rating,
    url: `/apartamento/${apartment.id}`,
  };
}

export default defineTool({
  name: "search_properties",
  title: "Buscar imóveis",
  description:
    "Busca imóveis residenciais para alugar no catálogo do PagouMorou, com filtros por texto, cidade, bairro, faixa de aluguel, dormitórios e mobília.",
  inputSchema: {
    query: z
      .string()
      .optional()
      .describe("Texto livre: título, bairro, cidade ou rua."),
    city: z.string().optional().describe("Filtra pela cidade, ex: São Paulo."),
    neighborhood: z
      .string()
      .optional()
      .describe("Filtra pelo nome do bairro, ex: Pinheiros."),
    minRent: z.number().optional().describe("Aluguel mínimo em reais."),
    maxRent: z.number().optional().describe("Aluguel máximo em reais."),
    bedrooms: z.number().optional().describe("Número mínimo de dormitórios."),
    furnished: z.boolean().optional().describe("Somente imóveis mobiliados."),
    limit: z.number().optional().describe("Máximo de resultados (padrão 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: (input) => {
    const limit = Math.min(Math.max(input.limit ?? 10, 1), 50);
    const term = input.query?.trim().toLowerCase();

    const results = apartments
      .filter((apartment) => {
        const neighborhood = neighborhoods.find(
          (item) => item.id === apartment.address.neighborhoodId,
        );

        if (term) {
          const haystack = [
            apartment.title,
            apartment.description,
            apartment.address.street,
            apartment.address.city,
            neighborhood?.name ?? "",
          ]
            .join(" ")
            .toLowerCase();
          if (!haystack.includes(term)) return false;
        }

        if (
          input.city &&
          !apartment.address.city.toLowerCase().includes(input.city.toLowerCase())
        ) {
          return false;
        }

        if (
          input.neighborhood &&
          !(neighborhood?.name ?? "")
            .toLowerCase()
            .includes(input.neighborhood.toLowerCase())
        ) {
          return false;
        }

        if (typeof input.minRent === "number" && apartment.rent < input.minRent) return false;
        if (typeof input.maxRent === "number" && apartment.rent > input.maxRent) return false;
        if (
          typeof input.bedrooms === "number" &&
          apartment.features.bedrooms < input.bedrooms
        ) {
          return false;
        }
        if (
          typeof input.furnished === "boolean" &&
          apartment.features.furnished !== input.furnished
        ) {
          return false;
        }

        return true;
      })
      .slice(0, limit)
      .map(serialize);

    return {
      content: [
        {
          type: "text" as const,
          text:
            results.length === 0
              ? "Nenhum imóvel encontrado com esses critérios."
              : JSON.stringify(results, null, 2),
        },
      ],
      structuredContent: { count: results.length, results },
    };
  },
});