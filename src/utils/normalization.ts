/**
 * Utilitários de normalização e validação de nomes para consulta no IBGE.
 */

export interface NameValidationResult {
  isValid: boolean;
  normalized: string;
  original: string;
  hasMultipleWords: boolean;
  firstNameOnly: string;
  errorMessage?: string;
}

/**
 * Remove acentuação e diacríticos de uma string, mantendo caracteres alfabéticos.
 */
export function removeAccents(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Normaliza e valida a entrada do usuário para consulta na API do IBGE.
 * O IBGE registra apenas prenomes (primeiro nome) em caixa alta sem acentuação.
 */
export function validateAndNormalizeName(input: string): NameValidationResult {
  const original = input ? input.trim() : "";

  if (!original) {
    return {
      isValid: false,
      normalized: "",
      original: "",
      hasMultipleWords: false,
      firstNameOnly: "",
      errorMessage: "Por favor, digite um nome para pesquisar.",
    };
  }

  // Remove caracteres numéricos ou pontuações estranhas, mantendo letras e espaços
  const cleaned = original.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, "").trim();

  if (!cleaned) {
    return {
      isValid: false,
      normalized: "",
      original,
      hasMultipleWords: false,
      firstNameOnly: "",
      errorMessage: "O nome deve conter apenas letras.",
    };
  }

  const words = cleaned.split(/\s+/).filter(Boolean);
  const hasMultipleWords = words.length > 1;
  const firstName = words[0];

  // IBGE aceita nomes com no mínimo 2 letras
  if (firstName.length < 2) {
    return {
      isValid: false,
      normalized: "",
      original,
      hasMultipleWords,
      firstNameOnly: firstName,
      errorMessage: "O nome deve conter pelo menos 2 letras.",
    };
  }

  const normalized = removeAccents(firstName).toUpperCase();

  return {
    isValid: true,
    normalized,
    original,
    hasMultipleWords,
    firstNameOnly: firstName,
  };
}

/**
 * Formata um nome em Capital Case (ex: "JOAO" -> "João" ou "Maria").
 */
export function formatProperName(name: string): string {
  if (!name) return "";
  const lower = name.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

