import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Search, Sparkles, FileSignature, Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { container, item } from "@/lib/motion";
import rioHeroAsset from "@/assets/hero-center-rio.png.asset.json";

export function HeroSection() {
  const propertyImages = [
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop", // Cozinha planejada
    "https://images.unsplash.com/photo-1549491632-15f573715d18?q=80&w=2070&auto=format&fit=crop", // Corredor com portas de quartos
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"  // Prédio comercial/residencial moderno
  ];

  return (
    <section className="relative flex flex-col pt-4 md:pt-8 bg-[#F9FBF9] overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
          {/* Hero Left Content */}
          <div className="z-10 max-w-xl">
            {/* Value Props */}
            <motion.div 
              variants={container}
              initial="initial"
              animate="animate"
              className="flex flex-col gap-3 mb-12"
            >
              <motion.div variants={item} className="flex items-center gap-4 bg-white/80 backdrop-blur-md border border-primary/10 rounded-2xl p-4 shadow-sm max-w-[220px] hover-lift group">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <div className="relative">
                    <Building2 className="size-5" />
                    <Sparkles className="size-2 absolute -top-1 -right-1 text-primary group-hover:text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Imóveis</p>
                  <p className="text-[10px] text-text-secondary uppercase tracking-wider font-medium">100% Verificados</p>
                </div>
              </motion.div>
              
              <motion.div variants={item} className="flex items-center gap-4 bg-white/80 backdrop-blur-md border border-primary/10 rounded-2xl p-4 shadow-sm max-w-[220px] hover-lift ml-6 group">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <div className="relative">
                    <Search className="size-5" />
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="size-1.5 rounded-full bg-primary absolute -bottom-0.5 -right-0.5 border border-white group-hover:bg-white"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Localização</p>
                  <p className="text-[10px] text-text-secondary uppercase tracking-wider font-medium">Bairros Premium</p>
                </div>
              </motion.div>

              <motion.div variants={item} className="flex items-center gap-4 bg-white/80 backdrop-blur-md border border-primary/10 rounded-2xl p-4 shadow-sm max-w-[220px] hover-lift group">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <div className="relative">
                    <FileSignature className="size-5" />
                    <div className="absolute -top-1 -right-1 flex gap-0.5">
                      <div className="size-1 rounded-full bg-primary group-hover:bg-white" />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Negociação</p>
                  <p className="text-[10px] text-text-secondary uppercase tracking-wider font-medium">Direto & Simples</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Main Title Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-border relative z-20"
            >
              <h2 className="text-[48px] md:text-[64px] font-bold leading-[1.05] tracking-tight text-foreground mb-6">
                Encontre<br />
                <span className="text-primary">seu novo lar</span>
              </h2>
              
              <p className="text-lg text-text-secondary mb-10 max-w-sm leading-relaxed">
                Imóveis de qualidade na faixa de R$ 2.000 a R$ 4.000 para alugar.
              </p>

              <Button 
                size="lg"
                className="bg-primary hover:bg-primary-hover text-white rounded-full px-8 py-7 text-lg font-bold shadow-lg"
                asChild
              >
                <Link to="/entrar">
                  Explorar imóveis
                  <Plus className="ml-3 size-5 rotate-45" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Hero Right Images - Bento Grid Style */}
          <div className="relative z-0 h-[600px] w-full lg:w-[700px]">
            <div className="grid grid-cols-3 gap-3 h-full">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative overflow-hidden rounded-[30px] col-span-1 h-[70%] mt-[15%]"
              >
                <img src={propertyImages[0]} className="absolute inset-0 size-full object-cover" alt="Cozinha planejada moderna e iluminada" />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="relative overflow-hidden rounded-[30px] col-span-1 h-full"
              >
                <img src={rioHeroAsset.url} className="absolute inset-0 size-full object-cover" alt="Rio de Janeiro" />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="relative overflow-hidden rounded-[30px] col-span-1 h-[80%] mt-[10%]"
              >
                <img src={propertyImages[2]} className="absolute inset-0 size-full object-cover" alt="Fachada de edifício residencial contemporâneo" />
              </motion.div>
            </div>
            
            {/* Parallax Overlay for depth */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-l from-[#F9FBF9]/10 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

