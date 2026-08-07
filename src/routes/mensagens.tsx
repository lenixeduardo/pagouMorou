import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { useMemo } from "react";

import { EmptyState } from "@/components/feedback/empty-state";
import { DemoNotice } from "@/components/feedback/demo-notice";
import { Page } from "@/components/layout/page";
import { apartmentIdFromConversationId, useChat } from "@/hooks/use-chat";
import { apartments } from "@/mock";
import type { Apartment, Message } from "@/types";
import { formatRelative } from "@/utils/format";

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

interface ConversationSummary {
  conversationId: string;
  apartment: Apartment | undefined;
  lastMessage: Message;
  messageCount: number;
}

function summarize(messages: Message[]): ConversationSummary[] {
  const byConversation = new Map<string, Message[]>();

  for (const message of messages) {
    const thread = byConversation.get(message.conversationId);
    if (thread) {
      thread.push(message);
    } else {
      byConversation.set(message.conversationId, [message]);
    }
  }

  return [...byConversation.entries()]
    .map(([conversationId, thread]) => {
      const ordered = [...thread].sort(
        (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime(),
      );
      const apartmentId = apartmentIdFromConversationId(conversationId);

      return {
        conversationId,
        apartment: apartmentId ? apartments.find((apt) => apt.id === apartmentId) : undefined,
        lastMessage: ordered[ordered.length - 1]!,
        messageCount: ordered.length,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.lastMessage.sentAt).getTime() - new Date(a.lastMessage.sentAt).getTime(),
    );
}

function MensagensPage() {
  const { messages } = useChat();
  const conversations = useMemo(() => summarize(messages), [messages]);

  return (
    <Page title="Mensagens" description="As conversas com proprietários ficarão aqui." component="main">
      <div className="space-y-6">
        <DemoNotice variant="block">
          Estas conversas existem apenas neste navegador: as mensagens não são entregues ao
          proprietário nem sincronizadas entre dispositivos.
        </DemoNotice>

        {conversations.length > 0 ? (
          <ul className="space-y-3">
            {conversations.map(({ conversationId, apartment, lastMessage, messageCount }) => (
              <li key={conversationId}>
                <div className="relative flex items-center gap-4 rounded-card border border-border bg-card p-4 shadow-xs transition-shadow hover:shadow-md">
                  <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-surface-secondary">
                    {apartment?.images[0] ? (
                      <img
                        src={apartment.images[0]}
                        alt=""
                        loading="lazy"
                        className="size-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="truncate text-title text-foreground">
                        {apartment ? (
                          <Link
                            to="/apartamento/$id"
                            params={{ id: apartment.id }}
                            className="outline-none after:absolute after:inset-0 after:content-['']"
                          >
                            {apartment.title}
                          </Link>
                        ) : (
                          "Imóvel indisponível"
                        )}
                      </h3>
                      <span className="shrink-0 text-caption text-text-secondary">
                        {formatRelative(lastMessage.sentAt)}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-body text-text-secondary">
                      {lastMessage.content}
                    </p>
                    <p className="mt-1 text-caption text-text-secondary">
                      {messageCount} {messageCount === 1 ? "mensagem enviada" : "mensagens enviadas"}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={MessageCircle}
            title="Sem conversas por enquanto"
            description="Quando você iniciar uma negociação, o histórico aparece nesta página."
          />
        )}
      </div>
    </Page>
  );
}
