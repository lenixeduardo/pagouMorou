import { HeroSection } from "@/components/sections/hero-section";
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
      <HeroSection />

      <div className="container mx-auto mt-16 px-6">
        {/* Why PagouMorou */}
        <section className="mb-24 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="mb-6 rounded-3xl bg-primary/10 p-6 text-primary">
                <Building2 className="size-10" />
              </div>
              <h3 className="mb-4 text-2xl font-bold">Direto com Dono</h3>
              <p className="text-text-secondary">Elimine intermediários e negocie as melhores condições diretamente com quem decide.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-6 rounded-3xl bg-primary/10 p-6 text-primary">
                <FileSignature className="size-10" />
              </div>
              <h3 className="mb-4 text-2xl font-bold">Contrato Digital</h3>
              <p className="text-text-secondary">Assinatura digital rápida e segura, com validade jurídica e reconhecimento facial.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-6 rounded-3xl bg-primary/10 p-6 text-primary">
                <Sparkles className="size-10" />
              </div>
              <h3 className="mb-4 text-2xl font-bold">Sem Fiador</h3>
              <p className="text-text-secondary">Nossa análise de crédito inteligente substitui a necessidade de fiador ou caução pesada.</p>
            </div>
          </div>
        </section>

      <div className="container mx-auto mt-16 px-6">
        {/* Featured Section */}
        <section className="mb-20">
          <div className="mb-8 flex items-end justify-between">
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
