import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { apartments, neighborhoods } from "@/mock";

export default defineTool({
  name: "list_neighborhoods",
  title: "Listar bairros",
  description:
    "Lista os bairros atendidos pelo PagouMorou com aluguel médio, destaques e quantidade de imóveis disponíveis.",
  inputSchema: {
    city: z.string().optional().describe("Filtra os bairros por cidade."),
  },
  outputSchema: {
    count: z.number(),
    neighborhoods: z.array(z.record(z.string(), z.unknown())),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ city }) => {
    const items = neighborhoods
      .filter((neighborhood) =>
        city ? neighborhood.city.toLowerCase().includes(city.toLowerCase()) : true,
      )
      .map((neighborhood) => ({
        id: neighborhood.id,
        name: neighborhood.name,
        city: neighborhood.city,
        state: neighborhood.state,
        averageRent: neighborhood.averageRent,
        highlights: neighborhood.highlights,
        availableProperties: apartments.filter(
          (apartment) =>
            apartment.address.neighborhoodId === neighborhood.id &&
            apartment.status === "available",
        ).length,
      }));

    return {
      content: [
        {
          type: "text" as const,
          text:
            items.length === 0
              ? "Nenhum bairro encontrado para essa cidade."
              : JSON.stringify(items, null, 2),
        },
      ],
      structuredContent: { count: items.length, neighborhoods: items },
    };
  },
});