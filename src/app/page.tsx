import { Metadata } from "next";
import { MainAppClient } from "@/components/MainAppClient";
import { fetchNameData } from "@/services/ibgeApi";
import { BRAND_CONFIG } from "@/config/brand";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const rawNome = resolvedParams?.nome;
  const nome = typeof rawNome === "string" ? rawNome.trim() : "";

  if (nome) {
    const formatted = nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
    return {
      title: `${formatted} no Brasil: Frequência, História e Raridade | ${BRAND_CONFIG.name}`,
      description: `Descubra quantas pessoas se chamam ${formatted} no Brasil segundo dados oficiais do IBGE, em qual década esteve no auge e em quais estados é mais popular.`,
      openGraph: {
        title: `${formatted}: Quantas pessoas têm esse nome no Brasil? | ${BRAND_CONFIG.name}`,
        description: `Consulte a frequência e a evolução histórica do nome ${formatted} no Censo do IBGE.`,
        url: `${BRAND_CONFIG.url}/?nome=${encodeURIComponent(formatted)}`,
        siteName: BRAND_CONFIG.name,
        locale: "pt_BR",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `Quantas pessoas se chamam ${formatted} no Brasil?`,
        description: `Estatísticas oficiais do nome ${formatted} apuradas pelo Censo Demográfico do IBGE.`,
      },
    };
  }

  return {
    title: `${BRAND_CONFIG.name} — Consulte a Raridade do seu Nome no Brasil (Dados Oficiais IBGE)`,
    description: BRAND_CONFIG.fullDescription,
  };
}

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const rawNome = resolvedParams?.nome;
  const initialName = typeof rawNome === "string" ? rawNome.trim() : "";

  let initialData = null;
  if (initialName) {
    const res = await fetchNameData(initialName);
    if (res.status === "success" && res.data) {
      initialData = res.data;
    }
  }

  return (
    <MainAppClient
      initialName={initialName}
      initialData={initialData}
    />
  );
}
