import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

import { useAuth } from "@/hooks/use-auth";

/**
 * Guarda de rota privada. A sessão só é conhecida depois da hidratação, então
 * quem consome precisa esperar `isLoading` — redirecionar antes disso jogaria
 * um usuário logado para /entrar em todo primeiro render.
 */
export function useRequireAuth() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      void navigate({ to: "/entrar", replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return { user, isAuthenticated, isLoading };
}
