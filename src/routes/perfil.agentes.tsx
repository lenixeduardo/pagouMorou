import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuthStore } from "@/hooks/use-auth";
import { Bot, Key, Shield, Plus, Info, ExternalLink, ChevronLeft } from "lucide-react";
import { Page } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { fadeIn, stagger } from "@/lib/motion";

export const Route = createFileRoute("/perfil/agentes")({
  head: () => ({
    meta: [
      { title: "Integrações de Agentes | PagouMorou" },
      { name: "description", content: "Gerencie integrações MCP para agentes de IA." },
    ],
  }),
  component: AgentIntegrationsPage,
});

function AgentIntegrationsPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/entrar" });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;
  return (
    <Page 
      className="pb-20 pt-10"
      component="main"
    >
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div 
          variants={stagger}
          initial="initial"
          animate="animate"
          className="space-y-8"
        >
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="rounded-full">
              <Link to="/perfil">
                <ChevronLeft className="size-6" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Integrações de Agentes</h1>
              <p className="text-text-secondary">Gerencie chaves e permissões para agentes de IA (MCP).</p>
            </div>
          </div>

          {/* Connection Status */}
          <motion.div variants={fadeIn}>
            <Card className="border-primary/20 bg-primary/5 rounded-3xl overflow-hidden">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-6">
                <div className="rounded-2xl bg-primary/20 p-3">
                  <Bot className="size-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Conector MCP Ativo</CardTitle>
                  <CardDescription>O protocolo Model Context Protocol está habilitado para sua conta.</CardDescription>
                </div>
                <Badge variant="outline" className="ml-auto bg-primary/10 text-primary border-primary/20 rounded-full px-3">
                  Conectado
                </Badge>
              </CardHeader>
            </Card>
          </motion.div>

          {/* API Keys */}
          <motion.div variants={fadeIn} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Key className="size-5" /> Chaves de Acesso
              </h2>
              <Button size="sm" className="gap-2 rounded-xl font-bold">
                <Plus className="size-4" /> Nova Chave
              </Button>
            </div>
            
            <div className="grid gap-4">
              {[
                { name: "Claude Desktop", lastUsed: "2 horas atrás", status: "Ativa" },
                { name: "Cursor IDE", lastUsed: "Ontem", status: "Ativa" },
              ].map((key) => (
                <Card key={key.name} className="rounded-2xl border-border shadow-sm">
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <p className="font-bold text-lg">{key.name}</p>
                      <p className="text-sm text-text-secondary">Último uso: {key.lastUsed}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="rounded-full px-3">{key.status}</Badge>
                      <Button variant="ghost" size="sm" className="text-danger font-bold hover:bg-danger/5">Revogar</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Permissions */}
          <motion.div variants={fadeIn} className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Shield className="size-5" /> Permissões do Agente
            </h2>
            <Card className="rounded-3xl border-border shadow-sm">
              <CardHeader className="p-6 pb-0">
                <CardTitle className="text-lg">O que os agentes podem fazer?</CardTitle>
                <CardDescription>Configure o nível de autonomia concedido aos modelos de linguagem.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
                  <div>
                    <p className="font-bold">Leitura de Anúncios</p>
                    <p className="text-sm text-text-secondary">Permite que o agente analise seus imóveis publicados.</p>
                  </div>
                  <div className="h-7 w-12 rounded-full bg-primary relative cursor-pointer transition-colors shadow-inner">
                    <div className="absolute right-1 top-1 size-5 rounded-full bg-white shadow-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
                  <div>
                    <p className="font-bold">Gestão de Mensagens</p>
                    <p className="text-sm text-text-secondary">O agente pode responder dúvidas básicas de interessados.</p>
                  </div>
                  <div className="h-7 w-12 rounded-full bg-muted relative cursor-pointer transition-colors shadow-inner">
                    <div className="absolute left-1 top-1 size-5 rounded-full bg-white shadow-sm" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Info Box */}
          <motion.div variants={fadeIn} className="rounded-3xl bg-surface-secondary p-8 flex gap-6 items-start border border-border">
            <div className="rounded-2xl bg-white p-3 shadow-sm text-text-secondary">
              <Info className="size-6" />
            </div>
            <div className="space-y-3">
              <p className="text-lg font-bold">O que é MCP?</p>
              <p className="text-body text-text-secondary leading-relaxed">
                Model Context Protocol (MCP) é um padrão aberto que permite que assistentes de IA se conectem de forma segura a fontes de dados locais ou remotas. Ao ativar estas integrações, você permite que ferramentas como o Claude ajudem você a gerenciar seus aluguéis de forma proativa.
              </p>
              <Button variant="link" size="sm" className="h-auto p-0 gap-1 font-bold text-primary" asChild>
                <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer">
                  Saiba mais <ExternalLink className="size-4" />
                </a>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Page>
  );
}
