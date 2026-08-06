import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/hooks/use-auth";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight,
  ShieldCheck,
  Bell,
  Lock,
  ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";

import { Page } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/forms/field";
import { fadeIn, stagger } from "@/lib/motion";
import { toast } from "sonner";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações | PagouMorou" },
      {
        name: "description",
        content:
          "Ajuste suas preferências de conta, segurança e notificações no PagouMorou para uma experiência personalizada.",
      },
    ],
  }),
  component: ConfiguracoesPage,
});

function ConfiguracoesPage() {
  const { isAuthenticated, user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/entrar" });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const handleSave = () => {
    updateUser(formData);
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <Page className="pb-20 pt-10" component="main">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div 
          variants={stagger}
          initial="initial"
          animate="animate"
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/perfil" })} className="rounded-full">
              <ArrowLeft className="size-6" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Configurações</h1>
              <p className="text-text-secondary">Gerencie sua conta e preferências.</p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-[240px_1fr]">
            {/* Nav */}
            <nav className="space-y-1">
              <button className="flex w-full items-center gap-3 rounded-xl bg-primary/5 px-4 py-3 text-sm font-bold text-primary transition-all">
                <User className="size-5" />
                Dados Pessoais
              </button>
              <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-text-secondary transition-all hover:bg-surface-secondary">
                <ShieldCheck className="size-5" />
                Segurança
              </button>
              <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-text-secondary transition-all hover:bg-surface-secondary">
                <Bell className="size-5" />
                Notificações
              </button>
              <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-text-secondary transition-all hover:bg-surface-secondary">
                <Lock className="size-5" />
                Privacidade
              </button>
            </nav>

            {/* Content */}
            <motion.div variants={fadeIn} className="space-y-8 rounded-3xl border border-border bg-white p-6 shadow-sm">
              <section className="space-y-6">
                <h3 className="text-xl font-bold border-b pb-4">Informações do Perfil</h3>
                
                <div className="grid gap-6">
                  <Field label="Nome Completo" id="name">
                    <Input 
                      id="name" 
                      value={formData.name} 
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="rounded-xl h-12"
                    />
                  </Field>
                  
                  <Field label="E-mail" id="email">
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="rounded-xl h-12"
                    />
                  </Field>
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-xl font-bold border-b pb-4">Outros Dados</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Telefone" id="phone">
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-secondary" />
                      <Input id="phone" placeholder="(11) 99999-9999" className="pl-10 rounded-xl h-12" />
                    </div>
                  </Field>
                  <Field label="Localização" id="location">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-secondary" />
                      <Input id="location" placeholder="Cidade, Estado" className="pl-10 rounded-xl h-12" />
                    </div>
                  </Field>
                </div>
              </section>

              <div className="pt-4 flex justify-end gap-4 border-t">
                <Button variant="ghost" onClick={() => navigate({ to: "/perfil" })} className="rounded-xl">
                  Cancelar
                </Button>
                <Button onClick={handleSave} className="rounded-xl px-8">
                  Salvar Alterações
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Page>
  );
}
