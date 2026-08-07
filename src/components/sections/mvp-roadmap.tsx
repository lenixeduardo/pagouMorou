import { CheckCircle2, Clock, Rocket, ShieldCheck, CreditCard, FileSignature } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
  description: string;
  status: "completed" | "current" | "pending";
  icon: React.ElementType;
}

const steps: Step[] = [
  {
    id: "foundation",
    title: "Fundação e Arquitetura",
    description: "Design System, Shell do App e Estrutura TanStack.",
    status: "completed",
    icon: Rocket,
  },
  {
    id: "database",
    title: "Banco de Dados e Auth",
    description: "Integração Supabase, RLS e Autenticação.",
    status: "completed",
    icon: ShieldCheck,
  },
  {
    id: "features",
    title: "Funcionalidades Base",
    description: "Anúncio, Busca, Favoritos e Detalhes.",
    status: "completed",
    icon: CheckCircle2,
  },
  {
    id: "proposals",
    title: "Ciclo de Propostas",
    description: "Negociação direta e gestão de ofertas.",
    status: "completed",
    icon: Clock,
  },
  {
    id: "payment",
    title: "Pagamento e Comprovante",
    description: "Fluxo manual de verificação de transferência.",
    status: "completed",
    icon: CreditCard,
  },
  {
    id: "contract",
    title: "Contrato e Assinatura",
    description: "Geração de PDF e integração Gov.br.",
    status: "current",
    icon: FileSignature,
  },
  {
    id: "govbr-env",
    title: "Configuração Gov.br",
    description: "Obtenção de CLIENT_ID e SECRET no Portal Gov.br.",
    status: "pending",
    icon: ShieldCheck,
  },
];

export function MVPRoadmap() {
  return (
    <section className="py-24 bg-white border-t border-border">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-widest mb-4 block">
            Nossa Jornada
          </span>
          <h2 className="text-4xl font-bold text-foreground">
            Caminho para o MVP
          </h2>
          <p className="text-text-secondary mt-4 max-w-2xl mx-auto">
            Acompanhe o progresso do desenvolvimento do PagouMorou em direção ao lançamento oficial.
          </p>
        </div>

        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2 hidden sm:block" />

          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              // isEven is removed as it was unused

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group",
                    step.status === "current" && "z-10"
                  )}
                >
                  {/* Dot */}
                  <div className="absolute left-8 md:left-1/2 size-4 rounded-full border-2 border-white bg-border md:-translate-x-1/2 z-20 transition-colors group-hover:border-primary/20 sm:block hidden">
                    {step.status === "completed" && (
                      <div className="absolute inset-0 bg-primary rounded-full scale-110" />
                    )}
                    {step.status === "current" && (
                      <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="md:w-1/2 pl-20 md:pl-0 md:px-12 w-full">
                    <div className={cn(
                      "p-6 rounded-3xl border transition-all duration-300",
                      step.status === "completed" ? "bg-primary/5 border-primary/20" : 
                      step.status === "current" ? "bg-white border-primary shadow-lg scale-105" : 
                      "bg-surface border-border opacity-60"
                    )}>
                      <div className="flex items-center gap-4 mb-3">
                        <div className={cn(
                          "size-10 rounded-xl flex items-center justify-center",
                          step.status === "completed" ? "bg-primary text-white" : 
                          step.status === "current" ? "bg-primary text-white" : 
                          "bg-border text-text-secondary"
                        )}>
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">{step.title}</h3>
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider",
                            step.status === "completed" ? "text-primary" : 
                            step.status === "current" ? "text-primary animate-pulse" : 
                            "text-text-secondary"
                          )}>
                            {step.status === "completed" ? "Concluído" : 
                             step.status === "current" ? "Em andamento" : "Pendente"}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
