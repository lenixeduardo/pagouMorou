// Cliente Supabase do browser: guarda a sessão em cookies (via @supabase/ssr)
// e carrega o JWT do usuário em toda requisição, então a RLS enxerga
// `auth.uid()` de verdade. É por aqui que passam as escritas do produto —
// favoritar, mandar mensagem, propor aluguel, publicar anúncio.
//
// Leitura pública de catálogo continua no servidor (`server.ts`), com a role
// anon, para manter o SSR.
import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database";

type BrowserClient = ReturnType<typeof createBrowserClient<Database>>;

let client: BrowserClient | undefined;

export function getBrowserSupabase(): BrowserClient {
  if (typeof document === "undefined") {
    throw new Error(
      "getBrowserSupabase() só existe no browser. No servidor use createPublicSupabase().",
    );
  }

  if (!client) {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
      throw new Error("VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY não configuradas.");
    }
    client = createBrowserClient<Database>(url, anonKey);
  }

  return client;
}
