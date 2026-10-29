/**
 * Camada de serviço isolada para comunicação com a API pública oficial do IBGE.
 * Documentação oficial: https://servicodados.ibge.gov.br/api/docs/nomes?versao=2
 */

import type {
  IbgeNameApiResponse,
  IbgeRankingApiResponse,
  IbgeUfApiResponse,
  ProcessedNameData,
} from "../types/ibge.ts";
import { processIbgeData } from "../utils/rarityCalculator.ts";
import { validateAndNormalizeName } from "../utils/normalization.ts";

const IBGE_API_BASE_URL = "https://servicodados.ibge.gov.br/api/v2/censos/nomes";

// Cache em memória durante a sessão da aplicação
const memoryCache = new Map<string, ProcessedNameData | null>();
const rankingCache = new Map<string, IbgeRankingApiResponse>();

export interface FetchNameResult {
  data: ProcessedNameData | null;
  status: "success" | "not_found" | "error";
  normalizedName: string;
  errorMessage?: string;
  warningMessage?: string;
}

/**
 * Consulta um nome individual com frequência histórica nacional e distribuição por UF.
 */
export async function fetchNameData(inputName: string): Promise<FetchNameResult> {
  const validation = validateAndNormalizeName(inputName);

  if (!validation.isValid) {
    return {
      data: null,
      status: "error",
      normalizedName: "",
      errorMessage: validation.errorMessage || "Nome inválido.",
    };
  }

  const normalized = validation.normalized;

  // Verifica cache em memória
  if (memoryCache.has(normalized)) {
    const cached = memoryCache.get(normalized) || null;
    return {
      data: cached,
      status: cached ? "success" : "not_found",
      normalizedName: normalized,
      warningMessage: validation.hasMultipleWords
        ? `O IBGE analisa apenas o primeiro nome individual ("${validation.firstNameOnly}"). Nomes compostos não são agrupados.`
        : undefined,
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    // Consulta em paralelo: dados nacionais e distribuição por UF
    const [nationalRes, ufRes] = await Promise.all([
      fetch(`${IBGE_API_BASE_URL}/${encodeURIComponent(normalized)}`, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      }),
      fetch(`${IBGE_API_BASE_URL}/${encodeURIComponent(normalized)}?groupBy=UF`, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      }),
    ]);

    clearTimeout(timeoutId);

    if (!nationalRes.ok) {
      throw new Error(`Erro na resposta do IBGE (HTTP ${nationalRes.status})`);
    }

    const nationalData: IbgeNameApiResponse = await nationalRes.json();
    let ufData: IbgeUfApiResponse | undefined = undefined;

    if (ufRes.ok) {
      try {
        ufData = await ufRes.json();
      } catch {
        // Se a UF falhar, prossegue com os dados nacionais
        ufData = undefined;
      }
    }

    if (!nationalData || nationalData.length === 0 || !nationalData[0].res || nationalData[0].res.length === 0) {
      memoryCache.set(normalized, null);
      return {
        data: null,
        status: "not_found",
        normalizedName: normalized,
        warningMessage: validation.hasMultipleWords
          ? `O IBGE analisa apenas o primeiro nome individual ("${validation.firstNameOnly}"). Nomes compostos não são agrupados.`
          : undefined,
      };
    }

    const processed = processIbgeData(nationalData, ufData);
    memoryCache.set(normalized, processed);

    return {
      data: processed,
      status: processed ? "success" : "not_found",
      normalizedName: normalized,
      warningMessage: validation.hasMultipleWords
        ? `O IBGE analisa apenas o primeiro nome individual ("${validation.firstNameOnly}"). Nomes compostos não são agrupados.`
        : undefined,
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error && err.name === "AbortError"
        ? "Tempo limite esgotado ao contatar os servidores do IBGE. Verifique sua conexão e tente novamente."
        : err instanceof Error
        ? err.message
        : "Ocorreu uma falha inesperada ao consultar os dados estatísticos.";

    return {
      data: null,
      status: "error",
      normalizedName: normalized,
      errorMessage: message,
    };
  }
}

/**
 * Consulta dois nomes para comparação.
 */
export async function fetchComparisonData(
  name1: string,
  name2: string
): Promise<{
  result1: FetchNameResult;
  result2: FetchNameResult;
}> {
  const [result1, result2] = await Promise.all([
    fetchNameData(name1),
    fetchNameData(name2),
  ]);

  return { result1, result2 };
}

/**
 * Obtém o ranking oficial dos nomes mais frequentes do Brasil.
 */
export async function fetchTopRanking(
  qtd: number = 20,
  sexo?: "M" | "F"
): Promise<IbgeRankingApiResponse> {
  const cacheKey = `ranking_${qtd}_${sexo || "ALL"}`;

  if (rankingCache.has(cacheKey)) {
    return rankingCache.get(cacheKey)!;
  }

  try {
    let url = `${IBGE_API_BASE_URL}/ranking?qtd=${qtd}`;
    if (sexo) {
      url += `&sexo=${sexo}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return [];
    }

    const data: IbgeRankingApiResponse = await res.json();
    rankingCache.set(cacheKey, data);
    return data;
  } catch {
    return [];
  }
}
