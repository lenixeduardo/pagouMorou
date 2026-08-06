import { ToolError, defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getApartmentBySlug } from "@/lib/api/apartments";
import { listApartmentReviews } from "@/lib/api/reviews";
import { createPublicSupabase } from "@/lib/supabase/server";

export default defineTool({
  name: "get_property",
  title: "Detalhes do imóvel",
  description:
    "Retorna os detalhes completos de um imóvel do PagouMorou a partir do seu slug (o identificador usado na URL /apartamento/:slug), incluindo características, comodidades e avaliações públicas.",
  inputSchema: {
    id: z
      .string()
      .min(1)
      .describe("Slug do imóvel, ex: studio-claro-com-varanda-na-vila-madalena."),
  },
  outputSchema: {
    property: z.record(z.string(), z.unknown()),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id }) => {
    const client = createPublicSupabase();
    const apartment = await getApartmentBySlug(client, id);
    if (!apartment) {
      throw new ToolError(`Imóvel "${id}" não encontrado no catálogo.`);
    }

    const reviews = await listApartmentReviews(client, apartment.id);

    const property = {
      id: apartment.id,
      title: apartment.title,
      description: apartment.description,
      status: apartment.status,
      rent: apartment.rent,
      condoFee: apartment.condoFee,
      iptu: apartment.iptu,
      totalMonthlyCost: apartment.rent + apartment.condoFee + apartment.iptu,
      address: {
        street: apartment.address.street,
        number: apartment.address.number,
        neighborhood: apartment.address.neighborhoodName || null,
        city: apartment.address.city,
        state: apartment.address.state,
        zipCode: apartment.address.zipCode,
      },
      features: apartment.features,
      amenities: apartment.amenities,
      images: apartment.images,
      rating: apartment.rating,
      reviewsCount: apartment.reviewsCount,
      reviews,
      url: `/apartamento/${apartment.slug}`,
    };

    return {
      content: [{ type: "text" as const, text: JSON.stringify(property, null, 2) }],
      structuredContent: { property },
    };
  },
});
