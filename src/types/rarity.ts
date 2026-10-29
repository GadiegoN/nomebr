/**
 * Tipos e modelos para classificação de raridade de nomes e estados de pesquisa.
 */

export type RarityLevel =
  | "ultra-raro" // Menos de 100 registros ou corte de amostragem
  | "raro" // 100 a 1.000 registros
  | "incomum" // 1.000 a 15.000 registros
  | "moderado" // 15.000 a 80.000 registros
  | "comum" // 80.000 a 400.000 registros
  | "hiperpopular"; // Mais de 400.000 registros

export interface RarityClassification {
  level: RarityLevel;
  titulo: string;
  badgeLabel: string;
  descricao: string;
  detalheMetodologico: string;
  scoreRaridade: number; // 0 (mais comum) a 100 (mais raro)
  corFundo: string;
  corTexto: string;
  corBorda: string;
}

export type SearchState =
  | { status: "idle" }
  | { status: "loading"; nome: string }
  | { status: "success"; nome: string }
  | { status: "not_found"; nome: string; motivo: "abaixo_corte" | "inexistente" }
  | { status: "error"; nome: string; mensagem: string };

export interface NameComparisonResult {
  nome1: string;
  nome2: string;
  total1: number;
  total2: number;
  diferencaAbsoluta: number;
  razaoProporcional: number; // Quantas vezes nome 1 é mais/menos comum que nome 2
  nomeMaisFrequente: string;
  nomeMaisRaro: string;
}

