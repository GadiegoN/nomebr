import React from "react";
import { BRAND_CONFIG } from "@/config/brand";
import { Icon } from "@/components/ui/Icon";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-8">
      <div className="container-landing">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Coluna 1: Marca */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-extrabold text-lg">
              <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white">
                <Icon name="sparkles" className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <span>{BRAND_CONFIG.name}</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Plataforma pública e independente de exploração e visualização de dados demográficos de nomes no Brasil com base nas estatísticas oficiais do IBGE.
            </p>
            <p className="text-slate-500 text-[11px]">
              Não possui vínculo governamental direto. Todos os dados são públicos e de livre consulta sob a licença de dados abertos do Governo Federal.
            </p>
          </div>

          {/* Coluna 2: Navegação */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-3">
              Navegação
            </h4>
            <ul className="space-y-2">
              {BRAND_CONFIG.navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Fonte Oficial */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-3">
              Fonte Oficial
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={BRAND_CONFIG.censusReference.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>API Nomes do IBGE</span>
                  <Icon name="external-link" className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.ibge.gov.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Portal Oficial do IBGE</span>
                  <Icon name="external-link" className="w-3 h-3" />
                </a>
              </li>
              <li>
                <span className="text-slate-500 block pt-1">
                  Censo Demográfico (Série Histórica)
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {BRAND_CONFIG.year} {BRAND_CONFIG.name}. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4">
            <span>Privacidade 100% no navegador (sem rastreamento)</span>
            <span>•</span>
            <span>Feito para a comunidade brasileira</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
