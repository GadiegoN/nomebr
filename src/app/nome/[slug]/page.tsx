import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchNameData } from "@/services/ibgeApi";
import { MainAppClient } from "@/components/MainAppClient";
import { BRAND_CONFIG } from "@/config/brand";
import { formatProperName } from "@/utils/normalization";
import { formatNumber } from "@/utils/formatters";
import { classifyRarity } from "@/utils/rarityCalculator";

interface SlugPageProps {
  params: Promise<{ slug: string }>;
}

// Pré-renderiza estaticamente no build os nomes mais procurados do Brasil
export async function generateStaticParams() {
  const topNames = [
    "maria",
    "jose",
    "ana",
    "joao",
    "antonio",
    "francisco",
    "carlos",
    "paulo",
    "pedro",
    "lucas",
    "luiz",
    "marcos",
    "gabriel",
    "rafael",
    "daniel",
    "marcelo",
    "bruno",
    "eduardo",
  ];

  return topNames.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: SlugPageProps): Promise<Metadata> {
  const resolved = await params;
  const decoded = decodeURIComponent(resolved.slug);
  const formatted = formatProperName(decoded);

  const res = await fetchNameData(decoded);
  if (!res.data) {
    return {
      title: `Nome ${formatted} no Brasil | ${BRAND_CONFIG.name}`,
      description: `Consulte a frequência oficial do nome ${formatted} no Brasil com base nas estatísticas oficiais do IBGE.`,
    };
  }

  const data = res.data;
  const rarity = classifyRarity(data.totalNacional);

  return {
    title: `${formatted}: Quantas pessoas têm esse nome no Brasil? | ${BRAND_CONFIG.name}`,
    description: `Existem ${formatNumber(data.totalNacional)} pessoas registradas com o nome ${formatted} no Brasil (Censo IBGE). Classificação: ${rarity.titulo}. Confira a evolução por década e os estados com mais ocorrências.`,
    alternates: {
      canonical: `${BRAND_CONFIG.url}/nome/${encodeURIComponent(resolved.slug.toLowerCase())}`,
    },
    openGraph: {
      title: `Frequência do nome ${formatted} no Brasil | ${BRAND_CONFIG.name}`,
      description: `Estatísticas oficiais do IBGE para o nome ${formatted}: ${formatNumber(data.totalNacional)} registros apurados.`,
      url: `${BRAND_CONFIG.url}/nome/${encodeURIComponent(resolved.slug.toLowerCase())}`,
      siteName: BRAND_CONFIG.name,
      locale: "pt_BR",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `Estatísticas do nome ${formatted} no Brasil`,
      description: `Descubra a história e raridade de ${formatted} segundo dados oficiais do IBGE.`,
    },
  };
}

export default async function NameSlugPage({ params }: SlugPageProps) {
  const resolved = await params;
  const decoded = decodeURIComponent(resolved.slug);
  const res = await fetchNameData(decoded);

  if (!res.data) {
    notFound();
  }

  const data = res.data;

  // Schema.org JSON-LD para SEO estruturado
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `Estatísticas Demográficas do Nome ${data.nomeFormatado} no Brasil`,
    description: `Frequência histórica, distribuição por décadas e unidades federativas do nome ${data.nomeFormatado} no território brasileiro.`,
    url: `${BRAND_CONFIG.url}/nome/${encodeURIComponent(resolved.slug.toLowerCase())}`,
    creator: {
      "@type": "Organization",
      name: BRAND_CONFIG.censusReference.source,
      url: BRAND_CONFIG.censusReference.sourceUrl,
    },
    variableMeasured: "Frequência nominal por década e por estado",
    temporalCoverage: "Até 2010",
    spatialCoverage: "Brasil",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MainAppClient
        initialName={data.nomeFormatado}
        initialData={data}
      />
    </>
  );
}

