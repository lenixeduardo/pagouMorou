// Server-only. Resolves Supabase config across the two runtimes this app
// hits: `bun run dev` (Node, `process.env`) and Cloudflare Workers in
// production, where secrets arrive as the `env` object passed into
// `fetch(request, env, ctx)` — see `src/server.ts`, which stores it here on
// every request via `setWorkerEnv`.
//
// `VITE_*` vars are safe to read here too (they're inlined into the client
// bundle by Vite), but the service-role key — added in a later phase — must
// never carry a `VITE_` prefix, or it ships to the browser.

let workerEnv: Record<string, string | undefined> | undefined;

export function setWorkerEnv(env: unknown): void {
  if (env && typeof env === "object") {
    workerEnv = env as Record<string, string | undefined>;
  }
}

function readProcessEnv(key: string): string | undefined {
  return typeof process !== "undefined" ? process.env[key] : undefined;
}

export function getSupabaseUrl(): string {
  const url =
    workerEnv?.["VITE_SUPABASE_URL"] ??
    readProcessEnv("VITE_SUPABASE_URL") ??
    import.meta.env.VITE_SUPABASE_URL;
  if (!url) throw new Error("VITE_SUPABASE_URL não configurada.");
  return url;
}

export function getSupabaseAnonKey(): string {
  const key =
    workerEnv?.["VITE_SUPABASE_ANON_KEY"] ??
    readProcessEnv("VITE_SUPABASE_ANON_KEY") ??
    import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!key) throw new Error("VITE_SUPABASE_ANON_KEY não configurada.");
  return key;
}
