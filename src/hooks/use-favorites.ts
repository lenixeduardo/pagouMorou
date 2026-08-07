// Favoritos persistidos na tabela `favorites`, protegida por RLS (cada
// perfil só enxerga e escreve os próprios). Antes viviam em localStorage e
// não sobreviviam a uma troca de dispositivo.
import { useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getBrowserSupabase } from "@/lib/supabase/browser";
import { useAuth } from "@/hooks/use-auth";

const favoritesQueryKey = (profileId: string) => ["favorites", profileId] as const;

export function useFavorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const profileId = user?.id ?? "";
  const queryKey = favoritesQueryKey(profileId);

  const { data: favorites = [], isLoading } = useQuery({
    queryKey,
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await getBrowserSupabase()
        .from("favorites")
        .select("apartment_id")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data.map((row) => row.apartment_id);
    },
    enabled: profileId !== "",
    staleTime: 30_000,
  });

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

  const { mutate } = useMutation({
    mutationFn: async ({ apartmentId, next }: { apartmentId: string; next: boolean }) => {
      const supabase = getBrowserSupabase();

      if (next) {
        const { error } = await supabase
          .from("favorites")
          .insert({ profile_id: profileId, apartment_id: apartmentId });
        if (error) throw error;
        return;
      }

      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("profile_id", profileId)
        .eq("apartment_id", apartmentId);
      if (error) throw error;
    },
    // O coração precisa reagir na hora; o servidor confirma depois.
    onMutate: async ({ apartmentId, next }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<string[]>(queryKey) ?? [];
      queryClient.setQueryData<string[]>(
        queryKey,
        next ? [apartmentId, ...previous] : previous.filter((id) => id !== apartmentId),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context) queryClient.setQueryData(queryKey, context.previous);
      toast.error("Não foi possível atualizar seus favoritos.");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });

  const isFavorite = useCallback(
    (apartmentId: string) => favoriteSet.has(apartmentId),
    [favoriteSet],
  );

  const toggleFavorite = useCallback(
    (apartmentId: string) => {
      if (profileId === "") {
        toast.error("Entre na sua conta para salvar imóveis.");
        return;
      }
      mutate({ apartmentId, next: !favoriteSet.has(apartmentId) });
    },
    [favoriteSet, mutate, profileId],
  );

  return { favorites, isFavorite, toggleFavorite, isLoading };
}
