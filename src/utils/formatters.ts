/**
 * Formatadores para exibição de números, percentuais e períodos da pesquisa.
 */

const numberFormatter = new Intl.NumberFormat("pt-BR");
const percentFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

/**
 * Formata um número inteiro no padrão brasileiro (ex: 1.250.400).
 */
export function formatNumber(value: number): string {
  if (value === null || value === undefined || isNaN(value)) return "0";
  return numberFormatter.format(Math.round(value));
}

/**
 * Formata um percentual com símbolo % (ex: 12,4%).
 */
export function formatPercent(value: number): string {
  if (value === null || value === undefined || isNaN(value)) return "0%";
  return `${percentFormatter.format(value)}%`;
}

/**
 * Converte o formato de intervalo de década do IBGE para texto legível em português.
 * Exemplos do IBGE:
 * - "1930[" -> "Até 1929"
 * - "[1930,1940[" -> "Anos 30 (1930–1939)"
 * - "[2000,2010[" -> "Anos 2000 (2000–2010)"
 */
export function formatDecadePeriod(periodo: string): {
  rotulo: string;
  anoInicio: number;
} {
  if (periodo === "1930[") {
    return {
      rotulo: "Até 1929",
      anoInicio: 1920,
    };
  }

  const match = periodo.match(/\[(\d{4}),\s*(\d{4})\[/);
  if (match) {
    const inicio = parseInt(match[1], 10);
    const fim = parseInt(match[2], 10) - 1;

    let apelido = "";
    if (inicio === 1930) apelido = "Anos 30";
    else if (inicio === 1940) apelido = "Anos 40";
    else if (inicio === 1950) apelido = "Anos 50";
    else if (inicio === 1960) apelido = "Anos 60";
    else if (inicio === 1970) apelido = "Anos 70";
    else if (inicio === 1980) apelido = "Anos 80";
    else if (inicio === 1990) apelido = "Anos 90";
    else if (inicio === 2000) apelido = "Anos 2000";
    else apelido = `${inicio}`;

    return {
      rotulo: `${apelido} (${inicio}–${fim})`,
      anoInicio: inicio,
    };
  }

  return {
    rotulo: periodo,
    anoInicio: 0,
  };
}

/**
 * Formata a estimativa proporcional de ocorrência.
 * Exemplo: "1 a cada 64 brasileiros"
 */
export function formatOneInEvery(ratio: number): string {
  if (!ratio || ratio <= 0 || !isFinite(ratio)) return "Menos de 1 por milhão";
  if (ratio > 1000000) {
    return `Menos de 1 a cada 1 milhão de pessoas`;
  }
  return `1 a cada ${formatNumber(ratio)} pessoas`;
}

