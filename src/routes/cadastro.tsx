import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/forms/password-input";
import { Field } from "@/components/forms/field";
import { fade, slideUp } from "@/lib/motion";
import logoAsset from "@/assets/logo.asset.json";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta | PagouMorou" },
      { name: "description", content: "Crie sua conta gratuita e alugue um apartamento sem fiador." },
      { property: "og:title", content: "Criar conta | PagouMorou" },
      { property: "og:description", content: "Cadastro rápido para alugar sem burocracia." },
      { property: "og:image", content: logoAsset.url },
    ],
  }),
  component: CadastroPage,
});

function CadastroPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row-reverse">
      {/* Lado Direito - Visual/Branding (Invertido no Cadastro) */}
      <div className="hidden md:flex md:w-1/2 bg-primary/90 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5 pattern-dots" />
        <motion.div 
          variants={fade}
          initial="initial"
          animate="animate"
          className="relative z-10 max-w-md text-center"
        >
          <div className="w-full aspect-video mb-8 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-2xl">
            <span className="text-white font-display text-4xl font-bold italic tracking-tighter">PagouMorou</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Junte-se à revolução do aluguel.
          </h2>
          <p className="text-white/80 text-lg">
            Cadastre-se para encontrar seu próximo lar ou anunciar seu imóvel com total segurança.
          </p>
        </motion.div>
      </div>

      {/* Lado Esquerdo - Formulário */}
      <div className="flex-1 flex flex-col p-6 md:p-12 lg:p-20 justify-center">
        <div className="max-w-md w-full mx-auto">
          <motion.div variants={slideUp} initial="initial" animate="animate">
            <Link 
              to="/" 
              className="inline-flex items-center text-sm text-secondary-text hover:text-primary transition-colors mb-8 group"
            >
              <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
              Voltar para o início
            </Link>

            <div className="md:hidden mb-8 text-center">
               <span className="text-primary font-display text-3xl font-bold italic tracking-tighter">PagouMorou</span>
            </div>

            <h1 className="text-3xl font-display font-bold text-text mb-2">Criar conta</h1>
            <p className="text-secondary-text mb-8">
              Escolha como você quer começar no PagouMorou.
            </p>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Button variant="outline" className="h-20 flex-col gap-2 rounded-2xl border-2 hover:border-primary hover:bg-primary-soft">
                  <span className="font-bold">Sou Inquilino</span>
                  <span className="text-xs text-secondary-text">Quero alugar</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 rounded-2xl border-2 hover:border-primary hover:bg-primary-soft">
                  <span className="font-bold">Sou Proprietário</span>
                  <span className="text-xs text-secondary-text">Quero anunciar</span>
                </Button>
              </div>

              <Field label="Nome Completo" id="name">
                <Input id="name" placeholder="Seu nome" className="h-12 px-4" />
              </Field>

              <Field label="E-mail" id="email">
                <Input id="email" type="email" placeholder="seu@email.com" className="h-12 px-4" />
              </Field>

              <Field label="Senha" id="password">
                <PasswordInput id="password" placeholder="Mínimo 8 caracteres" className="h-12 px-4" />
              </Field>

              <p className="text-xs text-secondary-text mt-4">
                Ao criar uma conta, você concorda com nossos{" "}
                <Link to="/" className="text-primary hover:underline">Termos de Uso</Link> e{" "}
                <Link to="/" className="text-primary hover:underline">Política de Privacidade</Link>.
              </p>

              <Button type="submit" className="w-full h-14 text-lg font-bold mt-4" size="lg">
                Criar minha conta
              </Button>
            </form>

            <div className="mt-8 text-center text-secondary-text">
              Já tem uma conta?{" "}
              <Link to="/entrar" className="text-primary font-bold hover:underline">
                Faça login
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
