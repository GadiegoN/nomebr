/**
 * Lógica estatística para classificação de raridade, cálculo de picos e métricas.
 */

import type {
  IbgeDecadeRecord,
  IbgeNameApiResponse,
  IbgeUfApiResponse,
  ProcessedDecadeItem,
  ProcessedNameData,
  ProcessedUfItem,
} from "../types/ibge.ts";
import type { NameComparisonResult, RarityClassification } from "../types/rarity.ts";
import { UF_BY_CODE } from "../config/brazilUFs.ts";
import { formatDecadePeriod } from "./formatters.ts";
import { formatProperName } from "./normalization.ts";

// População brasileira recenseada no Censo Demográfico de 2010
export const CENSO_2010_POPULACAO_TOTAL = 190_755_799;

/**
 * Classifica o nome em faixas estatísticas de raridade.
 */
export function classifyRarity(totalNacional: number): RarityClassification {
  if (totalNacional < 100) {
    return {
      level: "ultra-raro",
      titulo: "Ultra Raro",
      badgeLabel: "Raridade Extrema",
      descricao:
        "Este nome possui uma frequência extremamente baixa no Brasil, figurando entre os nomes mais singulares já registrados no censo.",
      detalheMetodologico:
        "O IBGE apenas divulga nomes com pelo menos 20 ocorrências em nível nacional. Este nome está na faixa limítrofe de divulgação estatística.",
      scoreRaridade: 98,
      corFundo: "bg-purple-100",
      corTexto: "text-purple-900",
      corBorda: "border-purple-300",
    };
  }

  if (totalNacional < 1_000) {
    return {
      level: "raro",
      titulo: "Raro",
      badgeLabel: "Nome Raro",
      descricao:
        "Um nome muito pouco frequente no território nacional. É provável que pouquíssimas pessoas em sua cidade ou círculo social compartilhem esse nome.",
      detalheMetodologico:
        "Nomes nesta faixa representam menos de 0,0005% da população recenseada.",
      scoreRaridade: 88,
      corFundo: "bg-indigo-100",
      corTexto: "text-indigo-900",
      corBorda: "border-indigo-300",
    };
  }

  if (totalNacional < 15_000) {
    return {
      level: "incomum",
      titulo: "Incomum",
      badgeLabel: "Nome Incomum",
      descricao:
        "Um nome conhecido e presente em diversas regiões, mas sem figurar entre as escolhas mais habituais da maioria dos brasileiros.",
      detalheMetodologico:
        "Representa uma fatia seleta de nomes com presença estável porém não massiva.",
      scoreRaridade: 70,
      corFundo: "bg-blue-100",
      corTexto: "text-blue-900",
      corBorda: "border-blue-300",
    };
  }

  if (totalNacional < 80_000) {
    return {
      level: "moderado",
      titulo: "Frequência Moderada",
      badgeLabel: "Frequência Equilibrada",
      descricao:
        "Nome com boa difusão no país, facilmente reconhecido, com presença consistente ao longo de diferentes décadas.",
      detalheMetodologico:
        "Nomes nesta faixa costumam figurar entre os 500 a 1.500 nomes mais registrados do país.",
      scoreRaridade: 50,
      corFundo: "bg-amber-100",
      corTexto: "text-amber-900",
      corBorda: "border-amber-300",
    };
  }

  if (totalNacional < 400_000) {
    return {
      level: "comum",
      titulo: "Tradicional / Comum",
      badgeLabel: "Nome Tradicional",
      descricao:
        "Um dos nomes clássicos e recorrentes da cultura brasileira, compartilhado por centenas de milhares de compatriotas.",
      detalheMetodologico:
        "Figura entre os 100 a 300 nomes mais frequentes de toda a história censitária do país.",
      scoreRaridade: 25,
      corFundo: "bg-emerald-100",
      corTexto: "text-emerald-900",
      corBorda: "border-emerald-300",
    };
  }

  return {
    level: "hiperpopular",
    titulo: "Hiperpopular",
    badgeLabel: "Um dos Mais Populares",
    descricao:
      "Pertence ao grupo seleto dos nomes mais populares da história do Brasil, figurando entre os líderes históricos de registros.",
    detalheMetodologico:
      "Está situado no ápice da pirâmide onomástica nacional, no topo das centenas de milhares ou milhões de registros.",
    scoreRaridade: 5,
    corFundo: "bg-yellow-100",
    corTexto: "text-yellow-900",
    corBorda: "border-yellow-300",
  };
}

/**
 * Processa a resposta da API do IBGE transformando em estatísticas estruturadas.
 */
export function processIbgeData(
  nationalData: IbgeNameApiResponse,
  ufData?: IbgeUfApiResponse
): ProcessedNameData | null {
  if (!nationalData || nationalData.length === 0 || !nationalData[0].res) {
    return null;
  }

  const primaryItem = nationalData[0];
  const rawRecords: IbgeDecadeRecord[] = primaryItem.res || [];

  const totalNacional = rawRecords.reduce(
    (sum, item) => sum + (item.frequencia || 0),
    0
  );

  // Se o total for zero, não há dados úteis
  if (totalNacional === 0) {
    return null;
  }

  // Processa as décadas
  const decadas: ProcessedDecadeItem[] = rawRecords.map((item) => {
    const { rotulo, anoInicio } = formatDecadePeriod(item.periodo);
    const percentualHistorico =
      totalNacional > 0 ? (item.frequencia / totalNacional) * 100 : 0;
    return {
      rotulo,
      periodoOriginal: item.periodo,
      anoInicio,
      frequencia: item.frequencia,
      percentualHistorico,
    };
  });

  // Identifica década de pico/auge
  let decadaAuge: ProcessedNameData["decadaAuge"] | undefined;
  if (decadas.length > 0) {
    const augeItem = [...decadas].sort(
      (a, b) => b.frequencia - a.frequencia
    )[0];
    if (augeItem && augeItem.frequencia > 0) {
      decadaAuge = {
        rotulo: augeItem.rotulo,
        frequencia: augeItem.frequencia,
        percentual: augeItem.percentualHistorico,
      };
    }
  }

  // Processa estados (UFs)
  const distribuicaoUf: ProcessedUfItem[] = [];

  if (ufData && ufData.length > 0) {
    for (const item of ufData) {
      const ufInfo = UF_BY_CODE.get(item.localidade);
      const record = item.res && item.res[0];
      if (ufInfo && record && record.frequencia > 0) {
        distribuicaoUf.push({
          codigoIbge: item.localidade,
          sigla: ufInfo.sigla,
          nome: ufInfo.nome,
          regiao: ufInfo.regiao,
          frequencia: record.frequencia,
          populacao: record.populacao,
          proporcao: record.proporcao,
          percentualNacional:
            totalNacional > 0 ? (record.frequencia / totalNacional) * 100 : 0,
        });
      }
    }
  }

  // Ordena estados por frequência decrescente
  distribuicaoUf.sort((a, b) => b.frequencia - a.frequencia);

  const ufMaiorFrequencia =
    distribuicaoUf.length > 0 ? distribuicaoUf[0] : undefined;

  // Encontra o estado com maior proporção por 100k hab
  const ufMaiorProporcao =
    distribuicaoUf.length > 0
      ? [...distribuicaoUf].sort((a, b) => b.proporcao - a.proporcao)[0]
      : undefined;

  // Proporção nacional
  const proporcaoNacionalPor100k =
    (totalNacional / CENSO_2010_POPULACAO_TOTAL) * 100_000;
  const percentualPopulacaoTotal =
    (totalNacional / CENSO_2010_POPULACAO_TOTAL) * 100;
  const umaACadaQuantasPessoas =
    totalNacional > 0
      ? Math.round(CENSO_2010_POPULACAO_TOTAL / totalNacional)
      : 0;

  return {
    nome: primaryItem.nome,
    nomeFormatado: formatProperName(primaryItem.nome),
    totalNacional,
    decadas,
    decadaAuge,
    distribuicaoUf,
    ufMaiorFrequencia,
    ufMaiorProporcao,
    proporcaoNacionalPor100k,
    percentualPopulacaoTotal,
    umaACadaQuantasPessoas,
    anoReferencia: "Censo Demográfico (Série Histórica até 2010)",
    fonteOficial: "IBGE - Instituto Brasileiro de Geografia e Estatística",
  };
}

/**
 * Compara dois nomes estatisticamente.
 */
export function compareNames(
  data1: ProcessedNameData,
  data2: ProcessedNameData
): NameComparisonResult {
  const total1 = data1.totalNacional;
  const total2 = data2.totalNacional;
  const diferencaAbsoluta = Math.abs(total1 - total2);

  const menor = Math.min(total1, total2);
  const maior = Math.max(total1, total2);
  const razaoProporcional = menor > 0 ? maior / menor : 0;

  const nomeMaisFrequente =
    total1 >= total2 ? data1.nomeFormatado : data2.nomeFormatado;
  const nomeMaisRaro =
    total1 < total2 ? data1.nomeFormatado : data2.nomeFormatado;

  return {
    nome1: data1.nomeFormatado,
    nome2: data2.nomeFormatado,
    total1,
    total2,
    diferencaAbsoluta,
    razaoProporcional,
    nomeMaisFrequente,
    nomeMaisRaro,
  };
}
