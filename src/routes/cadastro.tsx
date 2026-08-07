import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, ArrowRight, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/forms/password-input";
import { Field } from "@/components/forms/field";
import { Logo } from "@/components/shared/logo";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { translateAuthError } from "@/lib/auth/profile";
import { toast } from "sonner";
import apartmentAsset from "@/assets/login-apartment.png.asset.json";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar Conta | PagouMorou" },
      {
        name: "description",
        content:
          "Cadastre-se no PagouMorou para encontrar seu próximo lar. A plataforma de locação que prioriza sua agilidade e segurança.",
      },
      { property: "og:title", content: "Criar Conta | PagouMorou" },
      {
        property: "og:description",
        content:
          "Cadastre-se no PagouMorou para encontrar seu próximo lar. A plataforma de locação que prioriza sua agilidade e segurança.",
      },
      { property: "og:image", content: apartmentAsset.url },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CadastroPage,
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

function CadastroPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [userType, setUserType] = useState<"inquilino" | "proprietario">("inquilino");
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const setField = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleGoogle = async () => {
    const { error } = await getBrowserSupabase().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/buscar` },
    });
    if (error) toast.error(translateAuthError(error.message));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("As senhas não conferem.");
      return;
    }
    if (form.password.length < 8) {
      toast.error("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const hasSession = await signUp({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: userType === "proprietario" ? "owner" : "tenant",
      });

      if (hasSession) {
        toast.success("Conta criada! Bem-vindo ao PagouMorou.");
        void navigate({ to: "/buscar" });
      } else {
        // O projeto exige confirmação de e-mail: não há sessão ainda.
        toast.success("Conta criada! Confirme o e-mail que enviamos para entrar.");
        void navigate({ to: "/entrar" });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível criar sua conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col md:flex-row-reverse overflow-hidden">
      {/* Coluna Esquerda (que fica na direita no Desktop) - Formulário */}
      <div className="w-full md:w-[42%] flex flex-col justify-center px-6 py-8 md:px-16 lg:px-[64px] h-screen overflow-y-auto z-10 bg-white order-2 md:order-1">
        <motion.div
          className="max-w-[490px] w-full mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-8 md:mb-12">
            <Logo size="lg" className="w-[280px] md:w-[260px] mx-auto md:mx-0" />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <h1 className="text-[42px] md:text-[48px] lg:text-[72px] font-bold text-[#101C31] leading-[1] md:leading-[0.98] tracking-[-0.045em]">
              Criar sua conta
            </h1>
            <p className="text-[20px] text-[#667085] font-normal leading-[1.55] mt-6 mb-8">
              Junte-se ao PagouMorou e encontre seu lar ideal sem burocracia.
            </p>
          </motion.div>

          <motion.form
            variants={itemVariants}
            onSubmit={(event) => void handleSubmit(event)}
            className="space-y-5"
          >
            <div className="flex p-1 bg-[#F8FAF9] rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => setUserType("inquilino")}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                  userType === "inquilino"
                    ? "bg-white text-[#0F9B4D] shadow-sm"
                    : "text-[#667085] hover:text-[#101828]"
                }`}
              >
                Sou Inquilino
              </button>
              <button
                type="button"
                onClick={() => setUserType("proprietario")}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                  userType === "proprietario"
                    ? "bg-white text-[#0F9B4D] shadow-sm"
                    : "text-[#667085] hover:text-[#101828]"
                }`}
              >
                Sou Proprietário
              </button>
            </div>

            <Field label="Nome completo" id="name">
              <div className="relative">
                <div className="absolute left-[18px] top-1/2 -translate-y-1/2 text-[#0F9B4D]">
                  <User size={21} />
                </div>
                <Input
                  id="name"
                  autoComplete="name"
                  placeholder="Seu nome completo"
                  className="pl-[54px]"
                  value={form.name}
                  onChange={setField("name")}
                  required
                />
              </div>
            </Field>

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
                  value={form.email}
                  onChange={setField("email")}
                  required
                />
              </div>
            </Field>

            <Field label="Senha" id="password">
              <PasswordInput
                id="password"
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                minLength={8}
                value={form.password}
                onChange={setField("password")}
                required
              />
            </Field>

            <Field label="Confirmar Senha" id="confirm-password">
              <PasswordInput
                id="confirm-password"
                autoComplete="new-password"
                placeholder="Repita sua senha"
                value={form.confirmPassword}
                onChange={setField("confirmPassword")}
                required
              />
            </Field>

            <Button
              type="submit"
              className="w-full h-[62px] rounded-[14px] bg-gradient-to-r from-[#0A8F43] to-[#11A84F] text-white text-[17px] font-semibold gap-[14px] shadow-[0_12px_30px_rgba(11,135,63,0.18)] hover:shadow-[0_16px_34px_rgba(11,135,63,0.24)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all mt-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner className="text-white" />
                  <span>Criando conta...</span>
                </>
              ) : (
                <>
                  <span>Explorar meu próximo lar</span>
                  <ArrowRight size={20} />
                </>
              )}
            </Button>

            <div className="relative py-4 flex items-center gap-4">
              <div className="flex-1 h-px bg-[#E4E7EC]" />
              <span className="text-[14px] text-[#667085]">ou</span>
              <div className="flex-1 h-px bg-[#E4E7EC]" />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => void handleGoogle()}
              className="w-full h-[60px] rounded-[14px] border-[#D9DEE7] bg-white text-[#101828] text-[16px] font-medium hover:bg-[#F9FAFB] transition-all"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-3" />
              Continuar com Google
            </Button>

            <p className="text-center text-[15px] text-[#667085] mt-6">
              Já possui uma conta?{" "}
              <Link
                to="/entrar"
                className="text-[#0B873F] font-semibold underline underline-offset-4"
              >
                Fazer login
              </Link>
            </p>
          </motion.form>
        </motion.div>
      </div>

      {/* Coluna Direita (que fica na esquerda no Desktop) - Imagem do imóvel */}
      <div className="relative w-full md:w-[58%] h-screen overflow-hidden order-1 md:order-2">
        <motion.img
          src={apartmentAsset.url}
          alt="Apartamento moderno em São Paulo"
          className="w-full h-full object-cover object-center"
          initial={{ scale: 1.035 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        />

        {/* Div flutuante removida */}
      </div>
    </main>
  );
}
