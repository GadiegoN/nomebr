import React from "react";
import { NameSearchForm } from "@/components/search/NameSearchForm";
import { SearchSuggestions } from "@/components/search/SearchSuggestions";
import { Icon } from "@/components/ui/Icon";

interface HeroSectionProps {
  onSearch: (name: string) => void;
  isLoading?: boolean;
}

export function HeroSection({ onSearch, isLoading = false }: HeroSectionProps) {
  return (
    <section className="hero-jumbotron pt-14 pb-16 md:pt-20 md:pb-24">
      <div className="container-landing text-center">
        {/* Selo oficial de 2015 */}
        <div className="inline-flex items-center gap-2 bg-blue-900/60 border border-blue-700/60 text-blue-200 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 shadow-sm">
          <Icon name="database" className="w-4 h-4 text-amber-400" />
          <span>Base Oficial de Dados Demográficos do IBGE</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight md:leading-none mb-6">
          Quão raro é o seu nome no{" "}
          <span className="text-amber-400 underline decoration-amber-400/40 decoration-4 underline-offset-8">
            Brasil?
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Descubra quantas pessoas compartilham seu nome, em quais décadas ele esteve no auge e em quais estados é mais popular.
        </p>

        {/* Formulário de Busca */}
        <div className="mb-4 scroll-mt-24" id="pesquisa">
          <NameSearchForm onSearch={onSearch} isLoading={isLoading} size="lg" />
        </div>

        {/* Sugestões de nomes */}
        <SearchSuggestions onSelectName={onSearch} isLoading={isLoading} />

        {/* Destaques de confiança (Trust Badges de 2015) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-12 pt-8 border-t border-slate-700/60 text-slate-300 text-xs text-left sm:text-center">
          <div className="flex items-center gap-2 sm:justify-center">
            <Icon name="check" className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Dados 100% Oficiais</span>
          </div>
          <div className="flex items-center gap-2 sm:justify-center">
            <Icon name="check" className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>190M+ Habitantes</span>
          </div>
          <div className="flex items-center gap-2 sm:justify-center">
            <Icon name="check" className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>27 Estados Brasileiros</span>
          </div>
          <div className="flex items-center gap-2 sm:justify-center">
            <Icon name="check" className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Gratuito e Aberto</span>
          </div>
        </div>
      </div>
    </section>
  );
}
