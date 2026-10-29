/**
 * Mapeamento oficial das 27 Unidades da Federação do Brasil com códigos IBGE.
 */

export interface BrazilUF {
  codigoIbge: string;
  sigla: string;
  nome: string;
  regiao: "Norte" | "Nordeste" | "Centro-Oeste" | "Sudeste" | "Sul";
}

export const BRAZIL_UFS: BrazilUF[] = [
  { codigoIbge: "11", sigla: "RO", nome: "Rondônia", regiao: "Norte" },
  { codigoIbge: "12", sigla: "AC", nome: "Acre", regiao: "Norte" },
  { codigoIbge: "13", sigla: "AM", nome: "Amazonas", regiao: "Norte" },
  { codigoIbge: "14", sigla: "RR", nome: "Roraima", regiao: "Norte" },
  { codigoIbge: "15", sigla: "PA", nome: "Pará", regiao: "Norte" },
  { codigoIbge: "16", sigla: "AP", nome: "Amapá", regiao: "Norte" },
  { codigoIbge: "17", sigla: "TO", nome: "Tocantins", regiao: "Norte" },
  { codigoIbge: "21", sigla: "MA", nome: "Maranhão", regiao: "Nordeste" },
  { codigoIbge: "22", sigla: "PI", nome: "Piauí", regiao: "Nordeste" },
  { codigoIbge: "23", sigla: "CE", nome: "Ceará", regiao: "Nordeste" },
  { codigoIbge: "24", sigla: "RN", nome: "Rio Grande do Norte", regiao: "Nordeste" },
  { codigoIbge: "25", sigla: "PB", nome: "Paraíba", regiao: "Nordeste" },
  { codigoIbge: "26", sigla: "PE", nome: "Pernambuco", regiao: "Nordeste" },
  { codigoIbge: "27", sigla: "AL", nome: "Alagoas", regiao: "Nordeste" },
  { codigoIbge: "28", sigla: "SE", nome: "Sergipe", regiao: "Nordeste" },
  { codigoIbge: "29", sigla: "BA", nome: "Bahia", regiao: "Nordeste" },
  { codigoIbge: "31", sigla: "MG", nome: "Minas Gerais", regiao: "Sudeste" },
  { codigoIbge: "32", sigla: "ES", nome: "Espírito Santo", regiao: "Sudeste" },
  { codigoIbge: "33", sigla: "RJ", nome: "Rio de Janeiro", regiao: "Sudeste" },
  { codigoIbge: "35", sigla: "SP", nome: "São Paulo", regiao: "Sudeste" },
  { codigoIbge: "41", sigla: "PR", nome: "Paraná", regiao: "Sul" },
  { codigoIbge: "42", sigla: "SC", nome: "Santa Catarina", regiao: "Sul" },
  { codigoIbge: "43", sigla: "RS", nome: "Rio Grande do Sul", regiao: "Sul" },
  { codigoIbge: "50", sigla: "MS", nome: "Mato Grosso do Sul", regiao: "Centro-Oeste" },
  { codigoIbge: "51", sigla: "MT", nome: "Mato Grosso", regiao: "Centro-Oeste" },
  { codigoIbge: "52", sigla: "GO", nome: "Goiás", regiao: "Centro-Oeste" },
  { codigoIbge: "53", sigla: "DF", nome: "Distrito Federal", regiao: "Centro-Oeste" },
];

export const UF_BY_CODE = new Map<string, BrazilUF>(
  BRAZIL_UFS.map((uf) => [uf.codigoIbge, uf])
);

export const UF_BY_SIGLA = new Map<string, BrazilUF>(
  BRAZIL_UFS.map((uf) => [uf.sigla.toUpperCase(), uf])
);

