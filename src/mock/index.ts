import type { User } from "@/types";

// The property catalog (imóveis, bairros, reviews) now lives in Postgres —
// see `src/lib/api/` and the seed migrations on the `pagoumorou` Supabase
// project. What's left here is fake-session placeholder data, still used by
// the zustand `useAuthStore` mock login until Fase 3 wires real Supabase
// Auth + `profiles`.
export const users: User[] = [
  {
    id: "user-1",
    name: "Marina Alves",
    email: "marina.alves@email.com",
    phone: "+55 11 98888-1010",
    role: "tenant",
    verified: true,
    memberSince: "2024-03-12T00:00:00.000Z",
  },
  {
    id: "user-2",
    name: "Rafael Monteiro",
    email: "rafael.monteiro@email.com",
    phone: "+55 11 97777-2233",
    role: "owner",
    verified: true,
    memberSince: "2023-08-02T00:00:00.000Z",
  },
  {
    id: "user-3",
    name: "Camila Duarte",
    email: "camila.duarte@email.com",
    role: "owner",
    verified: false,
    memberSince: "2025-01-19T00:00:00.000Z",
  },
];

export const currentUser: User = users[0]!;
