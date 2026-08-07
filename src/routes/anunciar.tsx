import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronRight,
  ChevronLeft, 
  Upload, 
  MapPin, 
  Info, 
  CheckCircle2,
  Camera,
  Coins
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-notifications";
import { motion, AnimatePresence } from "framer-motion";

import { Page } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/forms/field";
import { fadeIn, slideUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/anunciar")({
  head: () => ({
    meta: [
      { title: "Anunciar Imóvel | PagouMorou" },
      {
        name: "description",
        content:
          "Publique seu anúncio no PagouMorou e alugue seu imóvel rapidamente. Conectamos você aos melhores inquilinos sem burocracia.",
      },
      { property: "og:title", content: "Anunciar Imóvel | PagouMorou" },
      {
        property: "og:description",
        content:
          "Publique seu anúncio no PagouMorou e alugue seu imóvel rapidamente. Conectamos você aos melhores inquilinos sem burocracia.",
      },
    ],
  }),
  component: AnunciarPage,
});

const STEPS = [
  { id: "basic", title: "Informações Básicas", icon: Info },
  { id: "location", title: "Localização", icon: MapPin },
  { id: "photos", title: "Fotos", icon: Camera },
  { id: "pricing", title: "Valores", icon: Coins },
];

function AnunciarPage() {
  const { isAuthenticated } = useAuthStore();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState("");
  const [descriptionValidation, setDescriptionValidation] = useState({
    hasLocation: false,
    hasPOI: false,
    hasRooms: false,
    hasFurnished: false,
    score: 0
  });

  useEffect(() => {
    const desc = description.toLowerCase();
    const validation = {
      hasLocation: desc.includes("local") || desc.includes("bairro") || desc.includes("rua") || desc.includes("próximo a"),
      hasPOI: desc.includes("metrô") || desc.includes("shopping") || desc.includes("parque") || desc.includes("mercado") || desc.includes("escola"),
      hasRooms: desc.includes("quarto") || desc.includes("suíte") || desc.includes("sala") || desc.includes("cozinha") || desc.includes("banheiro"),
      hasFurnished: desc.length > 50 && (desc.includes("cama") || desc.includes("sofá") || desc.includes("geladeira") || desc.includes("armário") || desc.includes("mesa")),
      score: 0
    };

    let score = 0;
    if (validation.hasLocation) score += 25;
    if (validation.hasPOI) score += 25;
    if (validation.hasRooms) score += 25;
    if (validation.hasFurnished) score += 25;
    validation.score = score;

    setDescriptionValidation(validation);
  }, [description]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/entrar" });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simular envio
    setTimeout(() => {
      setIsSubmitting(false);
      addNotification({
        kind: "system",
        title: "Anúncio publicado!",
        description: "Seu imóvel foi enviado para análise e em breve estará online.",
        href: "/perfil",
      });
      setCurrentStep(STEPS.length); // Ir para sucesso
    }, 2000);
  };

  const isSuccess = currentStep === STEPS.length;

  return (
    <Page className="pb-20 pt-10" component="main">
      <div className="mx-auto max-w-3xl">
        {!isSuccess && (
          <div className="mb-12">
            <h1 className="mb-2 text-display text-4xl font-bold">Anunciar Imóvel</h1>
            <p className="text-lg text-text-secondary">
              Preencha os detalhes abaixo para publicar seu anúncio.
            </p>

            {/* Stepper */}
            <div className="mt-10 flex items-center justify-between px-2">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                  <div key={step.id} className="flex flex-col items-center gap-2">
                    <div
                      className={cn(
                        "relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300",
                        isActive && "bg-primary text-white ring-4 ring-primary/20 scale-110",
                        isCompleted && "bg-success text-white",
                        !isActive && !isCompleted && "bg-surface-secondary text-muted"
                      )}
                    >
                      {isCompleted ? <CheckCircle2 className="size-6" /> : <Icon className="size-6" />}
                    </div>
                    <span className={cn(
                      "hidden text-caption font-bold md:block",
                      isActive ? "text-primary" : "text-muted"
                    )}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Progress Bar */}
            <div className="relative mt-4 h-1 w-full bg-surface-secondary">
              <div 
                className="absolute left-0 top-0 h-full bg-primary transition-all duration-500"
                style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="step-basic"
                variants={slideUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-8 rounded-3xl border border-border bg-white p-8 shadow-sm"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <Field id="type" label="Tipo de imóvel" required>
                    <Select defaultValue="apartamento">
                      <SelectTrigger id="type" className="h-12 rounded-xl">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartamento">Apartamento</SelectItem>
                        <SelectItem value="casa">Casa</SelectItem>
                        <SelectItem value="studio">Studio / Kitnet</SelectItem>
                        <SelectItem value="cobertura">Cobertura</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field id="rooms" label="Quartos" required>
                    <Select defaultValue="1">
                      <SelectTrigger id="rooms" className="h-12 rounded-xl">
                        <SelectValue placeholder="Qtd. quartos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 quarto</SelectItem>
                        <SelectItem value="2">2 quartos</SelectItem>
                        <SelectItem value="3">3 quartos</SelectItem>
                        <SelectItem value="4+">4+ quartos</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <Field id="title" label="Título do anúncio" hint="Destaque o que seu imóvel tem de melhor." required>
                  <Input 
                    id="title"
                    placeholder="Ex: Apartamento ensolarado perto do metrô" 
                    className="h-12 rounded-xl"
                  />
                </Field>

                <Field id="description" label="Descrição detalhada" required>
                  <Textarea 
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Fale sobre o imóvel, condomínio e região..." 
                    className="min-h-[150px] rounded-xl"
                  />
                  {description.length > 0 && (
                    <div className="mt-3 space-y-2 rounded-xl bg-surface-secondary/50 p-4 border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Qualidade da Descrição</span>
                        <span className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded-full",
                          descriptionValidation.score >= 75 ? "bg-success/10 text-success" : 
                          descriptionValidation.score >= 50 ? "bg-warning/10 text-warning" : "bg-danger/10 text-danger"
                        )}>
                          {descriptionValidation.score}%
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          <div className={cn("size-2 rounded-full", descriptionValidation.hasLocation ? "bg-success" : "bg-border")} />
                          <span className="text-xs text-text-secondary">Localização</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={cn("size-2 rounded-full", descriptionValidation.hasPOI ? "bg-success" : "bg-border")} />
                          <span className="text-xs text-text-secondary">Pontos de interesse</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={cn("size-2 rounded-full", descriptionValidation.hasRooms ? "bg-success" : "bg-border")} />
                          <span className="text-xs text-text-secondary">Detalhes dos cômodos</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={cn("size-2 rounded-full", descriptionValidation.hasFurnished ? "bg-success" : "bg-border")} />
                          <span className="text-xs text-text-secondary">Itens/Mobília</span>
                        </div>
                      </div>
                      {descriptionValidation.score < 100 && (
                        <p className="text-[10px] text-text-secondary mt-2 italic">
                          Dica: Adicione detalhes sobre o {
                            !descriptionValidation.hasLocation ? "bairro/rua" : 
                            !descriptionValidation.hasPOI ? "metrô ou comércio próximo" :
                            !descriptionValidation.hasRooms ? "tamanho dos quartos/sala" : "móveis inclusos"
                          } para melhorar seu score.
                        </p>
                      )}
                    </div>
                  )}
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pet" />
                    <label htmlFor="pet" className="text-sm font-medium leading-none cursor-pointer">Aceita pets</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="parking" />
                    <label htmlFor="parking" className="text-sm font-medium leading-none cursor-pointer">Vaga de garagem</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="furnished" />
                    <label htmlFor="furnished" className="text-sm font-medium leading-none cursor-pointer">Mobiliado</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pool" />
                    <label htmlFor="pool" className="text-sm font-medium leading-none cursor-pointer">Piscina</label>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="step-location"
                variants={slideUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-8 rounded-3xl border border-border bg-white p-8 shadow-sm"
              >
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="md:col-span-1">
                    <Field id="zip" label="CEP" required>
                      <Input id="zip" placeholder="00000-000" className="h-12 rounded-xl" />
                    </Field>
                  </div>
                  <div className="md:col-span-2">
                    <Field id="address" label="Endereço" required>
                      <Input id="address" placeholder="Rua, Avenida, etc." className="h-12 rounded-xl" />
                    </Field>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Field id="neighborhood" label="Bairro" required>
                    <Input id="neighborhood" placeholder="Ex: Pinheiros" className="h-12 rounded-xl" />
                  </Field>
                  <Field id="city" label="Cidade" required>
                    <Input id="city" placeholder="Ex: São Paulo" className="h-12 rounded-xl" />
                  </Field>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Field id="number" label="Número" required>
                    <Input id="number" placeholder="123" className="h-12 rounded-xl" />
                  </Field>
                  <Field id="complement" label="Complemento">
                    <Input id="complement" placeholder="Apto 42, Bloco B" className="h-12 rounded-xl" />
                  </Field>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-photos"
                variants={slideUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-8 rounded-3xl border border-border bg-white p-8 shadow-sm"
              >
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface py-12 text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                    <Upload className="size-8" />
                  </div>
                  <h3 className="mb-1 text-lg font-bold">Arraste suas fotos aqui</h3>
                  <p className="mb-6 text-sm text-text-secondary">
                    Ou clique para selecionar arquivos do seu computador.
                    <br />
                    Mínimo de 5 fotos para maior destaque.
                  </p>
                  <Button type="button" variant="outline" className="rounded-xl">
                    Selecionar Fotos
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-square rounded-xl bg-surface-secondary" />
                  ))}
                  <div className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-border text-muted">
                    <Camera className="size-6" />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step-pricing"
                variants={slideUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-8 rounded-3xl border border-border bg-white p-8 shadow-sm"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <Field id="rent" label="Aluguel mensal" required>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">R$</span>
                      <Input id="rent" placeholder="0,00" className="h-12 rounded-xl pl-12" />
                    </div>
                  </Field>
                  <Field id="condo" label="Condomínio" required>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">R$</span>
                      <Input id="condo" placeholder="0,00" className="h-12 rounded-xl pl-12" />
                    </div>
                  </Field>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Field id="iptu" label="IPTU (Mensal)" required>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">R$</span>
                      <Input id="iptu" placeholder="0,00" className="h-12 rounded-xl pl-12" />
                    </div>
                  </Field>
                  <Field id="insurance" label="Seguro Incêndio (Estimado)">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">R$</span>
                      <Input id="insurance" placeholder="0,00" className="h-12 rounded-xl pl-12" readOnly />
                    </div>
                  </Field>
                </div>

                <div className="rounded-2xl bg-primary/5 p-6 border border-primary/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Total por mês</span>
                    <span className="text-2xl font-bold text-primary">R$ 0,00</span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    Este é o valor que o inquilino verá no anúncio como pacote completo.
                  </p>
                </div>
              </motion.div>
            )}

            {isSuccess && (
              <motion.div
                key="success"
                variants={fadeIn}
                initial="initial"
                animate="animate"
                className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center shadow-lg border border-border"
              >
                <div className="mb-6 rounded-full bg-success/10 p-6 text-success">
                  <CheckCircle2 className="size-16" />
                </div>
                <h2 className="mb-2 text-3xl font-bold">Anúncio Enviado!</h2>
                <p className="mb-8 max-w-md text-lg text-text-secondary">
                  Seu imóvel passará por uma análise rápida e em breve estará disponível para milhares de inquilinos.
                </p>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                  <Button size="lg" className="rounded-xl font-bold" asChild>
                    <a href="/">Ir para a Home</a>
                  </Button>
                  <Button variant="ghost" size="lg" className="rounded-xl font-bold">
                    Ver meu anúncio
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isSuccess && (
            <div className="mt-8 flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={prevStep}
                disabled={currentStep === 0}
                className={cn("rounded-xl font-bold", currentStep === 0 && "opacity-0")}
              >
                <ChevronLeft className="mr-2 size-5" />
                Voltar
              </Button>

              {currentStep === STEPS.length - 1 ? (
                <Button 
                  type="submit" 
                  size="lg" 
                  className="rounded-xl px-10 font-bold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Publicar Anúncio"}
                </Button>
              ) : (
                <Button 
                  type="button" 
                  size="lg" 
                  onClick={nextStep}
                  className="rounded-xl px-10 font-bold"
                >
                  Continuar
                  <ChevronRight className="ml-2 size-5" />
                </Button>
              )}
            </div>
          )}
        </form>
      </div>
    </Page>
  );
}
