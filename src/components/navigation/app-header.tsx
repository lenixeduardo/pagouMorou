import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bell, Menu, Plus } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { SearchInput } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { primaryNav } from "@/config/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { currentUser, notifications } from "@/mock";

export function AppHeader() {
  const unread = notifications.filter((n) => !n.read).length;
  const location = useLocation();
  const isAuthPage = location.pathname === "/entrar" || location.pathname === "/cadastro";

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70"
    >
      <div className="mx-auto grid max-w-app grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {!isAuthPage && <Logo className="shrink-0" />}
        </div>

        <div className="hidden justify-center md:flex">
          <SearchInput
            placeholder="Busque por bairro, cidade ou metrô"
            aria-label="Buscar apartamentos"
            className="max-w-lg"
            readOnly
          />
        </div>

        <div className="flex items-center gap-2 justify-self-end">
          <Button variant="ghost" size="sm" className="hidden lg:inline-flex" asChild>
            <Link to="/anunciar">
              <Plus aria-hidden />
              Anunciar imóvel
            </Link>
          </Button>

          <Button variant="ghost" size="icon" aria-label="Notificações" className="relative">
            <Bell aria-hidden />
            {unread > 0 ? (
              <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-danger" />
            ) : null}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-3 rounded-full border-border bg-background px-3 py-1.5 transition-all hover:shadow-md h-auto"
                aria-label="Menu do usuário"
              >
                <Menu className="size-4 text-text-secondary" />
                <Avatar className="size-8">
                  <AvatarFallback className="bg-surface-secondary text-caption font-bold text-text-secondary">
                    {currentUser.name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-lg">
              <DropdownMenuLabel className="text-label">{currentUser.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/perfil">Meu perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/favoritos">Favoritos</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/anunciar">Anunciar imóvel</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/entrar">Entrar</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/cadastro">Criar conta</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}