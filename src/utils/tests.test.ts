import test from "node:test";
import assert from "node:assert/strict";

import {
  removeAccents,
  validateAndNormalizeName,
  formatProperName,
} from "./normalization.ts";
import {
  formatNumber,
  formatPercent,
  formatDecadePeriod,
  formatOneInEvery,
} from "./formatters.ts";
import {
  classifyRarity,
  processIbgeData,
  compareNames,
} from "./rarityCalculator.ts";
import type { IbgeNameApiResponse, IbgeUfApiResponse } from "../types/ibge.ts";
import { THEMES, DEFAULT_THEME_ID } from "../config/themes.ts";

test("removeAccents remove acentos mantendo letras", () => {
  assert.equal(removeAccents("João"), "Joao");
  assert.equal(removeAccents("Érica"), "Erica");
  assert.equal(removeAccents("Ângela"), "Angela");
  assert.equal(removeAccents("Luísa"), "Luisa");
  assert.equal(removeAccents("Ítalo"), "Italo");
  assert.equal(removeAccents("Conceição"), "Conceicao");
});

test("validateAndNormalizeName normaliza e valida prenomes", () => {
  const r1 = validateAndNormalizeName("joão");
  assert.equal(r1.isValid, true);
  assert.equal(r1.normalized, "JOAO");
  assert.equal(r1.firstNameOnly, "joão");
  assert.equal(r1.hasMultipleWords, false);

  const r2 = validateAndNormalizeName("  Maria  Clara ");
  assert.equal(r2.isValid, true);
  assert.equal(r2.normalized, "MARIA");
  assert.equal(r2.firstNameOnly, "Maria");
  assert.equal(r2.hasMultipleWords, true);

  const r3 = validateAndNormalizeName("   ");
  assert.equal(r3.isValid, false);
  assert.match(r3.errorMessage || "", /digite um nome/);

  const r4 = validateAndNormalizeName("12345");
  assert.equal(r4.isValid, false);

  const r5 = validateAndNormalizeName("A");
  assert.equal(r5.isValid, false);
  assert.match(r5.errorMessage || "", /pelo menos 2 letras/);
});

test("formatProperName formata para Capital Case", () => {
  assert.equal(formatProperName("JOAO"), "Joao");
  assert.equal(formatProperName("maria"), "Maria");
  assert.equal(formatProperName(""), "");
});

test("formatNumber formata no padrão brasileiro", () => {
  const result = formatNumber(1250400);
  assert.ok(result.includes("1.250.400") || result.includes("1") && result.includes("250"));
  assert.equal(formatNumber(0), "0");
});

test("formatPercent formata percentuais", () => {
  const result = formatPercent(12.34);
  assert.ok(result.includes("12,3") || result.includes("12.3"));
  assert.ok(result.includes("%"));
});

test("formatDecadePeriod decodifica períodos do IBGE", () => {
  const d1 = formatDecadePeriod("1930[");
  assert.equal(d1.rotulo, "Até 1929");

  const d2 = formatDecadePeriod("[1930,1940[");
  assert.equal(d2.rotulo, "Anos 30 (1930–1939)");

  const d3 = formatDecadePeriod("[2000,2010[");
  assert.equal(d3.rotulo, "Anos 2000 (2000–2009)");
});

test("formatOneInEvery formata proporção populacional", () => {
  assert.ok(formatOneInEvery(64).includes("64"));
  assert.ok(formatOneInEvery(0).includes("Menos de 1"));
});

test("classifyRarity categoriza com base nas contagens do IBGE", () => {
  const c1 = classifyRarity(25);
  assert.equal(c1.level, "ultra-raro");

  const c2 = classifyRarity(500);
  assert.equal(c2.level, "raro");

  const c3 = classifyRarity(5_000);
  assert.equal(c3.level, "incomum");

  const c4 = classifyRarity(30_000);
  assert.equal(c4.level, "moderado");

  const c5 = classifyRarity(200_000);
  assert.equal(c5.level, "comum");

  const c6 = classifyRarity(2_000_000);
  assert.equal(c6.level, "hiperpopular");
});

test("processIbgeData processa dados brutos do IBGE com precisão", () => {
  const mockNational: IbgeNameApiResponse = [
    {
      nome: "JOAO",
      sexo: null,
      localidade: "BR",
      res: [
        { periodo: "1930[", frequencia: 60000 },
        { periodo: "[1930,1940[", frequencia: 140000 },
        { periodo: "[2000,2010[", frequencia: 800000 },
      ],
    },
  ];

  const mockUf: IbgeUfApiResponse = [
    {
      localidade: "35", // São Paulo
      res: [{ populacao: 41000000, frequencia: 300000, proporcao: 731.7 }],
    },
    {
      localidade: "33", // Rio de Janeiro
      res: [{ populacao: 16000000, frequencia: 150000, proporcao: 937.5 }],
    },
  ];

  const processed = processIbgeData(mockNational, mockUf);
  assert.ok(processed !== null);
  assert.equal(processed.nome, "JOAO");
  assert.equal(processed.totalNacional, 1000000);
  assert.equal(processed.decadas.length, 3);
  assert.equal(processed.decadaAuge?.rotulo, "Anos 2000 (2000–2009)");
  assert.equal(processed.distribuicaoUf.length, 2);
  assert.equal(processed.ufMaiorFrequencia?.sigla, "SP");
  assert.equal(processed.ufMaiorProporcao?.sigla, "RJ");
});

test("compareNames compara dois nomes e identifica o mais frequente", () => {
  const data1 = processIbgeData([
    {
      nome: "JOAO",
      sexo: null,
      localidade: "BR",
      res: [{ periodo: "[2000,2010[", frequencia: 2000000 }],
    },
  ]);
  const data2 = processIbgeData([
    {
      nome: "GABRIEL",
      sexo: null,
      localidade: "BR",
      res: [{ periodo: "[2000,2010[", frequencia: 900000 }],
    },
  ]);

  assert.ok(data1 && data2);
  const comparison = compareNames(data1, data2);
  assert.equal(comparison.nomeMaisFrequente, "Joao");
  assert.equal(comparison.nomeMaisRaro, "Gabriel");
  assert.equal(comparison.diferencaAbsoluta, 1100000);
  assert.ok(comparison.razaoProporcional > 2);
});

test("THEMES contém pelo menos 9 temas com paletas e tema padrão válido", () => {
  assert.ok(THEMES.length >= 9, `Esperado pelo menos 9 temas, encontrados ${THEMES.length}`);
  
  const hasDefault = THEMES.some((t) => t.id === DEFAULT_THEME_ID);
  assert.equal(hasDefault, true);

  for (const theme of THEMES) {
    assert.ok(theme.id && theme.id.length > 0);
    assert.ok(theme.name && theme.name.length > 0);
    assert.ok(theme.decade && theme.decade.length > 0);
    assert.equal(theme.previewColors.length, 3);
    for (const color of theme.previewColors) {
      assert.match(color, /^#[0-9a-fA-F]{6}$/);
    }
  }
});
