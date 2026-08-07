import type { Database } from "@/types/database";
import type { User } from "@/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

/** `exactOptionalPropertyTypes` recusa `{ phone: null }` num campo opcional;
 * só atribui a chave quando o banco tem valor. */
function optional<K extends string, V>(key: K, value: V | null | undefined): { [P in K]?: V } {
  return (value === null || value === undefined ? {} : { [key]: value }) as { [P in K]?: V };
}

/** Linha de `profiles` (snake_case) → modelo de domínio `User`. Fica fora de
 * `lib/api/mappers.ts` de propósito: aquele módulo é server-only, e o perfil
 * do usuário logado é carregado pelo browser. */
export function mapProfileRow(row: ProfileRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email ?? "",
    role: row.role,
    verified: row.verified,
    verification: row.verification,
    memberSince: row.member_since,
    ...optional("phone", row.phone),
    ...optional("avatarUrl", row.avatar_url),
    ...optional("score", row.score),
    scoreFactors: (row.score_factors ?? {}) as NonNullable<User["scoreFactors"]>,
  };
}

/** As mensagens do GoTrue chegam em inglês; a UI é pt-BR. */
export function translateAuthError(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) return "E-mail ou senha incorretos.";
  if (normalized.includes("email not confirmed")) {
    return "Confirme seu e-mail antes de entrar.";
  }
  if (
    normalized.includes("user already registered") ||
    normalized.includes("already been registered")
  ) {
    return "Já existe uma conta com este e-mail.";
  }
  if (normalized.includes("password should be at least")) {
    return "A senha precisa ter pelo menos 6 caracteres.";
  }
  if (normalized.includes("unable to validate email") || normalized.includes("invalid email")) {
    return "E-mail inválido.";
  }
  if (normalized.includes("rate limit") || normalized.includes("too many requests")) {
    return "Muitas tentativas. Aguarde alguns instantes e tente de novo.";
  }

  return message;
}
