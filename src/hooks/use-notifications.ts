import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AppNotification } from "@/types";
import { toast } from "sonner";

interface NotificationsStore {
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, "id" | "createdAt" | "read">) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

export const useNotifications = create<NotificationsStore>()(
  persist(
    (set) => ({
      notifications: [],
      addNotification: (data) => {
        const newNotif: AppNotification = {
          ...data,
          id: Math.random().toString(36).substring(7),
          createdAt: new Date().toISOString(),
          read: false,
        };
        set((state) => ({ notifications: [newNotif, ...state.notifications] }));
        toast(newNotif.title, { description: newNotif.description });
      },
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      clearAll: () => set({ notifications: [] }),
    }),
    { name: "notifications-storage" }
  )
);
