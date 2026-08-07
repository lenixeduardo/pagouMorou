// Dados públicos de um perfil (proprietário de um anúncio, contraparte de
// uma conversa). `profiles` só é legível pelo próprio dono; a RPC
// `public_profiles` é a única porta de saída dos campos não sensíveis —
// e-mail e telefone não passam por ela.
import { useQuery } from "@tanstack/react-query";

import { getBrowserSupabase } from "@/lib/supabase/browser";
import type { UserRole } from "@/types";

export interface PublicProfile {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: UserRole;
  verified: boolean;
  memberSince: string;
  score: number | null;
}

export function usePublicProfile(profileId: string | undefined) {
  return useQuery({
    queryKey: ["public-profile", profileId ?? ""],
    queryFn: async (): Promise<PublicProfile | null> => {
      const { data, error } = await getBrowserSupabase().rpc("public_profiles", {
        p_ids: [profileId!],
      });
      if (error) throw error;

      const row = data?.[0];
      if (!row) return null;

      return {
        id: row.id,
        name: row.name,
        avatarUrl: row.avatar_url,
        role: row.role,
        verified: row.verified,
        memberSince: row.member_since,
        score: row.score,
      };
    },
    enabled: Boolean(profileId),
    staleTime: 5 * 60_000,
  });
}
