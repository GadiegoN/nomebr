"use client";

import React, { useState } from "react";
import { ProcessedNameData } from "@/types/ibge";
import { fetchComparisonData } from "@/services/ibgeApi";
import { compareNames } from "@/utils/rarityCalculator";
import { formatNumber } from "@/utils/formatters";
import { Icon } from "@/components/ui/Icon";
import { Alert } from "@/components/ui/Alert";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface NameComparisonProps {
  initialName1?: string;
  initialName2?: string;
}

export function NameComparison({
  initialName1 = "",
  initialName2 = "",
}: NameComparisonProps) {
  const [name1, setName1] = useState(initialName1);
  const [name2, setName2] = useState(initialName2);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [data1, setData1] = useState<ProcessedNameData | null>(null);
  const [data2, setData2] = useState<ProcessedNameData | null>(null);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name1.trim() || !name2.trim()) {
      setError("Por favor, preencha os dois nomes para comparar.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const { result1, result2 } = await fetchComparisonData(name1, name2);

      if (result1.status === "error" || result2.status === "error") {
        setError(
          result1.errorMessage ||
            result2.errorMessage ||
            "Erro ao consultar um dos nomes."
        );
        setIsLoading(false);
        return;
      }

      if (result1.status === "not_found" && result2.status === "not_found") {
        setError(
          `Nenhum dos nomes ("${name1}" e "${name2}") possui registros com divulgação estatística pelo IBGE (mínimo de 20 ocorrências).`
        );
        setData1(null);
        setData2(null);
        setIsLoading(false);
        return;
      }

      setData1(result1.data);
      setData2(result2.data);
    } catch {
      setError("Falha de rede ao consultar comparação no IBGE.");
    } finally {
      setIsLoading(false);
    }
  };

  const comparison = data1 && data2 ? compareNames(data1, data2) : null;

  return (
    <section
      id="comparar"
      className="py-12 border-t border-b scroll-mt-16 transition-colors duration-200"
      style={{
        backgroundColor: "var(--theme-surface-subtle)",
        borderColor: "var(--theme-surface-border)",
      }}
    >
      <div className="container-landing">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Icon name="scale" className="w-4 h-4" />
            <span>Duelo Demográfico</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Compare Dois Nomes Lado a Lado
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Descubra qual nome teve mais registros no Brasil e qual é o mais raro segundo o IBGE.
          </p>
        </div>

        {/* Formulário de Comparação */}
        <form
          onSubmit={handleCompare}
          className="max-w-2xl mx-auto card-2015 p-6 mb-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
            <div className="sm:col-span-2">
              <label htmlFor="comp-name-1" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Primeiro Nome
              </label>
              <input
                id="comp-name-1"
                type="text"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                placeholder="Ex: Lucas"
                disabled={isLoading}
                className="w-full border border-slate-300 rounded p-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              />
            </div>

            <div className="sm:col-span-1 text-center font-black text-slate-400 text-sm py-1">
              VS
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="comp-name-2" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Segundo Nome
              </label>
              <input
                id="comp-name-2"
                type="text"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                placeholder="Ex: Gabriel"
                disabled={isLoading}
                className="w-full border border-slate-300 rounded p-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              />
            </div>
          </div>

          <div className="mt-4 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-2015-primary w-full sm:w-auto"
            >
              {isLoading ? "Consultando IBGE..." : "Comparar Nomes"}
            </button>
          </div>

          {error && (
            <div className="mt-4">
              <Alert type="warning">{error}</Alert>
            </div>
          )}
        </form>

        {isLoading && (
          <div className="card-2015 p-8 max-w-2xl mx-auto text-center">
            <LoadingSpinner label="Buscando estatísticas comparativas do IBGE..." />
          </div>
        )}

        {/* Resultado da Comparação */}
        {comparison && data1 && data2 && (
          <div className="card-2015 p-6 max-w-3xl mx-auto bg-white border-2 border-blue-600 shadow-md">
            <div className="text-center pb-6 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Resultado do Confronto Demográfico
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                &ldquo;{comparison.nomeMaisFrequente}&rdquo; é{" "}
                <span className="text-blue-600">
                  {comparison.razaoProporcional > 1
                    ? `${comparison.razaoProporcional.toFixed(1)}x mais frequente`
                    : "igualmente frequente"}
                </span>{" "}
                que &ldquo;{comparison.nomeMaisRaro}&rdquo;
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Uma diferença de <strong>{formatNumber(comparison.diferencaAbsoluta)}</strong> pessoas registradas no Censo do IBGE.
              </p>
            </div>

            {/* Grid lado a lado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
              {/* Lado 1 */}
              <div
                className={`p-5 rounded border ${
                  data1.totalNacional >= data2.totalNacional
                    ? "bg-blue-50/70 border-blue-300"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-2xl font-black text-slate-900">
                    {data1.nomeFormatado}
                  </h4>
                  {data1.totalNacional >= data2.totalNacional && (
                    <span className="bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                      Mais Frequente
                    </span>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-slate-200/80 pb-1">
                    <span className="text-slate-600">Total Brasil:</span>
                    <strong className="text-slate-900">{formatNumber(data1.totalNacional)}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/80 pb-1">
                    <span className="text-slate-600">Década Auge:</span>
                    <strong className="text-slate-900">
                      {data1.decadaAuge ? data1.decadaAuge.rotulo : "Distribuído"}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Maior Estado:</span>
                    <strong className="text-slate-900">
                      {data1.ufMaiorFrequencia ? data1.ufMaiorFrequencia.sigla : "N/D"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Lado 2 */}
              <div
                className={`p-5 rounded border ${
                  data2.totalNacional >= data1.totalNacional
                    ? "bg-blue-50/70 border-blue-300"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-2xl font-black text-slate-900">
                    {data2.nomeFormatado}
                  </h4>
                  {data2.totalNacional >= data1.totalNacional && (
                    <span className="bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                      Mais Frequente
                    </span>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-slate-200/80 pb-1">
                    <span className="text-slate-600">Total Brasil:</span>
                    <strong className="text-slate-900">{formatNumber(data2.totalNacional)}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/80 pb-1">
                    <span className="text-slate-600">Década Auge:</span>
                    <strong className="text-slate-900">
                      {data2.decadaAuge ? data2.decadaAuge.rotulo : "Distribuído"}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Maior Estado:</span>
                    <strong className="text-slate-900">
                      {data2.ufMaiorFrequencia ? data2.ufMaiorFrequencia.sigla : "N/D"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
