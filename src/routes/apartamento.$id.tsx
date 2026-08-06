import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, MapPin, Maximize } from "lucide-react";
import { apartments } from "@/mock";
import { Button } from "@/components/ui/button";

import { EmptyState } from "@/components/feedback/empty-state";
import { Page } from "@/components/layout/page";

export const Route = createFileRoute("/apartamento/$id")({
  head: () => ({
    meta: [
      { title: "Detalhes do Imóvel | PagouMorou" },
      {
        name: "description",
        content: "Veja fotos, valores e fale direto com o proprietário deste imóvel no PagouMorou.",
      },
      { property: "og:title", content: "Detalhes do Imóvel | PagouMorou" },
      {
        property: "og:description",
        content: "Veja fotos, valores e fale direto com o proprietário deste imóvel no PagouMorou.",
      },
    ],
  }),
  component: ApartamentoPage,
});

function ApartamentoPage() {
  const { id } = Route.useParams();
  const apartment = apartments.find((a) => a.id === id);

  if (!apartment) {
    return (
      <Page title="Imóvel não encontrado">
        <EmptyState
          icon={Building2}
          title="Imóvel não encontrado"
          description="O anúncio que você está procurando não existe ou foi removido."
          action={<Button asChild><Link to="/buscar" search={{ type: "Todos", bedrooms: undefined, minPrice: 0, maxPrice: 20000, sort: "relevance", q: "" }}>Voltar para busca</Link></Button>}
        />
      </Page>
    );
  }

  return (
    <Page fullWidth className="pb-20" component="main">
      <div className="container mx-auto px-6 pt-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-8">
            {/* Gallery Placeholder */}
            <div className="aspect-video overflow-hidden rounded-3xl bg-surface-secondary shadow-sm">
              <img 
                src={apartment.images[0]} 
                alt={apartment.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <h1 className="text-display text-4xl font-bold">{apartment.title}</h1>
              <div className="flex items-center gap-4 text-text-secondary">
                <span className="flex items-center gap-1"><MapPin className="size-4" /> {apartment.address.neighborhoodId}, {apartment.address.city}</span>
                <span className="flex items-center gap-1"><Maximize className="size-4" /> {apartment.features.areaM2}m²</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 rounded-3xl border border-border p-6 shadow-xs">
              <div className="text-center">
                <span className="text-xs text-text-secondary block">Quartos</span>
                <span className="text-lg font-bold">{apartment.features.bedrooms}</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-text-secondary block">Banheiros</span>
                <span className="text-lg font-bold">{apartment.features.bathrooms}</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-text-secondary block">Vagas</span>
                <span className="text-lg font-bold">{apartment.features.parkingSpots}</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-text-secondary block">Andar</span>
                <span className="text-lg font-bold">{apartment.features.floor}º</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Sobre este imóvel</h3>
              <p className="leading-relaxed text-text-secondary">{apartment.description}</p>
            </div>
          </div>

          <aside>
            <div className="sticky top-28 rounded-3xl border border-border bg-white p-8 shadow-lg">
              <div className="mb-6 space-y-1">
                <span className="text-3xl font-bold text-primary">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(apartment.rent)}
                </span>
                <span className="text-sm text-text-secondary"> /mês</span>
              </div>

              <div className="mb-8 space-y-3 rounded-2xl bg-surface-secondary p-4 text-sm">
                <div className="flex justify-between">
                  <span>Condomínio</span>
                  <span className="font-medium">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(apartment.condoFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>IPTU</span>
                  <span className="font-medium">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(apartment.iptu)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                  <span>Total do pacote</span>
                  <span className="text-primary">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(apartment.rent + apartment.condoFee + apartment.iptu)}</span>
                </div>
              </div>

              <Button className="w-full h-14 text-lg font-bold rounded-2xl shadow-md transition-all active:scale-[0.98]">
                Quero alugar
              </Button>
              <Button variant="outline" className="mt-3 w-full h-14 text-lg font-bold rounded-2xl border-border">
                Falar com proprietário
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </Page>
  );
}