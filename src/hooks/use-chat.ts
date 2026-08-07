import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Message } from "@/types";

const CONVERSATION_PREFIX = "conv-apt-";

/** Id determinístico da conversa de um imóvel, compartilhado por quem envia e quem lista. */
export const conversationIdForApartment = (apartmentId: string) =>
  `${CONVERSATION_PREFIX}${apartmentId}`;

/** Inverso de `conversationIdForApartment`; `null` para ids fora desse esquema. */
export const apartmentIdFromConversationId = (conversationId: string) =>
  conversationId.startsWith(CONVERSATION_PREFIX)
    ? conversationId.slice(CONVERSATION_PREFIX.length)
    : null;

interface ChatStore {
  messages: Message[];
  sendMessage: (conversationId: string, senderId: string, content: string) => void;
}

export const useChat = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],
      sendMessage: (conversationId, senderId, content) => {
        const newMessage: Message = {
          id: Math.random().toString(36).substring(7),
          conversationId,
          senderId,
          content,
          sentAt: new Date().toISOString(),
          read: false,
        };
        set((state) => ({ messages: [...state.messages, newMessage] }));
      },
    }),
    { name: "chat-storage" }
  )
);
