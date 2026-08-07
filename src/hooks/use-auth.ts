// Sessão real do Supabase Auth. Substitui o store zustand de fake-login:
// a fonte da verdade agora é o cookie de sessão + a linha em `profiles`,
// e é o JWT dessa sessão que faz a RLS liberar (ou não) cada escrita.
import { useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getBrowserSupabase } from "@/lib/supabase/browser";
import { mapProfileRow, translateAuthError } from "@/lib/auth/profile";
import type { User, UserRole } from "@/types";

export const authQueryKey = ["auth", "profile"] as const;

/** No SSR não existe cookie de sessão acessível ao cliente do browser, então
 * a query fica desabilitada e o perfil chega na hidratação. */
const isBrowser = () => typeof document !== "undefined";

async function fetchCurrentProfile(): Promise<User | null> {
  const supabase = getBrowserSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapProfileRow(data) : null;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: authQueryKey,
    queryFn: fetchCurrentProfile,
    staleTime: 5 * 60_000,
    retry: false,
    enabled: isBrowser(),
  });

  const user = data ?? null;

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: authQueryKey });
  }, [queryClient]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await getBrowserSupabase().auth.signInWithPassword({ email, password });
      if (error) throw new Error(translateAuthError(error.message));
      await refresh();
    },
    [refresh],
  );

  /** Retorna `true` quando a sessão já veio pronta e `false` quando o projeto
   * exige confirmação de e-mail antes do primeiro login. */
  const signUp = useCallback(
    async (input: { name: string; email: string; password: string; role: UserRole }) => {
      const { data: result, error } = await getBrowserSupabase().auth.signUp({
        email: input.email,
        password: input.password,
        // Lido pelo trigger `handle_new_auth_user` na criação do profile.
        options: { data: { name: input.name, role: input.role } },
      });
      if (error) throw new Error(translateAuthError(error.message));

      await refresh();
      return result.session !== null;
    },
    [refresh],
  );

  const signOut = useCallback(async () => {
    await getBrowserSupabase().auth.signOut();
    // Favoritos, propostas, conversas e notificações são todos por perfil —
    // nada do usuário anterior pode sobrar em cache.
    queryClient.clear();
    await refresh();
  }, [queryClient, refresh]);

  const updateProfile = useCallback(
    async (patch: Partial<Pick<User, "name" | "phone" | "avatarUrl">>) => {
      if (!user) throw new Error("É preciso estar autenticado.");

      const { data: row, error } = await getBrowserSupabase()
        .from("profiles")
        .update({
          ...(patch.name !== undefined ? { name: patch.name } : {}),
          ...(patch.phone !== undefined ? { phone: patch.phone } : {}),
          ...(patch.avatarUrl !== undefined ? { avatar_url: patch.avatarUrl } : {}),
        })
        .eq("id", user.id)
        .select("*")
        .single();

      if (error) throw error;
      queryClient.setQueryData(authQueryKey, mapProfileRow(row));
    },
    [queryClient, user],
  );

  return {
    user,
    isAuthenticated: user !== null,
    isLoading: isPending,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refresh,
  };
}

/**
 * Mantém o cache de perfil alinhado com o GoTrue (login, logout, refresh de
 * token, sessão restaurada em outra aba). Montado uma única vez na raiz.
 */
export function useAuthListener() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = getBrowserSupabase().auth.onAuthStateChange(() => {
      void queryClient.invalidateQueries({ queryKey: authQueryKey });
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);
}
