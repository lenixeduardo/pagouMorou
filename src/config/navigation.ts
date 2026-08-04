import { Heart, Home, MessageCircle, Search, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const primaryNav: NavItem[] = [
  { label: "Início", to: "/", icon: Home, exact: true },
  { label: "Buscar", to: "/buscar", icon: Search },
  { label: "Favoritos", to: "/favoritos", icon: Heart },
  { label: "Mensagens", to: "/mensagens", icon: MessageCircle },
  { label: "Perfil", to: "/perfil", icon: User },
];