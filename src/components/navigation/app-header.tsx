import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bell, Menu, Settings, CheckCircle2, MessageSquare, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-notifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AppHeader() {
  const { isAuthenticated, user, signOut } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = location.pathname === "/entrar" || location.pathname === "/cadastro";

  const handleSignOut = async () => {
    await signOut();
    void navigate({ to: "/" });
  };

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
            <span className="text-sm font-medium text-text-secondary">
              inicie os 2 proximos itens do to do
            </span>
          </nav>
        </div>

        <div className="flex items-center gap-2 justify-self-end">
          {/* "Explorar imóveis" button removed per user request */}

          {/* User profile menu and notifications hidden on homepage per request */}
          {!isAuthPage &&
            (isAuthenticated || location.pathname !== "/" ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Notificações"
                      className="relative"
                    >
                      <Bell aria-hidden />
                      {unreadCount > 0 ? (
                        <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-danger" />
                      ) : null}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 rounded-2xl p-2">
                    <DropdownMenuLabel className="px-4 py-2">Notificações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-sm text-text-secondary">
                        Nenhuma notificação por enquanto.
                      </div>
                    ) : (
                      <div className="max-h-[400px] overflow-y-auto">
                        {notifications.map((notif) => {
                          const Icon =
                            notif.kind === "message"
                              ? MessageSquare
                              : notif.kind === "contract"
                                ? CheckCircle2
                                : notif.kind === "payment"
                                  ? DollarSign
                                  : Bell;
                          return (
                            <DropdownMenuItem
                              key={notif.id}
                              className={cn(
                                "flex flex-col items-start gap-1 p-4 cursor-pointer rounded-xl mb-1",
                                !notif.read && "bg-primary/5",
                              )}
                              onClick={() => markAsRead(notif.id)}
                            >
                              <div className="flex w-full items-start gap-3">
                                <div
                                  className={cn(
                                    "rounded-full p-2",
                                    notif.kind === "message"
                                      ? "bg-blue-500/10 text-blue-500"
                                      : notif.kind === "contract"
                                        ? "bg-success/10 text-success"
                                        : "bg-primary/10 text-primary",
                                  )}
                                >
                                  <Icon className="size-4" />
                                </div>
                                <div className="flex-1 space-y-1">
                                  <p className="font-bold text-sm leading-none">{notif.title}</p>
                                  <p className="text-xs text-text-secondary line-clamp-2">
                                    {notif.description}
                                  </p>
                                </div>
                              </div>
                            </DropdownMenuItem>
                          );
                        })}
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-3 rounded-full border-border bg-background px-3 py-1.5 transition-all hover:shadow-md h-auto"
                      aria-label="Menu do usuário"
                    >
                      <Menu className="size-4 text-text-secondary" />
                      <Avatar className="size-8">
                        {user?.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <AvatarFallback className="bg-surface-secondary text-caption font-bold text-text-secondary">
                            {(user?.name ?? "Visitante").slice(0, 1)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-lg">
                    <DropdownMenuLabel className="text-label">
                      {user?.name ?? "Visitante"}
                    </DropdownMenuLabel>
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
                      <Link to="/configuracoes" className="flex items-center gap-2">
                        <Settings className="size-4" />
                        Configurações
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {isAuthenticated ? (
                      <DropdownMenuItem onClick={() => void handleSignOut()}>Sair</DropdownMenuItem>
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
              <Button
                className="rounded-full px-8 h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all"
                asChild
              >
                <Link to="/entrar">Entrar</Link>
              </Button>
            ))}
        </div>
      </div>
    </motion.header>
  );
}
