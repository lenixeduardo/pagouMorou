// Conversas e mensagens persistidas. Substitui o antigo `use-chat`, que
// guardava mensagens soltas em localStorage — sem destinatário real, sem
// histórico compartilhado entre as duas pontas da negociação.
//
// `list_conversations` já devolve o resumo pronto (imóvel, contraparte,
// última mensagem, não lidas) para a lista não precisar de N+1 consultas.
import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getBrowserSupabase } from "@/lib/supabase/browser";
import { useAuth } from "@/hooks/use-auth";
import { conversationsRefreshKey, notificationsRefreshKey } from "@/lib/queries/keys";

export interface ConversationSummary {
  id: string;
  apartmentId: string;
  apartmentTitle: string;
  apartmentSlug: string;
  apartmentImage: string | null;
  counterpartId: string;
  counterpartName: string;
  counterpartAvatarUrl: string | null;
  lastMessage: string | null;
  lastMessageAt: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  sentAt: string;
  read: boolean;
}

const conversationsQueryKey = (profileId: string) => ["conversations", profileId] as const;
const messagesQueryKey = (conversationId: string) =>
  ["conversations", "messages", conversationId] as const;

export function useConversations() {
  const { user } = useAuth();
  const profileId = user?.id ?? "";

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: conversationsQueryKey(profileId),
    queryFn: async (): Promise<ConversationSummary[]> => {
      const { data, error } = await getBrowserSupabase().rpc("list_conversations");
      if (error) throw error;

      return (data ?? []).map((row) => ({
        id: row.id,
        apartmentId: row.apartment_id,
        apartmentTitle: row.apartment_title,
        apartmentSlug: row.apartment_slug,
        apartmentImage: row.apartment_image,
        counterpartId: row.counterpart_id,
        counterpartName: row.counterpart_name,
        counterpartAvatarUrl: row.counterpart_avatar_url,
        lastMessage: row.last_message,
        lastMessageAt: row.last_message_at,
        unreadCount: row.unread_count,
      }));
    },
    enabled: profileId !== "",
    staleTime: 15_000,
  });

  return {
    conversations,
    isLoading,
    totalUnread: conversations.reduce((sum, item) => sum + item.unreadCount, 0),
  };
}

export function useConversationMessages(conversationId: string | null) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: messagesQueryKey(conversationId ?? ""),
    queryFn: async (): Promise<ChatMessage[]> => {
      const { data, error } = await getBrowserSupabase()
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId!)
        .order("created_at", { ascending: true });

      if (error) throw error;

      return data.map((row) => ({
        id: row.id,
        conversationId: row.conversation_id,
        senderId: row.sender_id,
        content: row.content,
        sentAt: row.created_at,
        read: row.read_at !== null,
      }));
    },
    enabled: conversationId !== null && user !== null,
    staleTime: 10_000,
  });

  /** A RLS de UPDATE em `messages` só alcança mensagens que o outro lado
   * enviou, então não há como marcar as próprias como lidas por engano. */
  const markAsRead = useCallback(async () => {
    if (!conversationId) return;

    const { error } = await getBrowserSupabase()
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .is("read_at", null);

    if (!error) {
      void queryClient.invalidateQueries({ queryKey: conversationsRefreshKey });
    }
  }, [conversationId, queryClient]);

  return { messages, isLoading, markAsRead };
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (input: { conversationId: string; content: string }) => {
      const { data, error } = await getBrowserSupabase().rpc("send_message", {
        p_conversation_id: input.conversationId,
        p_content: input.content,
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: messagesQueryKey(variables.conversationId) });
      void queryClient.invalidateQueries({ queryKey: conversationsRefreshKey });
      void queryClient.invalidateQueries({ queryKey: notificationsRefreshKey });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return { sendMessage: mutateAsync, isSending: isPending };
}

/**
 * Abre (ou reabre) a conversa do inquilino com o dono de um imóvel e já
 * envia a primeira mensagem. `start_conversation` é idempotente, então
 * mandar a segunda pergunta reaproveita a mesma thread.
 */
export function useStartConversation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (input: { apartmentId: string; content: string }) => {
      const supabase = getBrowserSupabase();

      const { data: conversationId, error: startError } = await supabase.rpc("start_conversation", {
        p_apartment_id: input.apartmentId,
      });
      if (startError) throw new Error(startError.message);

      const { error: sendError } = await supabase.rpc("send_message", {
        p_conversation_id: conversationId,
        p_content: input.content,
      });
      if (sendError) throw new Error(sendError.message);

      return conversationId;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: conversationsRefreshKey });
      void queryClient.invalidateQueries({ queryKey: notificationsRefreshKey });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const startConversation = useCallback(
    async (apartmentId: string, content: string) => {
      if (!user) {
        toast.error("Entre na sua conta para falar com o proprietário.");
        return null;
      }
      try {
        return await mutateAsync({ apartmentId, content });
      } catch {
        return null;
      }
    },
    [mutateAsync, user],
  );

  return { startConversation, isSending: isPending };
}
