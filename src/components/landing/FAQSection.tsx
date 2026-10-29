"use client";

import React, { useState } from "react";
import { Icon } from "@/components/ui/Icon";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "De onde vêm os dados de frequência dos nomes?",
    answer:
      "Todos os dados são consumidos diretamente da API pública oficial do IBGE (Instituto Brasileiro de Geografia e Estatística), vinculada ao projeto Nomes no Brasil do Censo Demográfico. Não utilizamos fontes não oficiais nem bancos de dados privados.",
  },
  {
    question: "Por que meu nome não retornou nenhum resultado?",
    answer:
      "Por exigência legal de proteção e sigilo estatístico (Lei nº 5.534/1968), o IBGE não publica nomes com menos de 20 ocorrências em todo o país. Se o seu nome não foi encontrado, é provável que seja extremamente raro ou que possua uma grafia com variação não computada.",
  },
  {
    question: "Consigo pesquisar nomes compostos (ex: Maria Clara)?",
    answer:
      "Não diretamente. Na metodologia oficial do Censo, o IBGE computa apenas o primeiro nome (prenome) dos informantes. Portanto, se você se chama 'Ana Luísa', o IBGE registra você na contagem do prenome 'Ana'. Recomendamos pesquisar cada nome separadamente.",
  },
  {
    question: "O número de ocorrências representa as pessoas vivas hoje?",
    answer:
      "Não. A frequência estatística divulgada pelo IBGE representa a quantidade de cidadãos recenseados que receberam aquele nome, organizada por sua década de nascimento. Como a série histórica começa antes de 1930, parte dos indivíduos registrados nas primeiras décadas já é falecida, e nascimentos recentes não constam nesse recorte histórico.",
  },
  {
    question: "Como é calculada a raridade do nome?",
    answer:
      "Nossa classificação baseia-se em faixas estatísticas objetivas sobre o universo total apurado pelo IBGE (190,7 milhões de brasileiros): Hiperpopular (> 400.000 pessoas), Tradicional/Comum (80.000 a 400.000), Moderado (15.000 a 80.000), Incomum (1.000 a 15.000), Raro (100 a 1.000) e Ultra Raro (< 100 registros divulgados).",
  },
  {
    question: "Como funciona a distribuição por estados (UF)?",
    answer:
      "A API do IBGE fornece a contagem de registros por Unidade da Federação e a taxa proporcional por 100.000 habitantes. Isso permite identificar tanto onde o nome tem mais pessoas em números absolutos (geralmente estados populosos como SP, MG e RJ) quanto onde ele é mais denso proporcionalmente à população local.",
  },
  {
    question: "Meus dados ou consultas são salvos em algum servidor?",
    answer:
      "Não. A aplicação é executada inteiramente no seu navegador, sem banco de dados, sem login e sem rastreamento de nomes pesquisados. As requisições são feitas de forma anônima e aberta diretamente aos servidores públicos do IBGE.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-16 border-b scroll-mt-16 transition-colors duration-200"
      style={{
        backgroundColor: "var(--theme-surface-subtle)",
        borderColor: "var(--theme-surface-border)",
      }}
    >
      <div className="container-landing">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Icon name="info" className="w-4 h-4 text-blue-600" />
            <span>Tire suas Dúvidas</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Perguntas Frequentes
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Entenda como os dados são processados e como interpretar suas estatísticas.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="card-2015 overflow-hidden transition-all bg-white"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-slate-900 hover:text-blue-600 flex items-center justify-between gap-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <span className="text-sm sm:text-base">{faq.question}</span>
                  <span
                    className={`transform transition-transform text-slate-400 font-bold shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  >
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

