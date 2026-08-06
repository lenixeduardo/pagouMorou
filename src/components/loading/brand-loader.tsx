import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, Building2, Home, Trees, Train, 
  KeyRound, Wallet, ShieldCheck, BadgeCheck, Camera, 
  Store, School, Car, HeartHandshake, Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import logoData from "@/assets/logo-brand-sheet.png.asset.json";

const LOADING_MESSAGES = [
  { text: "Buscando imóveis disponíveis para você...", icon: Search },
  { text: "Encontrando bairros que combinam com seu estilo de vida...", icon: MapPin },
  { text: "Verificando proximidade com estações de metrô e transporte...", icon: Train },
  { text: "Procurando imóveis próximos a mercados, farmácias e serviços...", icon: Store },
  { text: "Avaliando qualidade da região e áreas verdes...", icon: Trees },
  { text: "Comparando imóveis dentro do seu orçamento...", icon: Wallet },
  { text: "Verificando disponibilidade dos imóveis...", icon: KeyRound },
  { text: "Carregando fotos de alta qualidade...", icon: Camera },
  { text: "Selecionando os melhores anúncios...", icon: BadgeCheck },
  { text: "Comparando custo-benefício entre as opções...", icon: Building2 },
  { text: "Calculando tempo até seu trabalho...", icon: Car },
  { text: "Encontrando apartamentos prontos para morar...", icon: Home },
  { text: "Buscando casas em condomínios seguros...", icon: ShieldCheck },
  { text: "Localizando imóveis próximos a escolas...", icon: School },
  { text: "Descobrindo bairros com boa infraestrutura...", icon: Building2 },
  { text: "Verificando facilidade de acesso e mobilidade...", icon: Car },
  { text: "Encontrando um lugar que você vai chamar de lar...", icon: HeartHandshake },
  { text: "Quase lá! Preparando as melhores opções para você...", icon: Sparkles },
];

interface BrandLoaderProps {
  className?: string;
  isSplash?: boolean;
}

export function BrandLoader({ className, isSplash = false }: BrandLoaderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const currentMessage = LOADING_MESSAGES[currentIndex] as typeof LOADING_MESSAGES[number];
  const Icon = currentMessage.icon;

  if (isSplash) {
    return (
      <motion.div 
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn("fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white", className)}
      >
        <div className="relative mb-12 flex items-center justify-center">
          <motion.div
            initial={{ rotate: -5 }}
            animate={{ rotate: 5 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="relative"
          >
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className="flex size-32 items-center justify-center rounded-[32px] bg-white shadow-xl border border-border/50 overflow-hidden"
            >
              <img 
                src={logoData.url} 
                alt="PagouMorou Logo" 
                className="h-[280%] object-contain -translate-y-[2%]" 
              />
            </motion.div>
          </motion.div>
        </div>

        <div className="max-w-[480px] w-full px-8 flex flex-col items-center gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ 
                opacity: { duration: 0.3 },
                y: { duration: 0.3 }
              }}
              className="flex flex-col items-center gap-[18px]"
            >
              <div className="flex items-center gap-4">
                <Spinner size={24} className="text-primary" />
                <motion.div
                  animate={{ translateY: [0, -2, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Icon className="size-6 text-primary" strokeWidth={1.5} />
                </motion.div>
              </div>
              
              <div className="text-center space-y-1">
                <p className="text-neutral-900 font-medium leading-tight">
                  {currentMessage.text}
                </p>
                <p className="text-neutral-500 text-sm">
                  PagouMorou está trabalhando para você
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="w-full max-w-[240px] h-1 bg-neutral-100 rounded-full overflow-hidden">
            <motion.div
              key={`progress-${currentIndex}`}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.8, ease: "linear" }}
              className="h-full bg-primary"
            />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center max-w-[480px] mx-auto p-8 text-center bg-transparent", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ 
            opacity: { duration: 0.3 },
            y: { duration: 0.3 }
          }}
          className="flex flex-col items-center gap-[18px] w-full"
        >
          <div className="flex items-center gap-4 justify-center">
            <Spinner size={24} className="text-primary" />
            <motion.div
              animate={{ translateY: [0, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Icon className="size-6 text-primary" strokeWidth={1.5} />
            </motion.div>
          </div>
          
          <div className="space-y-1">
            <p className="text-neutral-900 font-medium leading-tight">
              {currentMessage.text}
            </p>
            <p className="text-neutral-500 text-sm">
              Processando sua solicitação...
            </p>
          </div>

          <div className="w-full max-w-[200px] h-1 bg-neutral-100 rounded-full overflow-hidden mt-2 mx-auto">
            <motion.div
              key={`progress-inner-${currentIndex}`}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.8, ease: "linear" }}
              className="h-full bg-primary"
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
