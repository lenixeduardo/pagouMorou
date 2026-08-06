import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { listNeighborhoodStats } from "@/lib/api/neighborhoods";
import { createPublicSupabase } from "@/lib/supabase/server";

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
  handler: async ({ city }) => {
    const stats = await listNeighborhoodStats(createPublicSupabase(), city);

    const items = stats.map((neighborhood) => ({
      id: neighborhood.id,
      name: neighborhood.name,
      city: neighborhood.city,
      state: neighborhood.state,
      averageRent: neighborhood.averageRent,
      highlights: neighborhood.highlights,
      availableProperties: neighborhood.availableProperties,
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
