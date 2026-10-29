import React from "react";
import { ProcessedNameData } from "@/types/ibge";
import { classifyRarity } from "@/utils/rarityCalculator";
import { Icon } from "@/components/ui/Icon";

interface RarityIndicatorProps {
  data: ProcessedNameData;
}

export function RarityIndicator({ data }: RarityIndicatorProps) {
  const rarity = classifyRarity(data.totalNacional);

  // Escala de níveis
  const levels = [
    { key: "ultra-raro", label: "Ultra Raro", range: "< 100" },
    { key: "raro", label: "Raro", range: "100 a 1k" },
    { key: "incomum", label: "Incomum", range: "1k a 15k" },
    { key: "moderado", label: "Moderado", range: "15k a 80k" },
    { key: "comum", label: "Comum", range: "80k a 400k" },
    { key: "hiperpopular", label: "Hiperpopular", range: "> 400k" },
  ];

  return (
    <div className="card-2015 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="scale" className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold text-slate-900">
          Escala Estatística de Raridade
        </h3>
      </div>

      {/* Régua visual de raridade */}
      <div className="space-y-2 mb-6">
        <div className="grid grid-cols-6 gap-1 h-3 rounded overflow-hidden bg-slate-200">
          <div
            className={`h-full ${
              rarity.level === "ultra-raro" ? "bg-purple-600 ring-2 ring-purple-400" : "bg-purple-300"
            }`}
          />
          <div
            className={`h-full ${
              rarity.level === "raro" ? "bg-indigo-600 ring-2 ring-indigo-400" : "bg-indigo-300"
            }`}
          />
          <div
            className={`h-full ${
              rarity.level === "incomum" ? "bg-blue-600 ring-2 ring-blue-400" : "bg-blue-300"
            }`}
          />
          <div
            className={`h-full ${
              rarity.level === "moderado" ? "bg-amber-500 ring-2 ring-amber-400" : "bg-amber-300"
            }`}
          />
          <div
            className={`h-full ${
              rarity.level === "comum" ? "bg-emerald-600 ring-2 ring-emerald-400" : "bg-emerald-300"
            }`}
          />
          <div
            className={`h-full ${
              rarity.level === "hiperpopular" ? "bg-yellow-500 ring-2 ring-yellow-400" : "bg-yellow-300"
            }`}
          />
        </div>

        {/* Rótulos dos níveis */}
        <div className="grid grid-cols-6 gap-1 text-[11px] text-center font-medium text-slate-600">
          {levels.map((lvl) => (
            <div
              key={lvl.key}
              className={`p-1 rounded transition-colors ${
                rarity.level === lvl.key
                  ? "bg-blue-600 text-white font-bold shadow-sm"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              <div className="truncate">{lvl.label}</div>
              <div className="text-[10px] opacity-75 hidden sm:block">
                {lvl.range}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explicação detalhada */}
      <div className="bg-slate-50 border border-slate-200 rounded p-4 text-sm space-y-2">
        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
          <Icon name="info" className="w-4 h-4 text-blue-600" />
          <span>Interpretação Oficial dos Dados:</span>
        </div>
        <p className="text-slate-700 leading-relaxed">{rarity.descricao}</p>
        <p className="text-xs text-slate-500 border-t border-slate-200 pt-2">
          <strong>Critério metodológico:</strong> {rarity.detalheMetodologico} A população total de referência utilizada é de 190.755.799 pessoas recenseadas pelo IBGE no Censo Demográfico.
        </p>
      </div>
    </div>
  );
}

