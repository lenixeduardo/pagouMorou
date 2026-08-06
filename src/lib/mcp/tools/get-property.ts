import { ToolError, defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { apartments, neighborhoods, reviews } from "@/mock";

export default defineTool({
  name: "get_property",
  title: "Detalhes do imóvel",
  description:
    "Retorna os detalhes completos de um imóvel do PagouMorou a partir do seu id, incluindo características, comodidades e avaliações públicas.",
  inputSchema: {
    id: z.string().min(1).describe("Identificador do imóvel, ex: apt-1."),
  },
  outputSchema: {
    property: z.record(z.string(), z.unknown()),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id }) => {
    const apartment = apartments.find((item) => item.id === id);
    if (!apartment) {
      throw new ToolError(`Imóvel "${id}" não encontrado no catálogo.`);
    }

    const neighborhood = neighborhoods.find(
      (item) => item.id === apartment.address.neighborhoodId,
    );

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
        neighborhood: neighborhood?.name ?? null,
        city: apartment.address.city,
        state: apartment.address.state,
        zipCode: apartment.address.zipCode,
      },
      features: apartment.features,
      amenities: apartment.amenities,
      images: apartment.images,
      rating: apartment.rating,
      reviewsCount: apartment.reviewsCount,
      reviews: reviews
        .filter((review) => review.apartmentId === apartment.id)
        .map((review) => ({
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
        })),
      url: `/apartamento/${apartment.id}`,
    };

    return {
      content: [{ type: "text" as const, text: JSON.stringify(property, null, 2) }],
      structuredContent: { property },
    };
  },
});