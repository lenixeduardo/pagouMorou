import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, MapPin, Maximize, Send, MessageSquare, ShieldCheck, TrendingUp, Sparkles } from "lucide-react";
import { apartments } from "@/mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/hooks/use-favorites";
import { useAuthStore } from "@/hooks/use-auth";
import { useProposals } from "@/hooks/use-proposals";
import { useNotifications } from "@/hooks/use-notifications";
import { useChat } from "@/hooks/use-chat";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, ChangeEvent } from "react";
import { toast } from "sonner";
import { calculateTenantScore, getScoreColor, getScoreLabel } from "@/lib/score";
import { motion, AnimatePresence } from "framer-motion";
import { slideUp, fadeIn } from "@/lib/motion";
import { EmptyState } from "@/components/feedback/empty-state";
import { Page } from "@/components/layout/page";

import { EmptyState } from "@/components/feedback/empty-state";
import { Page } from "@/components/layout/page";

export const Route = createFileRoute("/apartamento/$id")({
  head: () => ({
    meta: [
      { title: "Detalhes do Imóvel | PagouMorou" },
      {
        name: "description",
        content:
          "Veja fotos e fale direto com o proprietário deste imóvel no PagouMorou. Aluguel residencial transparente e sem intermediários.",
      },
      { property: "og:title", content: "Detalhes do Imóvel | PagouMorou" },
      {
        property: "og:description",
        content:
          "Veja fotos e fale direto com o proprietário deste imóvel no PagouMorou. Aluguel residencial transparente e sem intermediários.",
      },
    ],
  }),
  component: ApartamentoPage,
});

function ApartamentoPage() {
  const { id } = Route.useParams();
  const apartment = apartments.find((a) => a.id === id);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user, isAuthenticated } = useAuthStore();
  const { addProposal } = useProposals();
  const { addNotification } = useNotifications();
  const { sendMessage } = useChat();
  
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);

  const favorite = apartment ? isFavorite(apartment.id) : false;
  const tenantScore = user ? calculateTenantScore(user) : 850;

  const handleProposal = () => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para fazer uma proposta.");
      return;
    }
    setIsProposalModalOpen(true);
  };

  const confirmProposal = () => {
    addProposal({
      apartmentId: apartment!.id,
      tenantId: user!.id,
      tenantName: user!.name,
      rentAmount: apartment!.rent,
    });

    addNotification({
      kind: "contract",
      title: "Proposta enviada",
      description: `Sua proposta para ${apartment!.title} foi enviada ao proprietário.`,
      href: "/perfil",
    });

    setIsProposalModalOpen(false);
    toast.success("Proposta enviada com sucesso!");
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para enviar mensagens.");
      return;
    }

    sendMessage(`conv-${apartment!.id}`, user!.id, chatMessage);
    addNotification({
      kind: "message",
      title: "Mensagem enviada",
      description: `Você enviou uma mensagem sobre o imóvel ${apartment!.title}.`,
      href: "/mensagens",
    });
    setChatMessage("");
    toast.success("Mensagem enviada!");
  };

  if (!apartment) {
    return (
      <Page title="Imóvel não encontrado">
        <EmptyState
          icon={Building2}
          title="Imóvel não encontrado"
          description="O anúncio que você está procurando não existe ou foi removido."
          action={<Button asChild><Link to="/buscar" search={{ type: "Todos", bedrooms: undefined, minPrice: 0, maxPrice: 20000, sort: "relevance", q: "" }}>Voltar para busca</Link></Button>}
        />
      </Page>
    );
  }

  return (
    <Page fullWidth className="pb-20" component="main">
      <div className="container mx-auto px-6 pt-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-8">
            {/* Gallery Placeholder */}
            <div className="aspect-video overflow-hidden rounded-3xl bg-surface-secondary shadow-sm">
              <img 
                src={apartment.images[0]} 
                alt={apartment.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-display text-4xl font-bold">{apartment.title}</h1>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-2xl border-border shrink-0"
                  onClick={() => toggleFavorite(apartment.id)}
                >
                  <Heart className={cn("size-5", favorite && "fill-danger text-danger")} />
                </Button>
              </div>
              <div className="flex items-center gap-4 text-text-secondary">
                <span className="flex items-center gap-1"><MapPin className="size-4" /> {apartment.address.neighborhoodId}, {apartment.address.city}</span>
                <span className="flex items-center gap-1"><Maximize className="size-4" /> {apartment.features.areaM2}m²</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 rounded-3xl border border-border p-6 shadow-xs">
              <div className="text-center">
                <span className="text-xs text-text-secondary block">Quartos</span>
                <span className="text-lg font-bold">{apartment.features.bedrooms}</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-text-secondary block">Banheiros</span>
                <span className="text-lg font-bold">{apartment.features.bathrooms}</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-text-secondary block">Vagas</span>
                <span className="text-lg font-bold">{apartment.features.parkingSpots}</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-text-secondary block">Andar</span>
                <span className="text-lg font-bold">{apartment.features.floor}º</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Sobre este imóvel</h3>
              <p className="leading-relaxed text-text-secondary">{apartment.description}</p>
            </div>
          </div>

          <aside>
            <div className="sticky top-28 rounded-3xl border border-border bg-white p-8 shadow-lg">
              <div className="mb-6 space-y-1">
                <span className="text-3xl font-bold text-primary">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(apartment.rent)}
                </span>
                <span className="text-sm text-text-secondary"> /mês</span>
              </div>

              <div className="mb-8 space-y-3 rounded-2xl bg-surface-secondary p-4 text-sm">
                <div className="flex justify-between">
                  <span>Condomínio</span>
                  <span className="font-medium">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(apartment.condoFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>IPTU</span>
                  <span className="font-medium">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(apartment.iptu)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                  <span>Total do pacote</span>
                  <span className="text-primary">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(apartment.rent + apartment.condoFee + apartment.iptu)}</span>
                </div>
              </div>

              <Button 
                className="w-full h-14 text-lg font-bold rounded-2xl shadow-md transition-all active:scale-[0.98]"
                onClick={handleProposal}
              >
                Quero alugar
              </Button>
              
              <div className="mt-4 space-y-3">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Tire suas dúvidas..." 
                    className="h-12 rounded-xl"
                    value={chatMessage}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setChatMessage(e.target.value)}
                  />
                  <Button 
                    size="icon" 
                    className="h-12 w-12 shrink-0 rounded-xl"
                    onClick={handleSendMessage}
                  >
                    <Send className="size-5" />
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full h-12 font-bold rounded-xl border-border flex items-center gap-2"
                >
                  <MessageSquare className="size-4" />
                  Falar com proprietário
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
      {/* Modal de Prévia da Proposta com Score */}
      <AnimatePresence>
        {isProposalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsProposalModalOpen(false)}
            />
            <motion.div
              variants={slideUp}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative w-full max-w-lg overflow-hidden rounded-[32px] bg-white p-8 shadow-2xl"
            >
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Resumo da Proposta</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsProposalModalOpen(false)} className="rounded-full">
                  <Heart className="size-5 rotate-45" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl bg-surface-secondary p-6">
                  <p className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Seu Perfil de Inquilino</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "size-16 rounded-full flex items-center justify-center bg-white shadow-sm border-2",
                        tenantScore >= 800 ? "border-emerald-500" : "border-border"
                      )}>
                        {tenantScore >= 800 ? (
                          <Sparkles className="size-8 text-emerald-500" />
                        ) : (
                          <ShieldCheck className={cn("size-8", getScoreColor(tenantScore))} />
                        )}
                      </div>
                      <div>
                        <p className="text-2xl font-bold leading-none">{tenantScore}</p>
                        <p className={cn("text-xs font-bold uppercase tracking-widest mt-1", getScoreColor(tenantScore))}>
                          {getScoreLabel(tenantScore)}
                        </p>
                      </div>
                    </div>
                    {tenantScore >= 800 && (
                      <Badge className="bg-emerald-500 text-white rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                        Top Inquilino
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mt-4 h-1.5 w-full bg-border rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(tenantScore / 1000) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={cn("h-full", 
                        tenantScore >= 800 ? "bg-emerald-500" : 
                        tenantScore >= 600 ? "bg-primary" : 
                        tenantScore >= 400 ? "bg-warning" : "bg-danger"
                      )}
                    />
                  </div>
                  <p className="mt-4 text-xs text-text-secondary leading-relaxed">
                    Seu score será exibido ao proprietário para aumentar a confiança na sua proposta.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-text-secondary">Imóvel</span>
                    <span className="font-bold">{apartment?.title}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-text-secondary">Valor do Aluguel</span>
                    <span className="font-bold text-primary">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(apartment?.rent || 0)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg" onClick={confirmProposal}>
                    Confirmar e Enviar Proposta
                  </Button>
                  <Button variant="ghost" className="w-full h-12 rounded-xl text-text-secondary" onClick={() => setIsProposalModalOpen(false)}>
                    Revisar detalhes
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Page>
  );
}