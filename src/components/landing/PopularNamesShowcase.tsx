import React from "react";
import { formatNumber } from "@/utils/formatters";
import { Icon } from "@/components/ui/Icon";

interface PopularNamesShowcaseProps {
  onSelectName: (name: string) => void;
  isLoading?: boolean;
}

// Dados oficiais extraídos diretamente do endpoint de ranking do IBGE
const TOP_IBGE_NAMES = [
  { ranking: 1, nome: "Maria", frequencia: 11734129, sexo: "Feminino" },
  { ranking: 2, nome: "José", frequencia: 5754529, sexo: "Masculino" },
  { ranking: 3, nome: "Ana", frequencia: 3089858, sexo: "Feminino" },
  { ranking: 4, nome: "João", frequencia: 2984119, sexo: "Masculino" },
  { ranking: 5, nome: "Antônio", frequencia: 2576348, sexo: "Masculino" },
  { ranking: 6, nome: "Francisco", frequencia: 1772197, sexo: "Masculino" },
  { ranking: 7, nome: "Carlos", frequencia: 1489191, sexo: "Masculino" },
  { ranking: 8, nome: "Paulo", frequencia: 1423262, sexo: "Masculino" },
  { ranking: 9, nome: "Pedro", frequencia: 1219605, sexo: "Masculino" },
  { ranking: 10, nome: "Lucas", frequencia: 1127310, sexo: "Masculino" },
  { ranking: 11, nome: "Luiz", frequencia: 1107792, sexo: "Masculino" },
  { ranking: 12, nome: "Marcos", frequencia: 1106165, sexo: "Masculino" },
];

export function PopularNamesShowcase({
  onSelectName,
  isLoading = false,
}: PopularNamesShowcaseProps) {
  return (
    <section
      id="populares"
      className="py-16 border-b scroll-mt-16 transition-colors duration-200"
      style={{
        backgroundColor: "var(--theme-surface-subtle)",
        borderColor: "var(--theme-surface-border)",
      }}
    >
      <div className="container-landing">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Icon name="sparkles" className="w-4 h-4 text-amber-600" />
            <span>Top Registros Históricos</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Os Nomes Mais Populares da História do Brasil
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Confira os líderes absolutos do ranking do IBGE. Clique em qualquer nome para ver seu histórico completo.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {TOP_IBGE_NAMES.map((item) => (
            <button
              key={item.nome}
              type="button"
              onClick={() => onSelectName(item.nome)}
              disabled={isLoading}
              className="card-2015 p-4 text-left hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600">
                  #{item.ranking} no Brasil
                </span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                  {item.sexo}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-700">
                {item.nome}
              </h3>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                {formatNumber(item.frequencia)} pessoas
              </p>
            </button>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="#pesquisa"
            className="btn-2015-secondary !text-xs !py-2.5 !px-5 inline-flex items-center gap-2"
          >
            <span>Deseja consultar outro nome? Voltar ao topo</span>
            <Icon name="arrow-right" className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

