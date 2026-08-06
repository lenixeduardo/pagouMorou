import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, FileSignature, Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { PropertyCard } from "@/components/cards/property-card";
import { Page } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/forms/search-input";
import { apartments, neighborhoods } from "@/mock";
import { container, fadeIn, stagger } from "@/lib/motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PagouMorou — Alugue apartamentos sem burocracia" },
      {
        name: "description",
        content:
          "Descubra apartamentos, negocie direto com o proprietário e assine o contrato digital no PagouMorou.",
      },
      { property: "og:title", content: "PagouMorou — Alugue apartamentos sem burocracia" },
      {
        property: "og:description",
        content: "Marketplace brasileiro de aluguel residencial. Alugou. Pagou. Morou.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pagoumorou.com.br" }],
    lang: "pt-BR",
  }),
  component: HomePage,
});

function HomePage() {
  const featuredApartments = apartments.slice(0, 3);
  const recentApartments = apartments.slice(0, 4);

  return (
    <Page fullWidth className="pb-20">
      {/* Hero / Search Section */}
      <section className="relative flex min-h-[500px] flex-col items-center justify-center overflow-hidden bg-primary px-6 py-16 text-center text-white md:min-h-[600px]">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <div className="grid h-full w-full grid-cols-6 grid-rows-6 opacity-20">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-white/30" />
            ))}
          </div>
        </div>

        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="container relative z-10 mx-auto max-w-4xl"
        >
          <motion.h1
            variants={fadeIn}
            className="mb-6 text-display font-bold tracking-tight text-white md:text-6xl"
          >
            Alugou. Pagou. Morou.
          </motion.h1>
          <motion.p
            variants={fadeIn}
            className="mx-auto mb-10 max-w-2xl text-xl text-white/90"
          >
            Encontre o seu próximo lar em minutos. Negociação direta, contrato digital e zero burocracia.
          </motion.p>

          <motion.div
            variants={fadeIn}
            className="mx-auto max-w-2xl rounded-3xl bg-card p-2 shadow-2xl ring-1 ring-border"
          >
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="relative flex-1">
                <SearchInput 
                  placeholder="Onde você quer morar?" 
                  className="h-14 border-none bg-transparent pl-12 text-foreground focus-visible:ring-0"
                  onFocus={() => window.location.href = '/buscar'}
                />
              </div>
              <Button size="lg" className="h-14 px-8 text-lg font-medium md:w-auto" asChild>
                <Link to="/buscar">
                  Buscar
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="mt-8 flex flex-wrap justify-center gap-4 text-sm font-medium text-white/80"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="size-4" /> Sem fiador
            </span>
            <span className="flex items-center gap-1.5">
              <FileSignature className="size-4" /> Contrato Digital
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 className="size-4" /> Direto com Dono
            </span>
          </motion.div>
        </motion.div>
      </section>

      <div className="container mx-auto mt-16 px-6">
        {/* Featured Section - Bento Grid Style */}
        <section className="mb-20">
          <div className="mb-8 px-4 md:px-0">
            <h2 className="mb-2 text-display text-4xl font-extrabold uppercase tracking-tighter">Destaques</h2>
            <p className="text-text-secondary font-medium">Os imóveis mais desejados selecionados para você.</p>
          </div>

          <motion.div
            variants={container}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-4 px-4 md:px-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {featuredApartments.map((apt, idx) => (
              <div key={apt.id} className={cn(
                "group relative overflow-hidden rounded-3xl border border-border bg-card transition-all hover:border-primary/50",
                idx === 0 ? "md:col-span-2 md:row-span-2" : ""
              )}>
                <PropertyCard apartment={apt} />
              </div>
            ))}
          </motion.div>
        </section>

        {/* Categories / Neighborhoods (Simple) */}
        <section className="mb-20">
          <h2 className="mb-8 px-4 text-display text-4xl font-extrabold uppercase tracking-tighter md:px-0">Explore por bairro</h2>
          <div className="grid grid-cols-2 gap-4 px-4 md:grid-cols-4 md:px-0">
            {neighborhoods.map((nb) => (
              <Link
                key={nb.id}
                to="/buscar"
                className="group flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-xl"
              >
                <span className="mb-1 text-display text-xl font-bold uppercase tracking-tight text-foreground group-hover:text-primary">{nb.name}</span>
                <span className="text-xs font-semibold text-text-secondary">Média {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(nb.averageRent)}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* All Listings Section */}
        <section>
          <div className="mb-8 flex items-end justify-between">
            <div className="px-4 md:px-0">
              <h2 className="mb-2 text-display text-4xl font-extrabold uppercase tracking-tighter">Novos anúncios</h2>
              <p className="text-text-secondary font-medium">Explore as últimas unidades disponíveis na plataforma.</p>
            </div>
          </div>

          <motion.div
            variants={container}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-4 px-4 md:px-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          >
            {recentApartments.map((apt) => (
              <PropertyCard key={apt.id} apartment={apt} />
            ))}
          </motion.div>

          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" className="h-12 px-10 font-bold" asChild>
              <Link to="/buscar">
                Carregar mais imóveis
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </Page>
  );
}
