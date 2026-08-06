import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, FileSignature, Search, Sparkles, FileText } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import footerAsset from "@/assets/footer.asset.json";
import { FAQSection } from "@/components/sections/faq-section";

import { PropertyCard } from "@/components/cards/property-card";
import { Page } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/forms/search-input";
import { apartments, neighborhoods } from "@/mock";
import { ViktorHero } from "@/components/motionsites/ViktorHero";
import { container } from "@/lib/motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PagouMorou: Aluguel Residencial Direto e Sem Burocracia" },
      {
        name: "description",
        content:
          "Encontre apartamentos e casas para alugar no PagouMorou. Negociação direta com proprietários, contratos digitais seguros e zero fiador.",
      },
      { property: "og:title", content: "PagouMorou: Aluguel Residencial Direto e Sem Burocracia" },
      {
        property: "og:description",
        content: "Encontre apartamentos e casas para alugar no PagouMorou. Negociação direta com proprietários, contratos digitais seguros e zero fiador.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pagoumorou.com.br" }],
    lang: "pt-BR",
  }),
  component: HomePage,
});

function HomePage() {
  const { toggleFavorite, isFavorite } = useFavorites();
  const featuredApartments = apartments.slice(0, 3);
  const recentApartments = apartments.slice(0, 4);

  return (
    <Page fullWidth className="bg-background pb-20 pt-0" component="main">
      {/* Hero Section - Viktor Oddy Style */}
      <ViktorHero />

      <div className="container mx-auto mt-16 px-6">
        {/* Featured Section */}
        <section className="mb-20">
          <div className="mb-8 flex items-end justify-between px-4 md:px-0">
            <div>
              <h2 className="mb-2 text-heading">Destaques</h2>
              <p className="text-text-secondary">Os imóveis mais desejados selecionados para você.</p>
            </div>
          </div>

          <motion.div
            variants={container}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4 md:px-0"
          >
            {featuredApartments.map((apt) => (
              <PropertyCard 
                key={apt.id} 
                apartment={apt} 
                favorite={isFavorite(apt.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </motion.div>
        </section>

        {/* Categories / Neighborhoods */}
        <section className="mb-20">
          <h2 className="mb-8 px-4 text-heading md:px-0">Explore por bairro</h2>
          <div className="grid grid-cols-2 gap-4 px-4 md:grid-cols-4 md:px-0">
            {neighborhoods.map((nb) => (
              <Link
                key={nb.id}
                to="/buscar"
                search={{ type: "Todos", bedrooms: undefined, minPrice: 0, maxPrice: 20000, sort: "relevance", q: "" }}
                className="group flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md"
              >
                <span className="mb-1 text-title group-hover:text-primary">{nb.name}</span>
                <span className="text-caption text-text-secondary">Média {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(nb.averageRent)}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* All Listings Section */}
        <section>
          <div className="mb-8 flex items-end justify-between">
            <div className="px-4 md:px-0">
              <h2 className="mb-2 text-heading">Novos anúncios</h2>
              <p className="text-text-secondary">Explore as últimas unidades disponíveis na plataforma.</p>
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
              <PropertyCard 
                key={apt.id} 
                apartment={apt} 
                favorite={isFavorite(apt.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </motion.div>

          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" className="h-12 px-10 font-bold" asChild>
              <Link to="/buscar" search={{ type: "Todos", bedrooms: undefined, minPrice: 0, maxPrice: 20000, sort: "relevance", q: "" }}>
                Carregar mais imóveis
              </Link>
            </Button>
          </div>

          <FAQSection />

          <div className="mt-20 border-t border-border pt-12 mb-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-surface-secondary p-4 text-primary">
                <FileText className="size-8" />
              </div>
              <h3 className="text-xl font-bold">Documentação do Projeto</h3>
              <p className="mt-2 max-w-md text-text-secondary">
                Acesse o documento descritivo das telas atuais para referências de design e mockups.
              </p>
              <Button variant="link" className="mt-2 font-bold text-primary" asChild>
                <a href="/src/docs/telas_referencia.md" target="_blank">Ver Documentação (Markdown)</a>
              </Button>
            </div>
          </div>

        </section>
      </div>
      
      {/* Footer Branding Asset */}
      <div className="w-full mt-10 overflow-hidden pointer-events-none select-none">
        <img 
          src={footerAsset.url} 
          alt="" 
          className="w-full object-cover max-h-[200px] opacity-80" 
        />
      </div>
    </Page>
  );
}
