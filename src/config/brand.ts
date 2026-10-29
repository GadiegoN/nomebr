/**
 * Configuração centralizada de identidade da marca e metadados.
 * Qualquer alteração no nome, descrição ou links da plataforma é refletida
 * automaticamente em toda a aplicação.
 */

export interface BrandConfig {
  name: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  url: string;
  author: string;
  year: number;
  censusReference: {
    title: string;
    source: string;
    sourceUrl: string;
    baseYear: string;
    coverage: string;
    minimumFrequencyNationwide: number;
    notes: string;
  };
  social: {
    twitterHandle?: string;
  };
  navLinks: Array<{ label: string; href: string }>;
}

export const BRAND_CONFIG: BrandConfig = {
  name: "Nome Raro",
  tagline: "Descubra a raridade e a história do seu nome no Brasil",
  shortDescription:
    "Consulte a frequência oficial do seu nome no Brasil com base nas estatísticas demográficas oficiais do IBGE.",
  fullDescription:
    "Plataforma completa de consulta e comparação de frequência e raridade de nomes de brasileiros. Descubra quantas pessoas receberam seu nome por década, sua distribuição por estados e como ele se compara no ranking nacional.",
  url: "https://nomeraro.com.br",
  author: "Nome Raro",
  year: 2026,
  censusReference: {
    title: "Estatísticas de Nomes no Brasil",
    source: "IBGE - Instituto Brasileiro de Geografia e Estatística",
    sourceUrl: "https://servicodados.ibge.gov.br/api/docs/nomes?versao=2",
    baseYear: "Censo Demográfico (Série Histórica até 2010)",
    coverage: "Território Nacional Brasileiro (27 Unidades da Federação)",
    minimumFrequencyNationwide: 20,
    notes:
      "O IBGE contabilizou nomes com pelo menos 20 ocorrências em todo o país no Censo Demográfico. Nomes compostos não são agrupados; considera-se apenas o primeiro nome (prenome).",
  },
  social: {
    twitterHandle: "@nomeraro",
  },
  navLinks: [
    { label: "Pesquisar", href: "#pesquisa" },
    { label: "Comparar Nomes", href: "#comparar" },
    { label: "Como Funciona", href: "#como-funciona" },
    { label: "Mais Frequentes", href: "#populares" },
    { label: "Fonte dos Dados", href: "#fonte" },
    { label: "Dúvidas Frequentes", href: "#faq" },
  ],
};

