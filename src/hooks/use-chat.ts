import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Message } from "@/types";

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
