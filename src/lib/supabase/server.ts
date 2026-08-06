// Server-only Supabase clients. Never import this from client components —
// it's kept out of `src/lib/supabase/` client exports on purpose; there is
// no browser client yet (added in Fase 3, alongside cookie-based sessions).
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env.server";

/**
 * Anon-role client for public catalogue reads (routes' loaders/server
 * functions and the MCP tools). No cookies, no session — RLS's `anon`
 * policies apply. The cookie-bound, session-aware client arrives in Fase 3.
 */
export function createPublicSupabase() {
  return createClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
