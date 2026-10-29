import React from "react";
import { ProcessedNameData } from "@/types/ibge";
import { formatPercent } from "@/utils/formatters";
import { Icon } from "@/components/ui/Icon";

interface StatisticsGridProps {
  data: ProcessedNameData;
}

export function StatisticsGrid({ data }: StatisticsGridProps) {
  return (
    <div className="card-2015 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
        <Icon name="database" className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold text-slate-900">
          Métricas e Curiosidades Estatísticas
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="border border-slate-200 rounded p-4 bg-slate-50/50">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Proporção por 100 mil habitantes
          </span>
          <span className="text-2xl font-black text-slate-900 block">
            {data.proporcaoNacionalPor100k.toFixed(1)}
          </span>
          <p className="text-xs text-slate-600 mt-1">
            A cada 100.000 brasileiros recenseados no Censo, aproximadamente {Math.max(1, Math.round(data.proporcaoNacionalPor100k))} se chamam {data.nomeFormatado}.
          </p>
        </div>

        {/* Card 2 */}
        <div className="border border-slate-200 rounded p-4 bg-slate-50/50">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Fração da População Total
          </span>
          <span className="text-2xl font-black text-slate-900 block">
            {data.percentualPopulacaoTotal < 0.001
              ? "< 0,001%"
              : formatPercent(data.percentualPopulacaoTotal)}
          </span>
          <p className="text-xs text-slate-600 mt-1">
            Considerando os 190.755.799 cidadãos recenseados pelo IBGE no Censo Demográfico.
          </p>
        </div>

        {/* Card 3 */}
        <div className="border border-slate-200 rounded p-4 bg-slate-50/50">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Décadas Registradas
          </span>
          <span className="text-2xl font-black text-slate-900 block">
            {data.decadas.length} décadas
          </span>
          <p className="text-xs text-slate-600 mt-1">
            Presença documentada desde antes de 1930 até os anos 2000.
          </p>
        </div>
      </div>

      {/* Nota de transparência metodológica */}
      <div className="mt-4 p-3 bg-blue-50/60 border border-blue-200 rounded text-xs text-blue-900 leading-relaxed">
        <strong>Nota de Transparência Metodológica:</strong> Estes números referem-se à frequência histórica apurada pelo Censo do IBGE. Eles não representam a contagem exata de pessoas vivas no dia de hoje, pois não consideram a taxa de mortalidade posterior ao levantamento nem os nascimentos recentes pós-censo.
      </div>
    </div>
  );
}
