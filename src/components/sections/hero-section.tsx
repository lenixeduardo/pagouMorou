import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Search, Sparkles, FileSignature, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { container, item } from "@/lib/motion";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pb-16 pt-12 md:pb-24 md:pt-20">
      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div
          variants={container}
          initial="initial"
          animate="animate"
          className="mx-auto max-w-3xl"
        >
          <motion.div variants={item} className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-label text-primary">
            <Sparkles className="size-4" />
            <span>Aluguel residencial descomplicado</span>
          </motion.div>

          <motion.h1 variants={item} className="mb-6 text-display text-foreground">
            Alugue sua próxima casa <br className="hidden md:block" />
            <span className="text-primary">sem burocracia</span>
          </motion.h1>

          <motion.p variants={item} className="mb-10 text-xl text-text-secondary md:text-2xl">
            A plataforma que conecta proprietários e inquilinos diretamente, com contratos digitais e zero fiador.
          </motion.p>

          <motion.div variants={item} className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-14 w-full rounded-full px-8 text-lg sm:w-auto" asChild>
              <Link to="/buscar">
                <Search className="mr-2 size-5" />
                Buscar Imóveis
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 w-full rounded-full px-8 text-lg sm:w-auto" asChild>
              <Link to="/anunciar">
                Quero Anunciar
              </Link>
            </Button>
          </motion.div>

          <motion.div 
            variants={item}
            className="flex flex-wrap justify-center gap-6 text-sm font-medium text-text-secondary"
          >
            <div className="flex items-center gap-2">
              <FileSignature className="size-5 text-primary" />
              <span>Contrato Digital</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="size-5 text-primary" />
              <span>Direto com Dono</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              <span>Sem Fiador</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />
    </section>
  );
}
