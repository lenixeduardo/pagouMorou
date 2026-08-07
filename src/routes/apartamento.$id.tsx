import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Building2,
  MapPin,
  Maximize,
  Send,
  MessageSquare,
  ShieldCheck,
  // TrendingUp removed as it was unused
  Sparkles,
} from "lucide-react";
import { apartmentBySlugQueryOptions } from "@/lib/queries/apartments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/hooks/use-favorites";
import { useAuth } from "@/hooks/use-auth";
import { useProposals } from "@/hooks/use-proposals";
import { useStartConversation } from "@/hooks/use-conversations";
import { usePublicProfile } from "@/hooks/use-public-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, ChangeEvent } from "react";
import { toast } from "sonner";
import { calculateTenantScore, getScoreColor, getScoreLabel } from "@/lib/score";
import { motion, AnimatePresence } from "framer-motion";
import { slideUp } from "@/lib/motion";
import { EmptyState } from "@/components/feedback/empty-state";
import { Page } from "@/components/layout/page";

export const Route = createFileRoute("/apartamento/$id")({
  loader: async ({ context, params }) => {
    const apartment = await context.queryClient.ensureQueryData(
      apartmentBySlugQueryOptions(params.id),
    );
    if (!apartment) throw notFound();
    return apartment;
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData ? `${loaderData.title} | PagouMorou` : "Detalhes do Imóvel | PagouMorou",
      },
      {
        name: "description",
        content:
          loaderData?.description ??
          "Veja fotos e fale direto com o proprietário deste imóvel no PagouMorou. Aluguel residencial transparente e sem intermediários.",
      },
      {
        property: "og:title",
        content: loaderData
          ? `${loaderData.title} | PagouMorou`
          : "Detalhes do Imóvel | PagouMorou",
      },
      {
        property: "og:description",
        content:
          loaderData?.description ??
          "Veja fotos e fale direto com o proprietário deste imóvel no PagouMorou. Aluguel residencial transparente e sem intermediários.",
      },
    ],
  }),
  notFoundComponent: () => (
    <Page title="Imóvel não encontrado">
      <EmptyState
        icon={Building2}
        title="Imóvel não encontrado"
        description="O anúncio que você está procurando não existe ou foi removido."
        action={
          <Button asChild>
            <Link to="/buscar">Voltar para busca</Link>
          </Button>
        }
      />
    </Page>
  ),
  component: ApartamentoPage,
});

function ApartamentoPage() {
  const { id } = Route.useParams();
  const { data: apartment } = useSuspenseQuery(apartmentBySlugQueryOptions(id));
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { sendProposal, isSending } = useProposals();
  const { startConversation, isSending: isSendingMessage } = useStartConversation();
  const { data: owner } = usePublicProfile(apartment?.ownerId);

  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  const favorite = apartment ? isFavorite(apartment.id) : false;
  const tenantScore = user ? calculateTenantScore(user) : 850;
  const isOwnListing = user !== null && apartment?.ownerId === user.id;

  const handleProposal = () => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para fazer uma proposta.");
      return;
    }
    setIsProposalModalOpen(true);
  };

  const confirmProposal = async () => {
    const sent = await sendProposal({
      apartmentId: apartment!.id,
      rentAmount: apartment!.rent,
    });
    if (sent) setIsProposalModalOpen(false);
  };

  const handleSendMessage = async () => {
    const content = chatMessage.trim();
    if (!content) return;

    const conversationId = await startConversation(apartment!.id, content);
    if (conversationId) {
      setChatMessage("");
      toast.success("Mensagem enviada! Acompanhe a resposta em Mensagens.");
    }
  };

  // The loader already throws notFound() when the slug doesn't resolve, so
  // this never renders — it only narrows the type for TypeScript.
  if (!apartment) return null;

  if (!isAuthenticated && !isAuthLoading) {
    return (
      <Page fullWidth className="bg-white flex items-center justify-center py-20" component="main">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-8">
            <Building2 className="size-10" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Acesso restrito</h1>
          <p className="text-text-secondary text-lg mb-10">
            Você precisa estar logado para ver os detalhes completos deste imóvel e entrar em
            contato com o proprietário.
          </p>
          <div className="flex flex-col gap-4">
            <Button size="lg" className="rounded-2xl h-14 font-bold" asChild>
              <Link to="/cadastro">Criar conta grátis</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-2xl h-14 font-bold" asChild>
              <Link to="/entrar">Entrar</Link>
            </Button>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page fullWidth className="pb-20" component="main">
      <div className="container mx-auto px-6 pt-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-8">
            {/* Gallery Placeholder */}
            {/* Anúncios recém-publicados podem ainda não ter foto. */}
            <div className="aspect-video overflow-hidden rounded-3xl bg-surface-secondary shadow-sm">
              {apartment.images[0] ? (
                <img
                  src={apartment.images[0]}
                  alt={apartment.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-text-secondary">
                  <Building2 className="size-10" aria-hidden />
                  <span className="text-caption">Sem fotos publicadas ainda</span>
                </div>
              )}
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
                <span className="flex items-center gap-1">
                  <MapPin className="size-4" /> {apartment.address.neighborhoodName},{" "}
                  {apartment.address.city}
                </span>
                <span className="flex items-center gap-1">
                  <Maximize className="size-4" /> {apartment.features.areaM2}m²
                </span>
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
                <span className="text-lg font-bold">
                  {apartment.features.floor !== undefined ? `${apartment.features.floor}º` : "—"}
                </span>
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
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                    apartment.rent,
                  )}
                </span>
                <span className="text-sm text-text-secondary"> /mês</span>
              </div>

              <div className="mb-8 space-y-3 rounded-2xl bg-surface-secondary p-4 text-sm">
                <div className="flex justify-between">
                  <span>Condomínio</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                      apartment.condoFee,
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>IPTU</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                      apartment.iptu,
                    )}
                  </span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                  <span>Total do pacote</span>
                  <span className="text-primary">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                      apartment.rent + apartment.condoFee + apartment.iptu,
                    )}
                  </span>
                </div>
              </div>

              {isOwnListing ? (
                <div className="rounded-2xl border border-border bg-surface-secondary p-4 text-center">
                  <p className="text-body font-bold">Este anúncio é seu</p>
                  <p className="mt-1 text-caption text-text-secondary">
                    Acompanhe propostas e mensagens pelo seu painel.
                  </p>
                  <Button variant="outline" className="mt-4 w-full rounded-xl font-bold" asChild>
                    <Link to="/perfil">Ir para o painel</Link>
                  </Button>
                </div>
              ) : (
                <>
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
                        aria-label="Mensagem para o proprietário"
                        className="h-12 rounded-xl"
                        value={chatMessage}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setChatMessage(e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            void handleSendMessage();
                          }
                        }}
                      />
                      <Button
                        size="icon"
                        className="h-12 w-12 shrink-0 rounded-xl"
                        disabled={isSendingMessage || chatMessage.trim() === ""}
                        onClick={() => void handleSendMessage()}
                        aria-label="Enviar mensagem ao proprietário"
                      >
                        <Send className="size-5" aria-hidden />
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full h-12 font-bold rounded-xl border-border flex items-center gap-2"
                      asChild
                    >
                      <Link to="/mensagens">
                        <MessageSquare className="size-4" aria-hidden />
                        Ver minhas conversas
                      </Link>
                    </Button>
                  </div>
                </>
              )}

              {owner && (
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-6">
                  <Avatar className="size-11">
                    {owner.avatarUrl ? <AvatarImage src={owner.avatarUrl} alt="" /> : null}
                    <AvatarFallback className="bg-primary/10 font-bold text-primary">
                      {owner.name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-caption text-text-secondary">Anunciado por</p>
                    <p className="flex items-center gap-1 truncate font-bold">
                      {owner.name}
                      {owner.verified && (
                        <ShieldCheck className="size-4 shrink-0 text-primary" aria-hidden />
                      )}
                    </p>
                  </div>
                </div>
              )}
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsProposalModalOpen(false)}
                  className="rounded-full"
                >
                  <Heart className="size-5 rotate-45" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl bg-surface-secondary p-6">
                  <p className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">
                    Seu Perfil de Inquilino
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "size-16 rounded-full flex items-center justify-center bg-white shadow-sm border-2",
                          tenantScore >= 800 ? "border-emerald-500" : "border-border",
                        )}
                      >
                        {tenantScore >= 800 ? (
                          <Sparkles className="size-8 text-emerald-500" />
                        ) : (
                          <ShieldCheck className={cn("size-8", getScoreColor(tenantScore))} />
                        )}
                      </div>
                      <div>
                        <p className="text-2xl font-bold leading-none">{tenantScore}</p>
                        <p
                          className={cn(
                            "text-xs font-bold uppercase tracking-widest mt-1",
                            getScoreColor(tenantScore),
                          )}
                        >
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
                      className={cn(
                        "h-full",
                        tenantScore >= 800
                          ? "bg-emerald-500"
                          : tenantScore >= 600
                            ? "bg-primary"
                            : tenantScore >= 400
                              ? "bg-warning"
                              : "bg-danger",
                      )}
                    />
                  </div>
                  <p className="mt-4 text-xs text-text-secondary leading-relaxed">
                    Seu score será exibido ao proprietário para aumentar a confiança na sua
                    proposta.
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
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(apartment?.rent || 0)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg"
                    disabled={isSending}
                    onClick={() => void confirmProposal()}
                  >
                    {isSending ? "Enviando..." : "Confirmar e Enviar Proposta"}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full h-12 rounded-xl text-text-secondary"
                    onClick={() => setIsProposalModalOpen(false)}
                  >
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
