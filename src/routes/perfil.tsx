import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, ChangeEvent } from "react";
import { useAuthStore } from "@/hooks/use-auth";
import { useProposals } from "@/hooks/use-proposals";
import { useNotifications } from "@/hooks/use-notifications";
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
  MapPin,
  Bot,
  Camera,
  CheckCircle2,
  Clock,
  Plus
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { SkeletonCardGrid } from "@/components/cards/skeleton-card";


export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Meu Perfil | PagouMorou" },
      { name: "description", content: "Gerencie seus dados, contratos e anúncios de aluguel no painel do usuário PagouMorou." },
    ],
  }),
  component: PerfilPage,
});

function PerfilPage() {
  const { isAuthenticated, user, updateUser, logout } = useAuthStore();
  const { proposals, updateStatus } = useProposals();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("anuncios");

  // Meus anúncios
  const myApartments = apartments.filter(apt => apt.ownerId === user?.id);
  
  // Propostas recebidas
  const receivedProposals = proposals.filter(p => 
    myApartments.some(apt => apt.id === p.apartmentId)
  );

  const handleApproveProposal = (id: string) => {
    updateStatus(id, "approved");
    const proposal = proposals.find(p => p.id === id);
    if (proposal) {
      addNotification({
        kind: "contract",
        title: "Proposta Aprovada!",
        description: `Sua proposta para o imóvel foi aprovada. Prepare os documentos!`,
        href: "/perfil",
      });
    }
  };

  const handleRejectProposal = (id: string) => {
    updateStatus(id, "rejected");
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/entrar" });
      return;
    }
    
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => {
      clearTimeout(timer);
    };
  }, [isAuthenticated, navigate]);




  if (!isAuthenticated) return null;

  // Simula os imóveis do usuário (se for proprietário)
  const userProperties = apartments.slice(0, 2);
  const isOwner = user?.type === 'proprietario';

  return (
    <Page className="pb-20 pt-10" component="main">
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
                <div className="relative group">
                  <Avatar className="size-24 border-4 border-surface-secondary">
                    <AvatarImage src={user?.avatarUrl || currentUser.avatarUrl} />
                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                      {user?.name?.slice(0, 1) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <label 
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
                  >
                    <Camera className="size-4" />
                    <input 
                      id="avatar-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            updateUser({ avatarUrl: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <div className="mt-4 flex items-center gap-1.5">
                  <h2 className="text-xl font-bold">{user?.name}</h2>
                  {currentUser.verified && (
                    <Verified className="size-5 fill-primary text-white" />
                  )}
                </div>
                <p className="text-sm text-text-secondary">{user?.email}</p>
                
                <Badge variant="secondary" className="mt-4 rounded-full px-4 py-1">
                  {user?.type === 'proprietario' ? 'Proprietário' : 'Inquilino'}
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

              <Button variant="outline" className="mt-8 w-full rounded-xl border-border font-bold" asChild>
                <Link to="/configuracoes">Editar Perfil</Link>
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
              <Link 
                to="/perfil/agentes" 
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-text-secondary transition-all hover:bg-surface-secondary"
              >
                <div className="flex items-center gap-3">
                  <Bot className="size-5" />
                  Agentes (MCP)
                </div>
                <ChevronRight className="size-4" />
              </Link>
              <Link 
                to="/configuracoes" 
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-text-secondary transition-all hover:bg-surface-secondary",
                  "hover:text-primary"
                )}
              >
                <div className="flex items-center gap-3">
                  <Settings className="size-5" />
                  Configurações
                </div>
                <ChevronRight className="size-4" />
              </Link>
              <div className="my-2 h-px bg-border mx-2" />
              <button 
                onClick={() => logout()}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-danger transition-all hover:bg-danger/5 text-left"
              >
                <LogOut className="size-5" />
                Sair da conta
              </button>
            </nav>
          </motion.aside>

          <motion.div variants={fadeIn} className="flex-1 space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <span className="text-caption font-bold text-text-secondary">Meus Anúncios</span>
                {isLoading ? <Skeleton className="h-9 w-12 mt-1" /> : <p className="text-3xl font-bold mt-1">{myApartments.length}</p>}
              </div>
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <span className="text-caption font-bold text-text-secondary">Propostas</span>
                {isLoading ? <Skeleton className="h-9 w-12 mt-1" /> : <p className="text-3xl font-bold mt-1">{receivedProposals.length}</p>}
              </div>
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <span className="text-caption font-bold text-text-secondary">Mensagens</span>
                {isLoading ? <Skeleton className="h-9 w-12 mt-1" /> : <p className="text-3xl font-bold mt-1">1</p>}
              </div>
            </div>

            <Tabs defaultValue="anuncios" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="mb-8 grid w-full grid-cols-2 rounded-2xl bg-surface-secondary p-1">
                <TabsTrigger value="anuncios" className="rounded-xl py-3 font-bold">Meus Anúncios</TabsTrigger>
                <TabsTrigger value="propostas" className="rounded-xl py-3 font-bold">
                  Propostas {receivedProposals.length > 0 && <Badge variant="secondary" className="ml-2">{receivedProposals.length}</Badge>}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="anuncios">
                {isLoading ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {[1, 2].map((i) => (
                      <div key={i} className="space-y-4" key={i}>
                        <Skeleton className="aspect-video w-full rounded-3xl" />
                        <Skeleton className="h-6 w-2/3" />
                        <Skeleton className="h-4 w-1/3" />
                      </div>
                    ))}
                  </div>
                ) : myApartments.length === 0 ? (
                  <Card className="border-dashed py-12 text-center">
                    <CardContent>
                      <Building2 className="mx-auto mb-4 size-12 text-muted" />
                      <CardTitle className="mb-2">Você ainda não tem anúncios</CardTitle>
                      <CardDescription className="mb-6">
                        Anuncie seu imóvel no PagouMorou e encontre inquilinos rapidamente.
                      </CardDescription>
                      <Button asChild className="rounded-xl font-bold">
                        <Link to="/anunciar">Começar a anunciar</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <motion.div 
                    variants={container}
                    initial="initial"
                    animate="animate"
                    className="grid gap-6 md:grid-cols-2"
                  >
                    {myApartments.map((apt) => (
                      <motion.div key={apt.id} variants={fadeIn}>
                        <PropertyCard apartment={apt} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="propostas" className="space-y-6">
                {receivedProposals.length === 0 ? (
                  <Card className="border-dashed py-12 text-center">
                    <CardContent>
                      <Clock className="mx-auto mb-4 size-12 text-muted" />
                      <CardTitle className="mb-2">Nenhuma proposta recebida</CardTitle>
                      <CardDescription>
                        Quando alguém se interessar pelo seu imóvel, as propostas aparecerão aqui.
                      </CardDescription>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {receivedProposals.map((proposal) => {
                      const apt = apartments.find(a => a.id === proposal.apartmentId);
                      return (
                        <Card key={proposal.id} className="overflow-hidden border-border transition-all hover:shadow-md">
                          <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="space-y-1">
                              <CardTitle className="text-xl">{proposal.tenantName}</CardTitle>
                              <CardDescription className="flex items-center gap-1">
                                <Building2 className="size-3" /> {apt?.title}
                              </CardDescription>
                            </div>
                            <Badge 
                              variant={proposal.status === "pending" ? "outline" : proposal.status === "approved" ? "default" : "destructive"}
                              className={cn(
                                proposal.status === "approved" && "bg-success hover:bg-success/90",
                                proposal.status === "pending" && "text-warning border-warning"
                              )}
                            >
                              {proposal.status === "pending" ? "Pendente" : proposal.status === "approved" ? "Aprovada" : "Recusada"}
                            </Badge>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div className="text-2xl font-bold text-primary">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.rentAmount)}
                                <span className="text-sm font-normal text-text-secondary"> /mês</span>
                              </div>
                              {proposal.status === "pending" && (
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="rounded-lg text-danger border-danger hover:bg-danger/5"
                                    onClick={() => handleRejectProposal(proposal.id)}
                                  >
                                    Recusar
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    className="rounded-lg bg-success hover:bg-success/90"
                                    onClick={() => handleApproveProposal(proposal.id)}
                                  >
                                    Aprovar
                                  </Button>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </Page>
  );
}
