import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/forms/password-input";
import { Field } from "@/components/forms/field";
import { fade, slideUp } from "@/lib/motion";
import { Logo } from "@/components/shared/logo";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar | PagouMorou" },
      { name: "description", content: "Acesse sua conta PagouMorou para gerenciar seus aluguéis e contratos." },
      { property: "og:title", content: "Entrar | PagouMorou" },
      { property: "og:description", content: "Acesse sua conta PagouMorou para gerenciar seus aluguéis e contratos." },
      { property: "og:image", content: "/favicon.png" },
    ],
  }),
  component: EntrarPage,
});

function EntrarPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col md:flex-row pb-[env(safe-area-inset-bottom)]">
      {/* Lado Esquerdo - Visual/Branding */}
      <div className="hidden md:flex md:w-1/2 bg-primary/90 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5 pattern-grid" />
        <motion.div 
          variants={fade}
          initial="initial"
          animate="animate"
          className="relative z-10 max-w-md text-center"
        >
          <div className="w-full h-48 mb-8 rounded-3xl shadow-2xl bg-white flex items-center justify-center p-8">
            <Logo size="lg" className="scale-150" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Alugue sem fiador e sem complicação.
          </h2>
          <p className="text-white/80 text-lg">
            A plataforma que conecta proprietários e inquilinos de forma direta e segura.
          </p>
        </motion.div>
      </div>

      {/* Lado Direito - Formulário */}
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

            <div className="md:hidden mb-8 flex items-start">
               <Logo size="md" />
            </div>

            <h1 className="text-3xl font-display font-bold text-text mb-2">Bem-vindo de volta</h1>
            <p className="text-secondary-text mb-8">
              Insira seus dados para acessar sua conta.
            </p>

            <form className="space-y-4 md:space-y-6" onSubmit={(e) => e.preventDefault()}>
              <Field label="E-mail" id="email">
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu@email.com" 
                  className="h-12 px-4"
                />
              </Field>

              <Field label="Senha" id="password">
                <PasswordInput 
                  id="password" 
                  placeholder="Sua senha"
                  className="h-12 px-4"
                />
              </Field>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-secondary-text">
                  <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                  Lembrar de mim
                </label>
                <Link to="/" className="text-primary font-medium hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>

              <Button type="submit" className="w-full h-14 text-lg font-bold" size="lg">
                Entrar
              </Button>
            </form>

            <div className="mt-6 md:mt-8 text-center text-secondary-text">
              Ainda não tem uma conta?{" "}
              <Link to="/cadastro" className="text-primary font-bold hover:underline">
                Crie uma agora
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
