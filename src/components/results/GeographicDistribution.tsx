"use client";

import React, { useState } from "react";
import { ProcessedNameData } from "@/types/ibge";
import { formatNumber, formatPercent } from "@/utils/formatters";
import { Icon } from "@/components/ui/Icon";
import { BrazilLeafletMap } from "@/components/map/BrazilLeafletMap";

interface GeographicDistributionProps {
  data: ProcessedNameData;
}

export function GeographicDistribution({ data }: GeographicDistributionProps) {
  const [activeTab, setActiveTab] = useState<"mapa" | "tabela">("mapa");
  const [showAll, setShowAll] = useState(false);
  const ufs = data.distribuicaoUf;

  if (!ufs || ufs.length === 0) {
    return (
      <div className="card-2015 p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="map-pin" className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-900">
            Distribuição por Unidades da Federação (Estados)
          </h3>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-800 mb-1">
            Dados estaduais não divulgados para este nome
          </p>
          <p className="leading-relaxed">
            Para garantir a preservação do sigilo estatístico dos cidadãos, o IBGE não divulga o recorte por estados quando o nome apresenta frequência muito baixa na unidade da federação.
          </p>
        </div>
      </div>
    );
  }

  const displayedUfs = showAll ? ufs : ufs.slice(0, 8);

  return (
    <div className="card-2015 p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Icon name="map-pin" className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Distribuição Geográfica pelos Estados Brasileiros
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ocorrências de &ldquo;{data.nomeFormatado}&rdquo; registradas nas Unidades da Federação
          </p>
        </div>
      </div>

      {/* Destaques de Estados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {data.ufMaiorFrequencia && (
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 block mb-1">
              Estado com Mais Registros (Absoluto)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-blue-950">
                {data.ufMaiorFrequencia.nome} ({data.ufMaiorFrequencia.sigla})
              </span>
            </div>
            <p className="text-xs text-blue-800 mt-1">
              <strong>{formatNumber(data.ufMaiorFrequencia.frequencia)}</strong> pessoas ({formatPercent(data.ufMaiorFrequencia.percentualNacional)} de todos os {data.nomeFormatado} do Brasil)
            </p>
          </div>
        )}

        {data.ufMaiorProporcao && (
          <div className="bg-emerald-50 border border-emerald-200 rounded p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block mb-1">
              Estado com Maior Proporção Relativa
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-950">
                {data.ufMaiorProporcao.nome} ({data.ufMaiorProporcao.sigla})
              </span>
            </div>
            <p className="text-xs text-emerald-800 mt-1">
              <strong>{data.ufMaiorProporcao.proporcao.toFixed(1)}</strong> por 100 mil habitantes (maior densidade demográfica do nome)
            </p>
          </div>
        )}
      </div>

      {/* Alternador de Visualização: Mapa vs Tabela */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-5">
        <div className="inline-flex rounded shadow-xs" role="tablist">
          <button
            type="button"
            onClick={() => setActiveTab("mapa")}
            className={`px-3 py-1.5 text-xs font-bold rounded-l border cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === "mapa"
                ? "btn-2015-primary !py-1.5 !px-3"
                : "btn-2015-secondary !py-1.5 !px-3"
            }`}
          >
            <Icon name="map-pin" className="w-3.5 h-3.5" />
            <span>Mapa Cartográfico (Leaflet)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tabela")}
            className={`px-3 py-1.5 text-xs font-bold rounded-r border-t border-b border-r cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === "tabela"
                ? "btn-2015-primary !py-1.5 !px-3"
                : "btn-2015-secondary !py-1.5 !px-3"
            }`}
          >
            <Icon name="chart-bar" className="w-3.5 h-3.5" />
            <span>Tabela por Estados ({ufs.length})</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-500 hidden sm:inline">
          {ufs.length} estados com dados oficiais divulgados
        </span>
      </div>

      {/* Conteúdo da Aba Ativa */}
      {activeTab === "mapa" ? (
        <div>
          <BrazilLeafletMap data={data} />
          <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              💡 Dica: Toque ou passe o mouse sobre qualquer estado para comparar frequência e ranking.
            </span>
            <button
              type="button"
              onClick={() => setActiveTab("tabela")}
              className="font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Ver todos em lista tabular &rarr;
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Tabela clássica estilo Bootstrap 3 */}
          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-bold border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-4 py-3">Estado</th>
                  <th scope="col" className="px-4 py-3">Região</th>
                  <th scope="col" className="px-4 py-3 text-right">Ocorrências</th>
                  <th scope="col" className="px-4 py-3 text-right">% do Brasil</th>
                  <th scope="col" className="px-4 py-3 text-right">Por 100k hab.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {displayedUfs.map((item) => (
                  <tr key={item.codigoIbge} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 font-semibold text-slate-900 flex items-center gap-2">
                      <span className="inline-block w-6 text-center text-xs font-bold px-1 py-0.5 rounded bg-slate-200 text-slate-700">
                        {item.sigla}
                      </span>
                      <span>{item.nome}</span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">
                      {item.regiao}
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium text-slate-900">
                      {formatNumber(item.frequencia)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-xs text-slate-600">
                      {formatPercent(item.percentualNacional)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-xs font-semibold text-emerald-700">
                      {item.proporcao.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {ufs.length > 8 && (
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setShowAll(!showAll)}
                className="btn-2015-secondary !text-xs !py-2 !px-4"
              >
                {showAll ? "Mostrar menos estados" : `Ver todos os ${ufs.length} estados com registros`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
