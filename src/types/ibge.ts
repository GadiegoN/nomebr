/**
 * Tipos e contratos oficiais para a API de Nomes do IBGE.
 * Baseado na documentação oficial do Serviço de Dados do IBGE v2.
 */

export interface IbgeDecadeRecord {
  periodo: string; // Ex: "1930[", "[1930,1940[", "[2000,2010["
  frequencia: number;
}

export interface IbgeNameResponseItem {
  nome: string;
  sexo: string | null;
  localidade: string; // "BR" ou código UF
  res: IbgeDecadeRecord[];
}

export type IbgeNameApiResponse = IbgeNameResponseItem[];

export interface IbgeUfRecord {
  populacao: number;
  frequencia: number;
  proporcao: number; // Frequência por 100.000 habitantes
}

export interface IbgeUfResponseItem {
  localidade: string; // Código IBGE da UF (ex: "35")
  res: IbgeUfRecord[];
}

export type IbgeUfApiResponse = IbgeUfResponseItem[];

export interface IbgeRankingRecord {
  nome: string;
  frequencia: number;
  ranking: number;
}

export interface IbgeRankingResponseItem {
  localidade: string;
  sexo: string | null;
  res: IbgeRankingRecord[];
}

export type IbgeRankingApiResponse = IbgeRankingResponseItem[];

export interface ProcessedUfItem {
  codigoIbge: string;
  sigla: string;
  nome: string;
  regiao: string;
  frequencia: number;
  populacao: number;
  proporcao: number; // por 100.000 habitantes
  percentualNacional: number; // % do total de pessoas com o nome que estão neste estado
}

export interface ProcessedDecadeItem {
  rotulo: string; // "Até 1929", "Anos 30 (1930-1939)", etc.
  periodoOriginal: string;
  anoInicio: number;
  frequencia: number;
  percentualHistorico: number; // % do total histórico
}

export interface ProcessedNameData {
  nome: string;
  nomeFormatado: string;
  totalNacional: number;
  posicaoRanking?: number | null;
  decadas: ProcessedDecadeItem[];
  decadaAuge?: {
    rotulo: string;
    frequencia: number;
    percentual: number;
  };
  distribuicaoUf: ProcessedUfItem[];
  ufMaiorFrequencia?: ProcessedUfItem;
  ufMaiorProporcao?: ProcessedUfItem;
  proporcaoNacionalPor100k: number; // Por 100 mil habitantes no censo de 2010 (pop 190.755.799)
  percentualPopulacaoTotal: number;
  umaACadaQuantasPessoas: number;
  anoReferencia: string;
  fonteOficial: string;
}

