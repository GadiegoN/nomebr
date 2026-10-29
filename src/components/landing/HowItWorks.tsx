import React from "react";
import { Icon } from "@/components/ui/Icon";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Digite seu prenome",
      description:
        "Insira seu primeiro nome no campo de busca. O sistema normaliza acentuações e caracteres para o padrão dos censos nacionais.",
      icon: "search" as const,
    },
    {
      number: "02",
      title: "Cruzamento com o IBGE",
      description:
        "Consultamos instantaneamente a base oficial de nomes do Instituto Brasileiro de Geografia e Estatística (IBGE), sem intermediários.",
      icon: "database" as const,
    },
    {
      number: "03",
      title: "Análise de Raridade e Época",
      description:
        "Descubra se seu nome é ultra raro ou comum, qual década registrou o maior pico de bebês com seu nome e onde ele se concentra.",
      icon: "chart-bar" as const,
    },
    {
      number: "04",
      title: "Cartão e Compartilhamento",
      description:
        "Gere imagens em alta definição direto no seu navegador para postar nos Stories do Instagram, WhatsApp ou enviar para quem tem o mesmo nome.",
      icon: "share" as const,
    },
  ];

  return (
    <section
      id="como-funciona"
      className="py-16 border-b scroll-mt-16 transition-colors duration-200"
      style={{
        backgroundColor: "var(--theme-surface-card)",
        borderColor: "var(--theme-surface-border)",
      }}
    >
      <div className="container-landing">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded">
            Metodologia Transparente
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Como Funciona o Nome Raro?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Transformamos estatísticas públicas em uma experiência simples, rápida e rica em detalhes históricos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="card-2015 p-6 relative hover:border-blue-400 transition-colors"
            >
              <div className="text-4xl font-black opacity-20 mb-3 select-none">
                {step.number}
              </div>
              <div className="w-10 h-10 rounded bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-4">
                <Icon name={step.icon} className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {step.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

