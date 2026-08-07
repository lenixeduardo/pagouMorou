// Notificações vindas da tabela `notifications`. Elas não são mais criadas
// pelo cliente: quem grava é o próprio banco, dentro das funções de negócio
// (`send_proposal`, `respond_proposal`, `send_message`), porque notificar
// significa escrever na caixa da outra parte da negociação.
import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getBrowserSupabase } from "@/lib/supabase/browser";
import { useAuth } from "@/hooks/use-auth";
import type { AppNotification } from "@/types";

const notificationsQueryKey = (profileId: string) => ["notifications", profileId] as const;

export function useNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const profileId = user?.id ?? "";
  const queryKey = notificationsQueryKey(profileId);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey,
    queryFn: async (): Promise<AppNotification[]> => {
      const { data, error } = await getBrowserSupabase()
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30);

      if (error) throw error;

      return data.map((row) => ({
        id: row.id,
        kind: row.kind,
        title: row.title,
        description: row.description,
        createdAt: row.created_at,
        read: row.read,
        ...(row.href ? { href: row.href } : {}),
      }));
    },
    enabled: profileId !== "",
    staleTime: 30_000,
  });

  const invalidate = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  const { mutate: markAsReadMutation } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await getBrowserSupabase()
        .from("notifications")
        .update({ read: true })
        .eq("id", id);
      if (error) throw error;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<AppNotification[]>(queryKey) ?? [];
      queryClient.setQueryData<AppNotification[]>(
        queryKey,
        previous.map((item) => (item.id === id ? { ...item, read: true } : item)),
      );
      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context) queryClient.setQueryData(queryKey, context.previous);
    },
    onSettled: invalidate,
  });

  const { mutate: clearAllMutation } = useMutation({
    mutationFn: async () => {
      const { error } = await getBrowserSupabase()
        .from("notifications")
        .delete()
        .eq("profile_id", profileId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.setQueryData<AppNotification[]>(queryKey, []),
    onSettled: invalidate,
  });

  const markAsRead = useCallback(
    (id: string) => {
      if (profileId !== "") markAsReadMutation(id);
    },
    [markAsReadMutation, profileId],
  );

  const clearAll = useCallback(() => {
    if (profileId !== "") clearAllMutation();
  }, [clearAllMutation, profileId]);

  return {
    notifications,
    unreadCount: notifications.filter((item) => !item.read).length,
    isLoading,
    markAsRead,
    clearAll,
    refresh: invalidate,
  };
}
