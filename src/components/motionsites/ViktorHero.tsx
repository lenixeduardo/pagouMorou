import { ReactNode } from "react";
import { useInViewAnimation } from "@/hooks/use-in-view-animation";
import { motion } from "framer-motion";
import { Building2, FileSignature, Sparkles, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface ViktorHeroProps {
  className?: string;
}

export function ViktorHero({ className }: ViktorHeroProps) {
  const { ref, isInView } = useInViewAnimation(0.1);

  const marqueeImages = [
    "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
    "https://motionsites.ai/assets/hero-portfolio-cosmic-preview-BpvWJ3Nc.gif",
    "https://motionsites.ai/assets/hero-velorah-preview-CJNTtbpd.gif",
    "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
    "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
    "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
    "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
    "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  ];

  return (
    <section 
      ref={ref as any}
      className={cn("relative flex flex-col items-center pt-12 md:pt-16 overflow-hidden", className)}
    >
      {/* Container Principal do Hero */}
      <div className="container relative z-10 mx-auto max-w-[540px] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-4"
        >
          <span style={{ fontFamily: "'PP Mondwest', serif" }} className="text-[32px] md:text-[40px] lg:text-[44px] font-semibold text-[#051A24] tracking-tight">
            PagouMorou
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-2 font-mono text-xs md:text-sm text-[#051A24]"
        >
          O MARKETPLACE DE ALUGUEL DIRETO
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-6 text-[32px] md:text-[40px] lg:text-[44px] leading-[1.1] text-[#0D212C] tracking-tight whitespace-nowrap"
        >
          Alugou. <span style={{ fontFamily: "'PP Mondwest', serif" }}>Pagou.</span><br />
          <span style={{ fontFamily: "'PP Mondwest', serif" }}>Morou.</span> o jeito fácil.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col gap-6 mt-5 md:mt-6 text-sm md:text-base text-[#051A24] leading-relaxed"
          style={{ fontFamily: "'PP Neue Montreal', sans-serif" }}
        >
          <p>
            Criado para simplificar o mercado imobiliário brasileiro. Unimos proprietários e inquilinos em uma plataforma segura, transparente e extremamente rápida.
          </p>
          <p>
            Sem burocracia excessiva. Nós guiamos cada etapa do processo, desde a visita virtual até a assinatura do contrato digital, garantindo segurança para ambos os lados.
          </p>
          <p className="font-semibold">Planos a partir de R$ 99 por anúncio.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-8 justify-center"
        >
          <Button 
            className="bg-[#051A24] text-white rounded-full px-8 py-6 text-lg font-medium shadow-[0_1px_2px_0_rgba(5,26,36,0.1),0_4px_4px_0_rgba(5,26,36,0.09),0_9px_6px_0_rgba(5,26,36,0.05),0_17px_7px_0_rgba(5,26,36,0.01),0_26px_7px_0_rgba(5,26,36,0),inset_0_2px_8px_0_rgba(255,255,255,0.2)] hover:bg-[#0D212C] transition-all"
            asChild
          >
            <Link to="/buscar" search={{ type: "Todos", bedrooms: undefined, minPrice: 0, maxPrice: 20000, sort: "relevance", q: "" }}>
              Começar agora
            </Link>
          </Button>
          <Button 
            variant="ghost"
            className="bg-white text-[#051A24] rounded-full px-8 py-6 text-lg font-medium shadow-[0_0_0_0.5px_rgba(0,0,0,0.05),0_4px_30px_rgba(0,0,0,0.08)] hover:bg-slate-50"
            asChild
          >
            <Link to="/anunciar">
              Anunciar imóvel
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-10 flex flex-wrap justify-center gap-6 text-xs font-medium text-[#051A24]/60"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="size-4" /> SEM FIADOR
          </span>
          <span className="flex items-center gap-1.5">
            <FileSignature className="size-4" /> CONTRATO DIGITAL
          </span>
          <span className="flex items-center gap-1.5">
            <Building2 className="size-4" /> DIRETO COM DONO
          </span>
        </motion.div>
      </div>

      {/* Infinite Marquee */}
      <div className="w-full mt-16 md:mt-24 mb-12 overflow-hidden bg-white py-4">
        <div className="flex w-[200%] animate-marquee">
          <div className="flex w-1/2 justify-around">
            {marqueeImages.map((src, i) => (
              <img 
                key={i} 
                src={src} 
                alt="" 
                className="h-[280px] md:h-[450px] w-auto object-cover mx-3 rounded-2xl shadow-xl"
              />
            ))}
          </div>
          <div className="flex w-1/2 justify-around">
            {marqueeImages.map((src, i) => (
              <img 
                key={`dup-${i}`} 
                src={src} 
                alt="" 
                className="h-[280px] md:h-[450px] w-auto object-cover mx-3 rounded-2xl shadow-xl"
              />
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        @media (max-width: 768px) {
          .animate-marquee {
            animation: marquee 15s linear infinite;
          }
        }
      `}} />
    </section>
  );
}
