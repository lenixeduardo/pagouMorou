import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Search, Sparkles, FileSignature, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { container, item } from "@/lib/motion";

export function HeroSection() {
  const propertyImages = [
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6199f7d009?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?q=80&w=2070&auto=format&fit=crop"
  ];

  return (
    <section className="relative flex flex-col items-center pt-12 md:pt-16 overflow-hidden bg-white">
      <div className="container relative z-10 mx-auto max-w-[540px] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-4"
        >
          <span className="text-[32px] md:text-[40px] lg:text-[44px] font-bold text-primary tracking-tight">
            PagouMorou
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-2 font-mono text-xs md:text-sm text-text-secondary"
        >
          O MARKETPLACE DE ALUGUEL DIRETO
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-6 text-[32px] md:text-[40px] lg:text-[44px] leading-[1.1] text-foreground tracking-tight"
        >
          Alugou. <span className="text-primary italic">Pagou.</span><br />
          <span className="text-primary italic">Morou.</span> o jeito fácil.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col gap-6 mt-5 md:mt-6 text-sm md:text-base text-text-secondary leading-relaxed"
        >
          <p>
            Criado para simplificar o mercado imobiliário brasileiro. Unimos proprietários e inquilinos em uma plataforma segura, transparente e extremamente rápida.
          </p>
          <p className="font-semibold text-primary">Planos a partir de R$ 99 por anúncio.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-8 justify-center"
        >
          <Button 
            size="lg"
            className="bg-primary text-white rounded-full px-8 py-6 text-lg font-medium shadow-lg hover:bg-primary-hover transition-all"
            asChild
          >
            <Link to="/buscar">
              Começar agora
            </Link>
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="rounded-full px-8 py-6 text-lg font-medium border-primary text-primary hover:bg-primary/5"
            asChild
          >
            <Link to="/anunciar">
              Anunciar imóvel
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Cinematic Image Marquee with animated camera effects */}
      <div className="w-full mt-16 md:mt-24 mb-12 overflow-hidden bg-white py-4">
        <div className="flex w-[200%] animate-marquee">
          <div className="flex w-1/2 justify-around">
            {propertyImages.map((src, i) => (
              <div key={i} className="relative h-[280px] md:h-[450px] w-[350px] md:w-[600px] mx-3 rounded-2xl overflow-hidden shadow-xl">
                <motion.img 
                  animate={{ 
                    scale: [1, 1.05, 1],
                    x: [0, -20, 0]
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  src={src} 
                  alt="" 
                  className="absolute inset-0 size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            ))}
          </div>
          <div className="flex w-1/2 justify-around">
            {propertyImages.map((src, i) => (
              <div key={`dup-${i}`} className="relative h-[280px] md:h-[450px] w-[350px] md:w-[600px] mx-3 rounded-2xl overflow-hidden shadow-xl">
                <motion.img 
                  animate={{ 
                    scale: [1, 1.05, 1],
                    x: [0, -20, 0]
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  src={src} 
                  alt="" 
                  className="absolute inset-0 size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
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
          animation: marquee 60s linear infinite;
        }
      `}} />
    </section>
  );
}

