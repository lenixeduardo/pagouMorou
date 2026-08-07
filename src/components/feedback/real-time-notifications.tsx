import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useNotifications } from "@/hooks/use-notifications";

/**
 * Monitor de Notificações em Tempo Real.
 * Este componente observa novas notificações e dispara toasts visuais.
 */
export function RealTimeNotifications() {
  const { notifications } = useNotifications();
  const lastNotificationIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!notifications || notifications.length === 0) return;

    const latest = notifications[0];
    if (!latest) return;

    // Se é a primeira vez ou uma nova notificação (id mudou)
    if (latest.id !== lastNotificationIdRef.current) {
      // Evitamos disparar no primeiro carregamento de dados históricos
      if (lastNotificationIdRef.current !== null) {
        // Se a notificação não foi lida, mostramos o toast
        if (!latest.read) {
          toast(latest.title, {
            description: latest.description,
            action: latest.href
              ? {
                  label: "Ver",
                  onClick: () => {
                    window.location.href = latest.href!;
                  },
                }
              : undefined,
          });
        }
      }
      lastNotificationIdRef.current = latest.id;
    }
  }, [notifications]);

  return null;
}
