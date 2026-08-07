import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Building2, MessageCircle, Send } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { Page } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useRequireAuth } from "@/hooks/use-require-auth";
import {
  useConversationMessages,
  useConversations,
  useSendMessage,
  type ConversationSummary,
} from "@/hooks/use-conversations";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mensagens")({
  head: () => ({
    meta: [
      { title: "Mensagens | PagouMorou" },
      {
        name: "description",
        content:
          "Converse direto com proprietários e inquilinos pelo chat do PagouMorou: combine visitas, negocie valores e feche o aluguel de forma rápida e sem burocracia.",
      },
      { property: "og:title", content: "Mensagens | PagouMorou" },
      {
        property: "og:description",
        content:
          "Converse direto com proprietários e inquilinos pelo chat do PagouMorou: combine visitas, negocie valores e feche o aluguel de forma rápida e sem burocracia.",
      },
    ],
  }),
  component: MensagensPage,
});

const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function MensagensPage() {
  const { isAuthenticated, isLoading: isLoadingSession } = useRequireAuth();
  const { conversations, isLoading } = useConversations();
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = conversations.find((item) => item.id === activeId) ?? null;

  // Em telas grandes sempre há uma conversa aberta; no mobile a lista vem
  // primeiro e o chat só aparece depois do toque.
  useEffect(() => {
    if (activeId === null && conversations.length > 0 && window.innerWidth >= 1024) {
      setActiveId(conversations[0]!.id);
    }
  }, [activeId, conversations]);

  if (!isLoadingSession && !isAuthenticated) return null;

  return (
    <Page
      title="Mensagens"
      description="Suas conversas com proprietários e interessados."
      component="main"
    >
      {isLoadingSession || isLoading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} className="h-24 w-full rounded-card" />
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <EmptyState
          icon={MessageCircle}
          title="Sem conversas por enquanto"
          description="Quando você iniciar uma negociação com um proprietário, o histórico aparece nesta página."
          action={
            <Button asChild className="rounded-xl font-bold">
              <Link to="/buscar">Explorar imóveis</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <ul
            className={cn(
              "space-y-2 rounded-card border border-border bg-white p-2 shadow-sm",
              active && "hidden lg:block",
            )}
          >
            {conversations.map((conversation) => (
              <li key={conversation.id}>
                <ConversationRow
                  conversation={conversation}
                  active={conversation.id === activeId}
                  onSelect={() => setActiveId(conversation.id)}
                />
              </li>
            ))}
          </ul>

          {active ? (
            <ConversationThread conversation={active} onBack={() => setActiveId(null)} />
          ) : (
            <div className="hidden rounded-card border border-dashed border-border p-12 text-center text-text-secondary lg:block">
              Escolha uma conversa para ver o histórico.
            </div>
          )}
        </div>
      )}
    </Page>
  );
}

function ConversationRow({
  conversation,
  active,
  onSelect,
}: {
  conversation: ConversationSummary;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors",
        active ? "bg-primary/5" : "hover:bg-surface-secondary",
      )}
    >
      <Avatar className="size-11 shrink-0">
        {conversation.counterpartAvatarUrl ? (
          <AvatarImage src={conversation.counterpartAvatarUrl} alt="" />
        ) : null}
        <AvatarFallback className="bg-primary/10 font-bold text-primary">
          {conversation.counterpartName.slice(0, 1)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-bold">{conversation.counterpartName}</p>
          {conversation.unreadCount > 0 && (
            <Badge className="shrink-0 rounded-full bg-primary px-2 text-white">
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
        <p className="truncate text-caption text-text-secondary">{conversation.apartmentTitle}</p>
        <p className="truncate text-caption text-muted-foreground">
          {conversation.lastMessage ?? "Conversa iniciada"}
        </p>
      </div>
    </button>
  );
}

function ConversationThread({
  conversation,
  onBack,
}: {
  conversation: ConversationSummary;
  onBack: () => void;
}) {
  const { user } = useAuth();
  const { messages, isLoading, markAsRead } = useConversationMessages(conversation.id);
  const { sendMessage, isSending } = useSendMessage();
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversation.unreadCount > 0) void markAsRead();
  }, [conversation.id, conversation.unreadCount, markAsRead]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content || isSending) return;

    setDraft("");
    try {
      await sendMessage({ conversationId: conversation.id, content });
    } catch {
      // O toast de erro sai na própria mutation; devolve o texto ao campo
      // para o usuário não perder o que escreveu.
      setDraft(content);
    }
  };

  return (
    <div className="flex h-[70vh] flex-col overflow-hidden rounded-card border border-border bg-white shadow-sm">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full lg:hidden"
          onClick={onBack}
          aria-label="Voltar para a lista de conversas"
        >
          <ArrowLeft className="size-5" aria-hidden />
        </Button>

        <Avatar className="size-10">
          {conversation.counterpartAvatarUrl ? (
            <AvatarImage src={conversation.counterpartAvatarUrl} alt="" />
          ) : null}
          <AvatarFallback className="bg-primary/10 font-bold text-primary">
            {conversation.counterpartName.slice(0, 1)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="truncate font-bold">{conversation.counterpartName}</p>
          <Link
            to="/apartamento/$id"
            params={{ id: conversation.apartmentSlug }}
            className="flex items-center gap-1 truncate text-caption text-text-secondary hover:text-primary"
          >
            <Building2 className="size-3 shrink-0" aria-hidden />
            {conversation.apartmentTitle}
          </Link>
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-6">
        {isLoading ? (
          [0, 1, 2].map((index) => <Skeleton key={index} className="h-12 w-2/3 rounded-2xl" />)
        ) : messages.length === 0 ? (
          <p className="py-10 text-center text-text-secondary">Nenhuma mensagem ainda. Diga olá!</p>
        ) : (
          messages.map((message) => {
            const mine = message.senderId === user?.id;
            return (
              <div key={message.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3",
                    mine ? "bg-primary text-white" : "bg-surface-secondary text-foreground",
                  )}
                >
                  <p className="text-body whitespace-pre-wrap break-words">{message.content}</p>
                  <p
                    className={cn(
                      "mt-1 text-[11px]",
                      mine ? "text-white/70" : "text-text-secondary",
                    )}
                  >
                    {timeFormatter.format(new Date(message.sentAt))}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(event) => void handleSend(event)}
        className="flex items-center gap-2 border-t border-border px-4 py-3"
      >
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Escreva sua mensagem..."
          aria-label="Mensagem"
          className="h-12 rounded-xl"
        />
        <Button
          type="submit"
          size="icon"
          className="size-12 shrink-0 rounded-xl"
          disabled={isSending || draft.trim() === ""}
          aria-label="Enviar mensagem"
        >
          <Send className="size-5" aria-hidden />
        </Button>
      </form>
    </div>
  );
}
