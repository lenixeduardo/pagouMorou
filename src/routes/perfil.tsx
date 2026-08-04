import { createFileRoute } from "@tanstack/react-router";
import { UserCircle } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { Page } from "@/components/layout/page";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Meu perfil | PagouMorou" },
      { name: "description", content: "Gerencie seus dados, contratos e preferências de aluguel." },
      { property: "og:title", content: "Meu perfil | PagouMorou" },
      { property: "og:description", content: "Dados, documentos e contratos digitais em um só lugar." },
    ],
  }),
  component: PerfilPage,
});

function PerfilPage() {
  return (
    <Page title="Perfil" description="Dados pessoais, documentos e contratos digitais.">
      <EmptyState
        icon={UserCircle}
        title="Perfil em construção"
        description="Configurações de conta e histórico de contratos chegam nas próximas etapas."
      />
    </Page>
  );
}