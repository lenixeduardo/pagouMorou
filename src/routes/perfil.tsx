import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  UserCircle, 
  Settings, 
  FileText, 
  Home, 
  MessageSquare, 
  Bell, 
  LogOut,
  ChevronRight,
  Verified,
  Building2,
  Calendar,
  MapPin
} from "lucide-react";
import { motion } from "framer-motion";

import { Page } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PropertyCard } from "@/components/cards/property-card";
import { currentUser, apartments } from "@/mock";
import { fadeIn, stagger, container } from "@/lib/motion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Meu perfil | PagouMorou" },
      { name: "description", content: "Gerencie seus dados, contratos e anúncios de aluguel." },
    ],
  }),
  component: PerfilPage,
});

function PerfilPage() {
  // Simula os imóveis do usuário (se for proprietário)
  const userProperties = apartments.filter(apt => apt.ownerId === currentUser.id || apt.ownerId === 'user-2');
  const isOwner = currentUser.role === "owner" || userProperties.length > 0;

  return (
    <Page className="pb-20 pt-10">
      <div className="container mx-auto px-6">
        <motion.div 
          variants={stagger}
          initial="initial"
          animate="animate"
          className="grid gap-8 lg:grid-cols-[300px_1fr]"
        >
          {/* Sidebar / User Info */}
          <motion.aside variants={fadeIn} className="space-y-6">
            <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <Avatar className="size-24 border-4 border-surface-secondary">
                  <AvatarImage src={currentUser.avatarUrl} />
                  <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                    {currentUser.name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-4 flex items-center gap-1.5">
                  <h2 className="text-xl font-bold">{currentUser.name}</h2>
                  {currentUser.verified && (
                    <Verified className="size-5 fill-primary text-white" />
                  )}
                </div>
                <p className="text-sm text-text-secondary">{currentUser.email}</p>
                
                <Badge variant="secondary" className="mt-4 rounded-full px-4 py-1">
                  {currentUser.role === 'owner' ? 'Proprietário' : 'Inquilino'}
                </Badge>
              </div>

              <div className="mt-8 space-y-2">
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <Calendar className="size-4" />
                  <span>Membro desde {new Date(currentUser.memberSince).getFullYear()}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <MapPin className="size-4" />
                  <span>São Paulo, SP</span>
                </div>
              </div>

              <Button variant="outline" className="mt-8 w-full rounded-xl border-border font-bold">
                Editar Perfil
              </Button>
            </div>

            <nav className="rounded-3xl border border-border bg-white p-2 shadow-sm">
              <button className="flex w-full items-center justify-between rounded-xl bg-primary/5 px-4 py-3 text-sm font-bold text-primary transition-all">
                <div className="flex items-center gap-3">
                  <UserCircle className="size-5" />
                  Meu Painel
                </div>
                <ChevronRight className="size-4" />
              </button>
              <button className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-text-secondary transition-all hover:bg-surface-secondary">
                <div className="flex items-center gap-3">
                  <FileText className="size-5" />
                  Contratos
                </div>
                <ChevronRight className="size-4" />
              </button>
              <button className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-text-secondary transition-all hover:bg-surface-secondary">
                <div className="flex items-center gap-3">
                  <MessageSquare className="size-5" />
                  Mensagens
                </div>
                <ChevronRight className="size-4" />
              </button>
              <button className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-text-secondary transition-all hover:bg-surface-secondary">
                <div className="flex items-center gap-3">
                  <Settings className="size-5" />
                  Configurações
                </div>
                <ChevronRight className="size-4" />
              </button>
              <div className="my-2 h-px bg-border mx-2" />
              <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-danger transition-all hover:bg-danger/5">
                <LogOut className="size-5" />
                Sair da conta
              </button>
            </nav>
          </motion.aside>

          {/* Main Content */}
          <motion.div variants={fadeIn} className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <span className="text-caption font-bold text-text-secondary">Contratos</span>
                <p className="text-3xl font-bold mt-1">0</p>
              </div>
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <span className="text-caption font-bold text-text-secondary">Visitas</span>
                <p className="text-3xl font-bold mt-1">2</p>
              </div>
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <span className="text-caption font-bold text-text-secondary">Mensagens</span>
                <p className="text-3xl font-bold mt-1">1</p>
              </div>
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <span className="text-caption font-bold text-text-secondary">Favoritos</span>
                <p className="text-3xl font-bold mt-1">2</p>
              </div>
            </div>

            {/* Owner Section (Anúncios) */}
            <div>
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Meus Anúncios</h3>
                  <p className="text-text-secondary text-sm">Gerencie os imóveis que você publicou.</p>
                </div>
                <Button size="sm" className="rounded-lg font-bold" asChild>
                  <Link to="/anunciar">
                    <Building2 className="mr-2 size-4" /> Novo anúncio
                  </Link>
                </Button>
              </div>

              {userProperties.length > 0 ? (
                <motion.div 
                  variants={container}
                  initial="initial"
                  animate="animate"
                  className="grid gap-6 sm:grid-cols-2"
                >
                  {userProperties.map((apt) => (
                    <PropertyCard key={apt.id} apartment={apt} />
                  ))}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border py-12 text-center bg-white">
                  <div className="mb-4 rounded-full bg-surface-secondary p-4 text-muted">
                    <Home className="size-8" />
                  </div>
                  <h4 className="text-lg font-bold">Nenhum anúncio ativo</h4>
                  <p className="mb-6 text-sm text-text-secondary max-w-xs">
                    Você ainda não tem imóveis cadastrados para alugar.
                  </p>
                  <Button variant="outline" className="rounded-xl" asChild>
                    <Link to="/anunciar">Começar a anunciar</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Notifications Activity */}
            <div>
              <h3 className="mb-6 text-2xl font-bold">Atividade Recente</h3>
              <div className="divide-y divide-border rounded-3xl border border-border bg-white overflow-hidden shadow-sm">
                <div className="flex items-center gap-4 p-6 hover:bg-surface-secondary/50 transition-colors">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                    <Bell className="size-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">Verificação de conta concluída</p>
                    <p className="text-xs text-text-secondary truncate">Seus documentos foram validados com sucesso.</p>
                  </div>
                  <span className="text-[10px] text-muted whitespace-nowrap">Há 2 horas</span>
                </div>
                <div className="flex items-center gap-4 p-6 hover:bg-surface-secondary/50 transition-colors">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-info/10 text-info shrink-0">
                    <MessageSquare className="size-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">Nova mensagem de Rafael</p>
                    <p className="text-xs text-text-secondary truncate">Olá! O studio ainda está disponível para setembro?</p>
                  </div>
                  <span className="text-[10px] text-muted whitespace-nowrap">Há 1 dia</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Page>
  );
}
