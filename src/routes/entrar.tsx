import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/forms/password-input";
import { Field } from "@/components/forms/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/shared/logo";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { translateAuthError } from "@/lib/auth/profile";
import { toast } from "sonner";
import apartmentAsset from "@/assets/login-apartment.png.asset.json";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar | PagouMorou" },
      {
        name: "description",
        content:
          "Acesse sua conta no PagouMorou para gerenciar seus anúncios, acompanhar propostas ou continuar a busca pelo lar ideal com negociação direta e sem burocracia.",
      },
      { property: "og:title", content: "Entrar | PagouMorou" },
      {
        property: "og:description",
        content:
          "Acesse sua conta no PagouMorou para gerenciar seus anúncios, acompanhar propostas ou continuar a busca pelo lar ideal com negociação direta e sem burocracia.",
      },
      { property: "og:image", content: apartmentAsset.url },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EntrarPage,
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

function EntrarPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      setSuccess(true);
      // A tela de sucesso respira por um instante antes de trocar de rota.
      setTimeout(() => {
        void navigate({ to: "/buscar" });
      }, 1200);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    const { error } = await getBrowserSupabase().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/buscar` },
    });
    if (error) toast.error(translateAuthError(error.message));
  };

  return (
    <main className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden">
      {/* Coluna Esquerda - Autenticação (42%) */}
      <div className="w-full md:w-[42%] flex flex-col justify-center px-6 py-8 md:px-16 lg:px-[64px] h-screen overflow-y-auto z-10 bg-white order-2 md:order-1">
        <motion.div
          className="max-w-[490px] w-full mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-8 md:mb-16">
            <Logo size="lg" className="w-[280px] md:w-[260px] mx-auto md:mx-0" />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <h1 className="text-[42px] md:text-[48px] lg:text-[72px] font-bold text-[#101C31] leading-[1] md:leading-[0.98] tracking-[-0.045em]">
              Bem-vindo
            </h1>
            <p className="text-[20px] text-[#667085] font-normal leading-[1.55] mt-6 mb-10">
              Entre para continuar sua busca pelo próximo lar.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.form
                key="login-form"
                variants={itemVariants}
                onSubmit={(event) => void handleSubmit(event)}
                className="space-y-6"
              >
                <Field label="E-mail" id="email">
                  <div className="relative">
                    <div className="absolute left-[18px] top-1/2 -translate-y-1/2 text-[#0F9B4D]">
                      <Mail size={21} />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="seu@email.com"
                      className="pl-[54px]"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </Field>

                <Field label="Senha" id="password">
                  <PasswordInput
                    id="password"
                    autoComplete="current-password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Field>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox id="remember" />
                    <label
                      htmlFor="remember"
                      className="text-[14px] font-medium text-[#475467] cursor-pointer"
                    >
                      Manter-me conectado
                    </label>
                  </div>
                  <Link
                    to="/"
                    className="text-[14px] font-medium text-[#0B873F] hover:underline transition-all"
                  >
                    Esqueci minha senha
                  </Link>
                </div>

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    className="w-full h-[62px] rounded-[14px] bg-gradient-to-r from-[#0A8F43] to-[#11A84F] text-white text-[17px] font-semibold gap-[14px] shadow-[0_12px_30px_rgba(11,135,63,0.18)] hover:shadow-[0_16px_34px_rgba(11,135,63,0.24)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner className="text-white" />
                        <span>Entrando...</span>
                      </>
                    ) : (
                      <>
                        <span>Explorar meu próximo lar</span>
                        <ArrowRight size={20} />
                      </>
                    )}
                  </Button>
                </motion.div>

                <div className="relative py-6 flex items-center gap-4">
                  <div className="flex-1 h-px bg-[#E4E7EC]" />
                  <span className="text-[14px] text-[#667085]">ou</span>
                  <div className="flex-1 h-px bg-[#E4E7EC]" />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void handleGoogle()}
                  className="w-full h-[60px] rounded-[14px] border-[#D9DEE7] bg-white text-[#101828] text-[16px] font-medium hover:bg-[#F9FAFB] hover:border-[#C9CFD8] transition-all"
                >
                  <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    className="w-5 h-5 mr-3"
                  />
                  Continuar com Google
                </Button>

                <p className="text-center text-[15px] text-[#667085] mt-[30px]">
                  Ainda não possui uma conta?{" "}
                  <Link
                    to="/cadastro"
                    className="text-[#0B873F] font-semibold underline underline-offset-4"
                  >
                    Criar conta gratuitamente
                  </Link>
                </p>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <h3 className="text-2xl font-bold text-[#0F9B4D] mb-4">Login realizado!</h3>
                <p className="text-[#667085]">Preparando seus imóveis...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Coluna Direita - Imagem do imóvel (58%) */}
      <div className="relative w-full md:w-[58%] h-[50vh] md:h-screen overflow-hidden order-1 md:order-2">
        <motion.img
          src={apartmentAsset.url}
          alt="Apartamento moderno em São Paulo"
          className="w-full h-full object-cover object-center"
          initial={{ scale: 1.035 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        />
      </div>
    </main>
  );
}
