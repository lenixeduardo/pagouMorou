import { HeroSection } from "@/components/sections/hero-section";
import { useFavorites } from "@/hooks/use-favorites";
import { motion } from "framer-motion";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Quote,
  Sparkles,
  Building2,
  // FileSignature removed as it was unused
  FileText,
  Plus,
  MapPin,
  Search,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/cards/property-card";
import { Page } from "@/components/layout/page";
import { apartmentsQueryOptions } from "@/lib/queries/apartments";
// container removed as it was unused
import footerAsset from "@/assets/footer.asset.json";
import { FAQSection } from "@/components/sections/faq-section";
import { MVPRoadmap } from "@/components/sections/mvp-roadmap";

const FEATURED_LIMIT = 3;

export const Route = createFileRoute("/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(apartmentsQueryOptions({ limit: FEATURED_LIMIT })),
  head: () => ({
    meta: [
      { title: "PagouMorou: Aluguel Residencial Descomplicado e Seguro" },
      {
        name: "description",
        content:
          "Alugue seu próximo lar sem burocracia no PagouMorou. Conectamos proprietários e inquilinos direto, com contrato digital e locação ágil e transparente.",
      },
      { property: "og:title", content: "PagouMorou: Aluguel Residencial Descomplicado e Seguro" },
      {
        property: "og:description",
        content:
          "Alugue seu próximo lar sem burocracia no PagouMorou. Conectamos proprietários e inquilinos direto, com contrato digital e locação ágil e transparente.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pagoumorou.com.br" }],
    lang: "pt-BR",
  }),
  component: HeroPage,
});

function HeroPage() {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { data: featuredApartments } = useSuspenseQuery(
    apartmentsQueryOptions({ limit: FEATURED_LIMIT }),
  );

  return (
    <Page fullWidth className="bg-[#F9FBF9] pb-20 pt-0" component="main">
      <h1 className="sr-only">PagouMorou - Aluguel Residencial Descomplicado e Seguro</h1>
      <HeroSection />

      <div className="container mx-auto px-6 max-w-7xl">
        {/* Neighborhoods Section */}
        <section className="mt-16 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-12 items-center">
            <div className="z-10">
              <span className="text-primary font-bold text-xs uppercase tracking-widest mb-4 block">
                Bairros que você vai amar
              </span>
              <h2 className="text-[44px] font-bold leading-[1.1] text-foreground mb-6">
                Bairros completos para o seu dia a dia
              </h2>
              <p className="text-text-secondary text-lg mb-10 max-w-sm leading-relaxed">
                Próximos de tudo que importa: transporte, mercados, escolas, lazer e muito mais.
              </p>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-hover text-white rounded-full px-8 py-6 font-bold shadow-lg"
                asChild
              >
                <Link to="/buscar">
                  Ver imóveis
                  <Plus className="ml-2 size-4 rotate-45" />
                </Link>
              </Button>
            </div>

            {/* Neighborhood Images Bento */}
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[500px]">
              <motion.div
                whileInView={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.95 }}
                className="relative overflow-hidden rounded-3xl col-span-1 row-span-2"
              >
                <img
                  src="https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=2070&auto=format&fit=crop"
                  className="absolute inset-0 size-full object-cover"
                  alt="Casa moderna com arquitetura contemporânea e jardim"
                />
              </motion.div>
              <div className="grid grid-rows-2 gap-4 col-span-1 row-span-2">
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    whileInView={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    className="relative overflow-hidden rounded-2xl"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop"
                      className="absolute inset-0 size-full object-cover"
                      alt="Interior de apartamento iluminado com decoração moderna"
                    />
                  </motion.div>
                  <motion.div
                    whileInView={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    className="relative overflow-hidden rounded-2xl"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop"
                      className="absolute inset-0 size-full object-cover"
                      alt="Fachada de condomínio residencial com piscina"
                    />
                  </motion.div>
                </div>
                <motion.div
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  className="relative overflow-hidden rounded-2xl"
                >
                  <img
                    src="https://images.unsplash.com/photo-1550133730-695473e544be?q=80&w=2070&auto=format&fit=crop"
                    className="absolute inset-0 size-full object-cover"
                    alt="Vista aérea de bairro residencial arborizado"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Bar */}
        <section className="mb-24 py-12 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 bg-white border border-border rounded-2xl p-6 shadow-sm hover-lift">
              <div className="size-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                <Building2 className="size-6" />
              </div>
              <div>
                <p className="text-sm font-bold">Apartamentos</p>
                <p className="text-xs text-text-secondary">Prontos para morar</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white border border-border rounded-2xl p-6 shadow-sm hover-lift">
              <div className="size-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                <Sparkles className="size-6" />
              </div>
              <div>
                <p className="text-sm font-bold">Condomínios</p>
                <p className="text-xs text-text-secondary">Com lazer e segurança</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white border border-border rounded-2xl p-6 shadow-sm hover-lift">
              <div className="size-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                <MapPin className="size-6" />
              </div>
              <div>
                <p className="text-sm font-bold">Ótimas localizações</p>
                <p className="text-xs text-text-secondary">Regiões valorizadas</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white border border-border rounded-2xl p-6 shadow-sm hover-lift">
              <div className="size-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                <FileText className="size-6" />
              </div>
              <div>
                <p className="text-sm font-bold">No seu orçamento</p>
                <p className="text-xs text-text-secondary">Faixa de R$ 2–4 mil</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works Section */}
        <section className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 items-center">
            <div>
              <span className="text-primary font-bold text-xs uppercase tracking-widest mb-4 block">
                Como funciona
              </span>
              <h2 className="text-[44px] font-bold leading-[1.1] text-foreground mb-12">
                Alugar nunca foi
                <br />
                tão fácil.
              </h2>

              <div className="space-y-10 relative">
                <div className="absolute left-6 top-8 bottom-8 w-px bg-border border-dashed border-l" />

                <div className="flex gap-6 relative">
                  <div className="size-12 rounded-full bg-white border border-border flex items-center justify-center text-primary shadow-sm z-10 hover-lift cursor-pointer">
                    <Search className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">1. Busque</h4>
                    <p className="text-text-secondary text-sm">
                      Encontre imóveis dentro do seu orçamento e região desejada.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 relative">
                  <div className="size-12 rounded-full bg-white border border-border flex items-center justify-center text-primary shadow-sm z-10 hover-lift cursor-pointer">
                    <Quote className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">2. Negocie</h4>
                    <p className="text-text-secondary text-sm">
                      Fale direto com o anunciante e negocie sem burocracia.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 relative">
                  <div className="size-12 rounded-full bg-white border border-border flex items-center justify-center text-primary shadow-sm z-10 hover-lift cursor-pointer">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">3. Mude</h4>
                    <p className="text-text-secondary text-sm">
                      Feche o contrato e garanta as chaves do seu novo lar.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How it works Right Image with Overlays */}
            <div className="relative h-[600px] rounded-[40px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"
                className="absolute inset-0 size-full object-cover"
                alt="Sala de estar moderna integrada com cozinha"
              />

              <div className="absolute bottom-8 left-8 right-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                  <p className="font-bold text-sm mb-2">Sem burocracia</p>
                  <p className="text-text-secondary text-xs mb-4 leading-relaxed">
                    Negocie direto e de forma segura.
                  </p>
                  <Link to="/buscar" className="text-primary text-xs font-bold flex items-center">
                    Enviar proposta <ChevronRight className="ml-1 size-3" />
                  </Link>
                </div>

                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                    <FileText className="size-4" />
                  </div>
                  <p className="font-bold text-sm mb-1">Agende uma visita</p>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    Conheça o imóvel pessoalmente.
                  </p>
                </div>

                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                    <Quote className="size-4" />
                  </div>
                  <p className="font-bold text-sm mb-1">Faça sua proposta</p>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    Negocie diretamente com o anunciante.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Destaques Section */}
        {featuredApartments.length > 0 && (
          <section className="mb-24">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <span className="text-primary font-bold text-xs uppercase tracking-widest mb-4 block">
                  Destaques
                </span>
                <h2 className="text-[44px] font-bold leading-[1.1] text-foreground">
                  Imóveis em destaque
                </h2>
              </div>
              <Button variant="outline" className="rounded-full font-bold" asChild>
                <Link to="/buscar">
                  Ver todos <ChevronRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {featuredApartments.map((apartment) => (
                <PropertyCard
                  key={apartment.id}
                  apartment={apartment}
                  favorite={isFavorite(apartment.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </section>
        )}

        <FAQSection />
        <MVPRoadmap />
      </div>

      {/* Footer Branding Asset */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 0.8, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full mt-10 overflow-hidden pointer-events-none select-none"
      >
        <motion.img
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          src={footerAsset.url}
          alt="Ilustração do horizonte de uma cidade brasileira (skyline)"
          className="w-full object-cover max-h-[200px]"
        />
      </motion.div>
    </Page>
  );
}
