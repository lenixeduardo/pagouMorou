import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bell, Menu, Settings } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { SearchInput } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/hooks/use-auth";
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
  const { isAuthenticated, user, logout } = useAuthStore();
  const unread = notifications.filter((n) => !n.read).length;
  const location = useLocation();
  const isAuthPage = location.pathname === "/entrar" || location.pathname === "/cadastro";

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="sticky top-0 z-40 border-b border-border bg-[#F9FBF9]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#F9FBF9]/70"
    >
      <div className="mx-auto flex w-full items-center justify-between gap-4 px-2 py-3 md:px-4">
        <div className="flex items-center gap-4">
          {!isAuthPage && <Logo className="shrink-0" />}
          
          <nav className="hidden items-center gap-6 lg:flex">
            {/* Nav items removed per user request for clean landing state */}
          </nav>
        </div>

        <div className="flex items-center gap-2 justify-self-end">
          {/* "Explorar imóveis" button removed per user request */}

          {/* User profile menu and notifications hidden on homepage per request */}
          {!isAuthPage && (
            isAuthenticated || location.pathname !== "/" ? (
              <>
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
                        {isAuthenticated && user?.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                          <AvatarFallback className="bg-surface-secondary text-caption font-bold text-text-secondary">
                            {(isAuthenticated ? (user?.name || "U") : currentUser.name).slice(0, 1)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-lg">
                    <DropdownMenuLabel className="text-label">{isAuthenticated ? user?.name : currentUser.name}</DropdownMenuLabel>
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
                    <DropdownMenuItem asChild>
                      <Link to="/perfil" className="flex items-center gap-2">
                        <Settings className="size-4" />
                        Configurações
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {isAuthenticated ? (
                      <DropdownMenuItem onClick={() => logout()}>
                        Sair
                      </DropdownMenuItem>
                    ) : (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/entrar">Entrar</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/cadastro">Criar conta</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button className="rounded-full px-8 h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all" asChild>
                <Link to="/entrar">Entrar</Link>
              </Button>
            )
          )}
        </div>
      </div>
    </motion.header>
  );
}