import React from "react";
import { Icon } from "@/components/ui/Icon";
import { BRAND_CONFIG } from "@/config/brand";

export function DataSourceSection() {
  return (
    <section
      id="fonte"
      className="py-16 border-b scroll-mt-16 transition-colors duration-200"
      style={{
        backgroundColor: "var(--theme-surface-card)",
        borderColor: "var(--theme-surface-border)",
      }}
    >
      <div className="container-landing">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-200">
              <Icon name="database" className="w-4 h-4 text-blue-600" />
              <span>Transparência e Integridade</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Fonte dos Dados e Critérios do IBGE
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Todas as informações exibidas nesta plataforma são obtidas diretamente do Serviço de Dados do IBGE.
            </p>
          </div>

          <div className="card-2015 p-6 sm:p-8 space-y-6 bg-slate-50 border-slate-300">
            {/* Bloco 1 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold">
                1
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Ano de Referência e Base Censitária
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Os dados nominais são oriundos do levantamento onomástico oficial do <strong>Censo Demográfico do IBGE</strong>. Trata-se do maior e mais detalhado estudo nominal já conduzido no país, com a computação de mais de 130 mil nomes distintos e 190,7 milhões de pessoas.
                </p>
              </div>
            </div>

            {/* Bloco 2 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold">
                2
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Critério de Sigilo Estatístico (Mínimo de 20 Ocorrências)
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Em cumprimento à Lei Federal nº 5.534/1968 sobre sigilo estatístico, o IBGE apenas divulga nomes cuja frequência seja de no mínimo <strong>20 ocorrências em todo o Brasil</strong>. Nomes com menos de 20 pessoas não são expostos na API para resguardar a privacidade individual.
                </p>
              </div>
            </div>

            {/* Bloco 3 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold">
                3
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Regra de Prenomes (Nomes Compostos)
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  O IBGE registra apenas o <strong>primeiro nome (prenome)</strong> de cada indivíduo. Nomes compostos (como &ldquo;João Pedro&rdquo; ou &ldquo;Maria Eduarda&rdquo;) são apurados em seus respectivos prenomes individuais (&ldquo;João&rdquo; e &ldquo;Maria&rdquo;).
                </p>
              </div>
            </div>

            {/* Bloco 4 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold">
                4
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  O que os dados NÃO representam
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  A frequência histórica aponta quantas pessoas nasceram e foram registradas com aquele nome ao longo das décadas. Não representa o número exato de pessoas vivas atualmente, visto que não desconta a mortalidade natural nem inclui bebês nascidos após o período apurado.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <span>Documentação técnica da API: <code>api/v2/censos/nomes</code></span>
              <a
                href={BRAND_CONFIG.censusReference.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1.5"
              >
                <span>Acessar Portal de Dados Oficiais do IBGE</span>
                <Icon name="external-link" className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

