import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { calculateTenantScore, calculateOwnerScore, getScoreColor, getScoreLabel } from "@/lib/score";
import { ShieldCheck, TrendingUp, AlertTriangle, CloudUpload, Sparkles } from "lucide-react";
import { useEffect, useState, ChangeEvent, useCallback } from "react";
import { useAuthStore } from "@/hooks/use-auth";
import { useProposals } from "@/hooks/use-proposals";
import { useNotifications } from "@/hooks/use-notifications";
import confetti from "canvas-confetti";
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
  Plus,
  Star
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
      {
        name: "description",
        content:
          "Gerencie seu perfil, anúncios e propostas no PagouMorou. Tudo o que você precisa para sua locação em um só lugar.",
      },
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
  const isOwner = user?.type === 'proprietario';
  const isTenant = user?.type === 'inquilino';

  // Meus anúncios
  const myApartments = apartments.filter(apt => apt.ownerId === user?.id);
  
  // Propostas recebidas
  const receivedProposals = proposals.filter(p => 
    myApartments.some(apt => apt.id === p.apartmentId)
  );

  // Mock de dados para score se não existirem
  const mockUserForScore = {
    ...user,
    avatarUrl: user?.avatarUrl,
    scoreFactors: user?.scoreFactors || {
      lowStability: false,
      contractBreach: false,
      positiveOwnerReviews: 85,
      latePayments: 0,
      incompleteDocs: false,
      incompleteProfile: false,
      noAvatar: !user?.avatarUrl,
      chatResponseTime: "high"
    }
  };

  const tenantScore = calculateTenantScore(mockUserForScore as any);
  const ownerScore = calculateOwnerScore(mockUserForScore as any, myApartments);

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

  const triggerEmeraldCelebration = useCallback(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#10b981', '#34d399', '#059669']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#10b981', '#34d399', '#059669']
      });
    }, 250);
  }, []);

  const handleKycUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.promise(
        new Promise((resolve) => setTimeout(resolve, 2000)),
        {
          loading: 'Validando documentos...',
          success: () => {
            updateUser({ 
              verified: true,
              scoreFactors: { 
                ...user?.scoreFactors, 
                incompleteDocs: false,
                kycVerified: true 
              } 
            });
            addNotification({
              kind: "system",
              title: "Identidade Verificada!",
              description: "Seus documentos foram validados. Seu score aumentou!",
            });
            return 'Documentos validados com sucesso!';
          },
          error: 'Erro ao validar documentos.',
        }
      );
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/entrar" });
      return;
    }
    
    // Se o usuário atingiu o status de Top User, celebra!
    const isTop = (isOwner && ownerScore >= 800) || (isTenant && tenantScore >= 800);
    const wasAlreadyCelebrated = sessionStorage.getItem(`celebrated-${user?.id}`);
    
    if (isTop && !wasAlreadyCelebrated) {
      triggerEmeraldCelebration();
      sessionStorage.setItem(`celebrated-${user?.id}`, 'true');
      toast.success("Parabéns! Você atingiu o status de Top User!", {
        icon: <Sparkles className="text-emerald-500" />,
        duration: 5000,
      });
    }

    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => {
      clearTimeout(timer);
    };
  }, [isAuthenticated, navigate, isOwner, isTenant, ownerScore, tenantScore, triggerEmeraldCelebration, user?.id]);




  if (!isAuthenticated) return null;

  // Simula os imóveis do usuário (se for proprietário)
  const userProperties = apartments.slice(0, 2);

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
                  <div className={cn(
                    "relative p-1 rounded-full transition-all duration-500",
                    ((isOwner && ownerScore >= 800) || (isTenant && tenantScore >= 800)) && "bg-gradient-to-tr from-emerald-500 via-emerald-400 to-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                  )}>
                    {((isOwner && ownerScore >= 800) || (isTenant && tenantScore >= 800)) && (
                      <div className="absolute inset-x-[-20px] top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10">
                        <svg viewBox="0 0 24 24" className="size-14 fill-emerald-600/90 -rotate-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                          <path d="M12 21c-4.4 0-8-3.6-8-8 0-4.4 3.6-8 8-8s8 3.6 8 8c0 4.4-3.6 8-8 8zm-5-8.5c0-3.3 2-6 5-7.2V4c-4.4 1.2-8 5.4-8 10.4 0 5 3.6 9.2 8 10.4v-2.3c-3-1.2-5-3.9-5-7.2z" />
                        </svg>
                        <svg viewBox="0 0 24 24" className="size-14 fill-emerald-600/90 rotate-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                          <path d="M12 21c4.4 0 8-3.6 8-8 0-4.4-3.6-8-8-8s-8 3.6-8 8c0 4.4 3.6 8 8 8zm5-8.5c0-3.3-2-6-5-7.2V4c4.4 1.2 8 5.4 8 10.4 0 5-3.6 9.2-8 10.4v-2.3c3-1.2 5-3.9 5-7.2z" />
                        </svg>
                      </div>
                    )}

                    <Avatar className={cn(
                      "size-24 border-4",
                      ((isOwner && ownerScore >= 800) || (isTenant && tenantScore >= 800)) 
                        ? "border-emerald-50" 
                        : "border-surface-secondary"
                    )}>
                      <AvatarImage src={user?.avatarUrl || currentUser.avatarUrl} />
                      <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                        {user?.name?.slice(0, 1) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <label 
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110 active:scale-95 z-20"
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
                  {isOwner && ownerScore >= 800 && (
                    <Badge variant="secondary" className="bg-emerald-500 text-white hover:bg-emerald-600 border-none flex items-center gap-1 shadow-sm">
                      <Star className="size-3 fill-white" />
                      Top User
                    </Badge>
                  )}
                  {isTenant && tenantScore >= 800 && (
                    <Badge variant="secondary" className="bg-emerald-500 text-white hover:bg-emerald-600 border-none flex items-center gap-1 shadow-sm">
                      <Star className="size-3 fill-white" />
                      Top User
                    </Badge>
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
            {/* Stats & Score */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {isTenant && (
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm overflow-hidden relative">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-caption font-bold text-text-secondary">Tenant Score</span>
                    <ShieldCheck className={cn("size-5", getScoreColor(tenantScore))} />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className={cn("text-3xl font-bold", getScoreColor(tenantScore))}>{tenantScore}</p>
                    <span className="text-xs font-medium text-text-secondary">/ 1000</span>
                  </div>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Perfil {getScoreLabel(tenantScore)}
                  </p>
                  <div className="absolute bottom-0 left-0 h-1 bg-surface-secondary w-full">
                    <div 
                      className={cn("h-full transition-all duration-1000", 
                        tenantScore >= 800 ? "bg-success" : 
                        tenantScore >= 600 ? "bg-primary" : 
                        tenantScore >= 400 ? "bg-warning" : "bg-danger"
                      )}
                      style={{ width: `${(tenantScore / 1000) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {isOwner && (
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm overflow-hidden relative">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-caption font-bold text-text-secondary">Owner Score</span>
                    <ShieldCheck className={cn("size-5", getScoreColor(ownerScore))} />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className={cn("text-3xl font-bold", getScoreColor(ownerScore))}>{ownerScore}</p>
                    <span className="text-xs font-medium text-text-secondary">/ 1000</span>
                  </div>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Reputação {getScoreLabel(ownerScore)}
                  </p>
                  <div className="absolute bottom-0 left-0 h-1 bg-surface-secondary w-full">
                    <div 
                      className={cn("h-full transition-all duration-1000", 
                        ownerScore >= 800 ? "bg-success" : 
                        ownerScore >= 600 ? "bg-primary" : 
                        ownerScore >= 400 ? "bg-warning" : "bg-danger"
                      )}
                      style={{ width: `${(ownerScore / 1000) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* KYC Status Card */}
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm overflow-hidden relative">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-caption font-bold text-text-secondary">Segurança KYC</span>
                  {user?.scoreFactors?.kycVerified ? (
                    <CheckCircle2 className="size-5 text-success" />
                  ) : (
                    <CloudUpload className="size-5 text-warning" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-xl font-bold">
                    {user?.scoreFactors?.kycVerified ? "Verificado" : "Pendente"}
                  </p>
                  {!user?.scoreFactors?.kycVerified && (
                    <label className="cursor-pointer group">
                      <span className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                        Enviar Documentos <ChevronRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,image/*" 
                        onChange={handleKycUpload}
                      />
                    </label>
                  )}
                  {user?.scoreFactors?.kycVerified && (
                    <p className="text-xs text-text-secondary">Seus dados estão protegidos.</p>
                  )}
                </div>
              </div>
              
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <span className="text-caption font-bold text-text-secondary">
                  {isOwner ? "Meus Anúncios" : "Imóveis Alugados"}
                </span>
                {isLoading ? <Skeleton className="h-9 w-12 mt-1" /> : <p className="text-3xl font-bold mt-1">{isOwner ? myApartments.length : 0}</p>}
              </div>
              
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <span className="text-caption font-bold text-text-secondary">Propostas</span>
                {isLoading ? <Skeleton className="h-9 w-12 mt-1" /> : <p className="text-3xl font-bold mt-1">{receivedProposals.length}</p>}
              </div>

              {isOwner && (
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                  <span className="text-caption font-bold text-text-secondary">Mensagens</span>
                  {isLoading ? <Skeleton className="h-9 w-12 mt-1" /> : <p className="text-3xl font-bold mt-1">1</p>}
                </div>
              )}
            </div>

            {isOwner && (
              <Card className="border-border overflow-hidden">
                <CardHeader className="bg-surface-secondary/30 pb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-5 text-primary" />
                    <CardTitle className="text-lg">Dicas para seu Owner Score</CardTitle>
                  </div>
                  <CardDescription>
                    Anúncios completos e respostas rápidas atraem inquilinos melhores e aumentam sua visibilidade.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-success/10 p-1.5 text-success">
                        <Camera className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Capriche nas fotos</p>
                        <p className="text-xs text-text-secondary">Anúncios com 5+ fotos de alta qualidade têm 3x mais propostas.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-1.5 text-primary">
                        <FileText className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Descrição completa</p>
                        <p className="text-xs text-text-secondary">Inclua pontos de interesse, detalhes dos cômodos e itens da mobília.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-info/10 p-1.5 text-info">
                        <Clock className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Rapidez é fundamental</p>
                        <p className="text-xs text-text-secondary">Responda chats e revise propostas em menos de 24h.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-success/10 p-1.5 text-success">
                        <Verified className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Documentação em dia</p>
                        <p className="text-xs text-text-secondary">Proprietários verificados transmitem mais confiança e segurança.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {isTenant && (
              <Card className="border-border overflow-hidden">
                <CardHeader className="bg-surface-secondary/30 pb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-5 text-primary" />
                    <CardTitle className="text-lg">Como ser um Top Inquilino?</CardTitle>
                  </div>
                  <CardDescription>
                    Um score alto garante prioridade nas propostas e melhores condições de locação.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-success/10 p-1.5 text-success">
                        <Calendar className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Estabilidade é chave</p>
                        <p className="text-xs text-text-secondary">Evite quebras de contrato e permaneça mais tempo nos imóveis.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-1.5 text-primary">
                        <CheckCircle2 className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Pagamentos em dia</p>
                        <p className="text-xs text-text-secondary">Mantenha seu histórico de aluguel impecável e sem atrasos.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-info/10 p-1.5 text-info">
                        <Star className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Boas avaliações</p>
                        <p className="text-xs text-text-secondary">Seja um bom morador e receba ótimas recomendações de proprietários.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-success/10 p-1.5 text-success">
                        <UserCircle className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Perfil completo</p>
                        <p className="text-xs text-text-secondary">Avatar, documentos e perfil 100% preenchidos aumentam sua confiança.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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
                      <div key={i} className="space-y-4">
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
