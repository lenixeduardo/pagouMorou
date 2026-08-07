// Publicação de anúncio. A inserção vai pela RPC `create_apartment`, que
// resolve o bairro (criando o registro se ainda não existir), gera um slug
// único e promove quem anuncia a proprietário — coisas que o cliente não
// tem como garantir sozinho sem corrida.
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getBrowserSupabase } from "@/lib/supabase/browser";
import { useAuth } from "@/hooks/use-auth";
import { uploadApartmentPhotos } from "@/lib/storage/upload";
import { apartmentsRefreshKey } from "@/lib/queries/keys";
import { authQueryKey } from "@/hooks/use-auth";
import type { PropertyType } from "@/types";

export interface NewApartmentInput {
  title: string;
  description: string;
  propertyType: PropertyType;
  rent: number;
  condoFee: number;
  iptu: number;
  street: string;
  number: string;
  zipCode: string;
  neighborhood: string;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  areaM2: number;
  furnished: boolean;
  petFriendly: boolean;
  amenities: string[];
  photos: File[];
  standardClauses?: string[];
}

export function useCreateApartment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (input: NewApartmentInput) => {
      if (!user) throw new Error("É preciso estar autenticado para anunciar.");
      const supabase = getBrowserSupabase();

      const { data: apartment, error } = await supabase.rpc("create_apartment", {
        p_title: input.title,
        p_description: input.description,
        p_property_type: input.propertyType,
        p_rent: input.rent,
        p_condo_fee: input.condoFee,
        p_iptu: input.iptu,
        p_street: input.street,
        p_number: input.number,
        p_zip_code: input.zipCode,
        p_neighborhood: input.neighborhood,
        p_city: input.city,
        p_state: input.state,
        p_bedrooms: input.bedrooms,
        p_bathrooms: input.bathrooms,
        p_parking_spots: input.parkingSpots,
        p_area_m2: input.areaM2,
        p_furnished: input.furnished,
        p_pet_friendly: input.petFriendly,
        p_amenities: input.amenities,
        p_standard_clauses: input.standardClauses ?? [],
      });

      if (error) throw new Error(error.message);

      if (input.photos.length > 0) {
        const { uploaded, failed } = await uploadApartmentPhotos(
          user.id,
          apartment.id,
          input.photos,
        );

        if (uploaded.length > 0) {
          const { error: imagesError } = await supabase.from("apartment_images").insert(
            uploaded.map((photo) => ({
              apartment_id: apartment.id,
              storage_path: photo.path,
              position: photo.position,
              alt: input.title,
            })),
          );
          if (imagesError) throw imagesError;
        }

        // O anúncio já existe; avisar sobre as fotos que faltaram é melhor
        // do que fingir que tudo deu certo.
        if (failed > 0) {
          toast.warning(
            failed === 1
              ? "Uma foto não pôde ser enviada. Você pode adicioná-la depois."
              : `${failed} fotos não puderam ser enviadas. Você pode adicioná-las depois.`,
          );
        }
      }

      return apartment;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: apartmentsRefreshKey });
      // create_apartment promove o perfil a `owner`.
      void queryClient.invalidateQueries({ queryKey: authQueryKey });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return { createApartment: mutateAsync, isCreating: isPending };
}
