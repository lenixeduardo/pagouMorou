import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Search, Sparkles, FileSignature, Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { container, item } from "@/lib/motion";

export function HeroSection() {
  const propertyImages = [
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6199f7d009?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?q=80&w=2070&auto=format&fit=crop"
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
              <motion.div variants={item} className="flex items-center gap-3 bg-white border border-border rounded-2xl p-4 shadow-sm max-w-[200px] hover-lift">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">Imóveis</p>
                  <p className="text-[10px] text-text-secondary">Verificados</p>
                </div>
              </motion.div>
              
              <motion.div variants={item} className="flex items-center gap-3 bg-white border border-border rounded-2xl p-4 shadow-sm max-w-[200px] hover-lift ml-4">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Search className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">Localização</p>
                  <p className="text-[10px] text-text-secondary">Precisa</p>
                </div>
              </motion.div>

              <motion.div variants={item} className="flex items-center gap-3 bg-white border border-border rounded-2xl p-4 shadow-sm max-w-[200px] hover-lift">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <FileSignature className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">Negociação</p>
                  <p className="text-[10px] text-text-secondary">Simplificada</p>
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
              <h1 className="text-[48px] md:text-[64px] font-bold leading-[1.05] tracking-tight text-foreground mb-6">
                Encontre<br />
                <span className="text-primary">seu novo lar</span>
              </h1>
              
              <p className="text-lg text-text-secondary mb-10 max-w-sm leading-relaxed">
                Imóveis de qualidade na faixa de R$ 2.000 a R$ 4.000 para alugar.
              </p>

              <Button 
                size="lg"
                className="bg-primary hover:bg-primary-hover text-white rounded-full px-8 py-7 text-lg font-bold shadow-lg"
                asChild
              >
                <Link to="/buscar">
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
                <img src={propertyImages[0]} className="absolute inset-0 size-full object-cover" alt="" />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="relative overflow-hidden rounded-[30px] col-span-1 h-full"
              >
                <img src={propertyImages[1]} className="absolute inset-0 size-full object-cover" alt="" />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="relative overflow-hidden rounded-[30px] col-span-1 h-[80%] mt-[10%]"
              >
                <img src={propertyImages[2]} className="absolute inset-0 size-full object-cover" alt="" />
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

