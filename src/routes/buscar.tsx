import { createFileRoute } from "@tanstack/react-router";
import { SearchX } from "lucide-react";
import { apartments } from "@/mock";
import { PropertyCard } from "@/components/cards/property-card";
import { Badge } from "@/components/ui/badge";

import { EmptyState } from "@/components/feedback/empty-state";
import { Page } from "@/components/layout/page";

export const Route = createFileRoute("/buscar")({
  head: () => ({
    meta: [
      { title: "Buscar apartamentos para alugar | PagouMorou" },
      {
        name: "description",
        content: "Filtre apartamentos por bairro, preço e características e alugue sem burocracia.",
      },
      { property: "og:title", content: "Buscar apartamentos | PagouMorou" },
      {
        property: "og:description",
        content: "Encontre apartamentos residenciais para alugar direto com o proprietário.",
      },
    ],
  }),
  component: BuscarPage,
});

function BuscarPage() {
  return (
    <Page fullWidth className="pb-20">
      <div className="container mx-auto px-6 pt-10">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h1 className="text-display text-4xl font-bold mb-2">Encontre seu novo lar</h1>
            <p className="text-text-secondary">Explore centenas de apartamentos prontos para morar em todo o Brasil.</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filters Sidebar */}
          <aside className="space-y-8">
            <div className="rounded-3xl border border-border p-6 shadow-xs bg-white">
              <h3 className="font-bold mb-6">Filtros</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">Tipo de imóvel</label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-primary text-white">Todos</Badge>
                    <Badge variant="outline" className="border-border">Studio</Badge>
                    <Badge variant="outline" className="border-border">Apartamento</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">Quartos</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, "4+"].map((n) => (
                      <button key={n} className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-sm font-medium hover:border-primary hover:text-primary transition-all">
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm text-text-secondary">
              <span>Mostrando {apartments.length} imóveis</span>
              <div className="flex items-center gap-2">
                <span>Ordenar por:</span>
                <span className="font-bold text-foreground cursor-pointer">Relevância</span>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {apartments.map((apt) => (
                <PropertyCard key={apt.id} apartment={apt} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}