import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, FileSignature, Heart, MessageCircle, Search } from "lucide-react";

import { InfoCard, StatsCard } from "@/components/cards";
import { Page } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { apartments, neighborhoods } from "@/mock";
import { formatCurrency } from "@/utils/format";

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
  }),
  component: HomePage,
});

function HomePage() {
  const averageRent = Math.round(
    apartments.reduce((total, apt) => total + apt.rent, 0) / apartments.length,
  );

  return (
    <Page
      title="Alugou. Pagou. Morou."
      description="Fundação do produto pronta: design system, rotas, componentes reutilizáveis e shell da aplicação."
      actions={
        <Button asChild>
          <Link to="/buscar">
            <Search aria-hidden />
            Buscar apartamentos
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard label="Apartamentos" value={String(apartments.length)} icon={Building2} />
        <StatsCard label="Bairros" value={String(neighborhoods.length)} icon={Search} />
        <StatsCard label="Aluguel médio" value={formatCurrency(averageRent)} icon={FileSignature} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <InfoCard
          icon={Search}
          title="Descubra"
          description="Busca e filtros por bairro, preço e características do imóvel."
        />
        <InfoCard
          icon={MessageCircle}
          title="Negocie"
          description="Converse direto com o proprietário, sem intermediários."
        />
        <InfoCard
          icon={Heart}
          title="Assine e more"
          description="Contrato digital, sem fiador e sem burocracia."
        />
      </div>
    </Page>
  );
}
