import React from "react";
import { ProcessedNameData } from "@/types/ibge";
import { classifyRarity } from "@/utils/rarityCalculator";
import { formatNumber, formatPercent } from "@/utils/formatters";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";

interface NameResultHeaderProps {
  data: ProcessedNameData;
}

export function NameResultHeader({ data }: NameResultHeaderProps) {
  const rarity = classifyRarity(data.totalNacional);

  return (
    <div className="card-2015 p-6 sm:p-8 bg-white border-t-4 border-t-blue-600 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Resultado da Consulta Demográfica
            </span>
            <Badge variant="primary">IBGE Oficial</Badge>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {data.nomeFormatado}
          </h2>
        </div>

        {/* Badge de Raridade */}
        <div className="flex flex-col sm:items-end">
          <span className="text-xs font-semibold text-slate-500 mb-1">
            Grau de Raridade no Brasil
          </span>
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-bold text-base border ${rarity.corFundo} ${rarity.corTexto} ${rarity.corBorda}`}
          >
            <Icon name="sparkles" className="w-5 h-5 shrink-0" />
            <span>{rarity.titulo}</span>
          </div>
        </div>
      </div>

      {/* Grid com destaques em números grandes clássicos de 2015 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
        <div className="bg-slate-50 border border-slate-200 rounded p-4 text-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">
            Total de Registros
          </span>
          <span className="text-3xl sm:text-4xl font-black text-blue-700 block">
            {formatNumber(data.totalNacional)}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            pessoas apuradas no Censo
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded p-4 text-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">
            Década de Maior Auge
          </span>
          <span className="text-xl sm:text-2xl font-bold text-slate-900 block mt-1">
            {data.decadaAuge ? data.decadaAuge.rotulo : "Sem concentração"}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            {data.decadaAuge
              ? `${formatNumber(data.decadaAuge.frequencia)} nascimentos (${formatPercent(data.decadaAuge.percentual)} do total)`
              : "Distribuição estável"}
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded p-4 text-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">
            Frequência Relativa
          </span>
          <span className="text-xl sm:text-2xl font-bold text-emerald-700 block mt-1">
            {data.umaACadaQuantasPessoas > 0
              ? `1 a cada ${formatNumber(data.umaACadaQuantasPessoas)}`
              : "Menos de 1 por milhão"}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            brasileiros recenseados
          </span>
        </div>
      </div>
    </div>
  );
}

