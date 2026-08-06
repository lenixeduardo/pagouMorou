import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, MapPin, Maximize, Send, MessageSquare } from "lucide-react";
import { apartments } from "@/mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFavorites } from "@/hooks/use-favorites";
import { useAuthStore } from "@/hooks/use-auth";
import { useProposals } from "@/hooks/use-proposals";
import { useNotifications } from "@/hooks/use-notifications";
import { useChat } from "@/hooks/use-chat";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, ChangeEvent } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/feedback/empty-state";
import { Page } from "@/components/layout/page";

export const Route = createFileRoute("/apartamento/$id")({
  head: () => ({
    meta: [
      { title: "Detalhes do Imóvel | PagouMorou" },
      {
        name: "description",
        content: "Veja fotos, valores e fale direto com o proprietário deste imóvel no PagouMorou.",
      },
      { property: "og:title", content: "Detalhes do Imóvel | PagouMorou" },
      {
        property: "og:description",
        content: "Veja fotos, valores e fale direto com o proprietário deste imóvel no PagouMorou.",
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

  const handleProposal = () => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para fazer uma proposta.");
      return;
    }
    
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
    </Page>
  );
}