import React from "react";
import { ProcessedNameData } from "@/types/ibge";
import { formatNumber, formatPercent } from "@/utils/formatters";
import { Icon } from "@/components/ui/Icon";

interface DecadeDistributionChartProps {
  data: ProcessedNameData;
}

export function DecadeDistributionChart({ data }: DecadeDistributionChartProps) {
  const decadas = data.decadas;

  if (!decadas || decadas.length === 0) {
    return null;
  }

  // Encontra a maior frequência para calcular proporções visuais
  const maxFrequencia = Math.max(...decadas.map((d) => d.frequencia), 1);

  return (
    <div className="card-2015 p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Icon name="chart-bar" className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Evolução Histórica por Década de Nascimento
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Frequência de pessoas registradas com o nome &ldquo;{data.nomeFormatado}&rdquo; ao longo do século XX e XXI
          </p>
        </div>
      </div>

      {/* Gráfico de Barras Estilo 2015 */}
      <div className="space-y-3.5">
        {decadas.map((item) => {
          const isAuge = data.decadaAuge && data.decadaAuge.rotulo === item.rotulo;
          const barWidthPercent = (item.frequencia / maxFrequencia) * 100;

          return (
            <div key={item.periodoOriginal} className="text-sm">
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  {item.rotulo}
                  {isAuge && (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded text-[10px] font-bold">
                      Auge Histórico
                    </span>
                  )}
                </span>
                <span className="text-slate-600 font-medium">
                  <strong>{formatNumber(item.frequencia)}</strong>{" "}
                  <span className="text-slate-400">({formatPercent(item.percentualHistorico)})</span>
                </span>
              </div>

              {/* Barra de progresso */}
              <div className="h-6 w-full bg-slate-100 rounded overflow-hidden border border-slate-200 flex items-center">
                <div
                  className={`h-full transition-all duration-300 rounded-sm ${
                    isAuge
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 shadow-sm"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  style={{ width: `${Math.max(barWidthPercent, 1.5)}%` }}
                  role="progressbar"
                  aria-valuenow={item.frequencia}
                  aria-valuemin={0}
                  aria-valuemax={maxFrequencia}
                  aria-label={`${item.rotulo}: ${formatNumber(item.frequencia)} registros`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
        <span>Fonte: IBGE • Censo Demográfico</span>
        <span>Apenas registros nominais computados</span>
      </div>
    </div>
  );
}

