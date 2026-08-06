import { ViktorHero } from "@/components/motionsites/ViktorHero";
import { PricingCard } from "@/components/motionsites/PricingCard";
import { useFavorites } from "@/hooks/use-favorites";
import { motion } from "framer-motion";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Quote, Sparkles, Building2, FileSignature, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/cards/property-card";
import { Page } from "@/components/layout/page";
import { apartments } from "@/mock";
import { container } from "@/lib/motion";
import footerAsset from "@/assets/footer.asset.json";
import { FAQSection } from "@/components/sections/faq-section";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PagouMorou: Aluguel Residencial Direto e Sem Burocracia" },
      {
        name: "description",
        content: "Encontre apartamentos e casas para alugar no PagouMorou. Negociação direta com proprietários, contratos digitais seguros e zero fiador.",
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

  return (
    <Page fullWidth className="bg-white pb-20 pt-0" component="main">
      <ViktorHero />

      {/* Testimonial Quote Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <Quote className="w-8 h-8 text-[#051A24]" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-[32px] md:text-[40px] lg:text-[44px] leading-[1.1] text-[#0D212C] tracking-tight mb-6"
        >
          "Mudei a forma como as pessoas alugam no Brasil para criar a plataforma que eu sempre quis usar"
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="italic text-sm text-[#273C46] mb-12"
        >
          Viktor Oddy, Fundador
        </motion.p>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
          <span className="text-2xl font-bold text-slate-900">PagouMorou</span>
          <span className="text-2xl font-bold text-slate-900">QuintoAndar</span>
          <span className="text-2xl font-bold text-slate-900">Airbnb</span>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:max-w-5xl md:ml-auto">
            <PricingCard
              title="Anúncio Mensal"
              description={"Sua propriedade em destaque.\nSuporte direto com nosso time."}
              price="R$ 99"
              priceLabel="Por Mês"
              dark
            >
              <Button className="w-full bg-white text-[#051A24] rounded-full hover:bg-slate-100 font-semibold h-12">Começar agora</Button>
              <Button variant="ghost" className="w-full text-white/70 hover:text-white h-12">Como funciona</Button>
            </PricingCard>

            <PricingCard
              title="Gestão Completa"
              description={"Escopo fixo, tempo garantido.\nMesmo time, mesmos padrões."}
              price="R$ 499"
              priceLabel="Mínimo"
            >
              <Button className="w-full bg-[#051A24] text-white rounded-full hover:bg-[#0D212C] font-semibold h-12">Solicitar consultoria</Button>
            </PricingCard>
          </div>
        </div>
      </section>

      <div className="container mx-auto mt-16 px-6">
        {/* Featured Section */}
        <section className="mb-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="mb-2 text-heading" style={{ fontFamily: "'PP Mondwest', serif" }}>Destaques</h2>
              <p className="text-text-secondary">Os imóveis mais desejados selecionados para você.</p>
            </div>
          </div>

          <motion.div
            variants={container}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
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
