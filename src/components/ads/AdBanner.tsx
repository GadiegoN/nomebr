"use client";

import React, { useState } from "react";
import { Icon } from "@/components/ui/Icon";

export type AdSlot = "leaderboard" | "in-content" | "anchor-footer";

interface AdBannerProps {
  slot: AdSlot;
  className?: string;
}

export function AdBanner({ slot, className = "" }: AdBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  // Link oficial de download/divulgação do Antigravity
  const adUrl = "https://antigravity.google";

  if (isDismissed) return null;

  // 1. BANNER FIXO NO RODAPÉ (ANCHOR / STICKY FOOTER)
  if (slot === "anchor-footer") {
    return (
      <aside
        aria-label="Anúncio patrocinado"
        className={`fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-700 shadow-2xl transition-all duration-300 ${className}`}
      >
        <div className="container-landing py-2.5 px-4 flex items-center justify-between gap-3">
          {/* Lado Esquerdo: Tag e Mensagem */}
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="shrink-0 text-[10px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Anúncio
            </span>
            <div className="flex items-center gap-2 truncate">
              <div className="w-6 h-6 rounded bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shrink-0 shadow-xs">
                <Icon name="sparkles" className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <span className="text-xs sm:text-sm font-semibold truncate text-slate-100">
                <strong className="text-white">Google Antigravity:</strong> A IDE de IA da nova geração com agentes autônomos.
              </span>
            </div>
          </div>

          {/* Lado Direito: Ações */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={adUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="btn-2015-primary !py-1.5 !px-3 !text-xs flex items-center gap-1.5 shadow-sm"
              title="Baixar o Google Antigravity gratuitamente"
            >
              <Icon name="download" className="w-3.5 h-3.5" />
              <span>Baixar Grátis</span>
            </a>
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Fechar anúncio"
              title="Fechar anúncio"
            >
              <span className="text-lg leading-none font-bold block px-1">&times;</span>
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // 2. BANNER HORIZONTAL TOPO/MEIO (LEADERBOARD / 728x90)
  if (slot === "leaderboard") {
    return (
      <aside
        aria-label="Anúncio patrocinado"
        className={`w-full max-w-4xl mx-auto my-6 p-3 sm:p-4 rounded-lg border border-slate-300/80 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white shadow-md relative overflow-hidden ${className}`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Informações do Anúncio */}
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center shrink-0 shadow-inner">
              <Icon name="sparkles" className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-mono">
                  Patrocinado
                </span>
                <span className="text-xs font-bold text-blue-300">Google Antigravity</span>
              </div>
              <h4 className="text-sm sm:text-base font-black tracking-tight text-white">
                Construa software 10x mais rápido com a IDE orientada por IA
              </h4>
              <p className="text-xs text-slate-300 hidden md:block">
                Pareamento de código avançado, execução de comandos e arquitetura multi-agentes.
              </p>
            </div>
          </div>

          {/* Botão de Download */}
          <div className="shrink-0 w-full sm:w-auto">
            <a
              href={adUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="btn-2015-primary w-full sm:w-auto !py-2 !px-5 !text-sm flex items-center justify-center gap-2 !bg-amber-500 hover:!bg-amber-400 !text-slate-950 !border-amber-600 font-black shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <Icon name="download" className="w-4 h-4 text-slate-950" />
              <span>Baixar Antigravity</span>
            </a>
          </div>
        </div>
      </aside>
    );
  }

  // 3. CARTÃO DE ANÚNCIO NO FLUXO DE CONTEÚDO (IN-CONTENT RECTANGLE / FEED)
  return (
    <aside
      aria-label="Anúncio patrocinado"
      className={`card-2015 p-5 my-6 border-2 border-dashed border-amber-500/40 bg-gradient-to-br from-amber-500/5 via-transparent to-blue-500/5 ${className}`}
    >
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
            Publicidade
          </span>
          <span className="text-xs font-bold text-slate-500">Recomendado para Você</span>
        </div>
        <span className="text-[11px] text-slate-400">Google Antigravity IDE</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center shrink-0 shadow-md">
          <Icon name="sparkles" className="w-8 h-8 text-amber-300" />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h4 className="text-base font-bold text-slate-900">
            Gostou de como este site foi construído? Baixe o Google Antigravity!
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            O Antigravity é o ambiente de desenvolvimento completo projetado para trabalhar em dupla com agentes autônomos. Código limpo, testes automáticos e velocidade máxima.
          </p>
        </div>

        <div className="shrink-0 w-full sm:w-auto">
          <a
            href={adUrl}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="btn-2015-primary w-full sm:w-auto !py-2.5 !px-5 !text-sm flex items-center justify-center gap-2 shadow-sm font-bold"
          >
            <Icon name="download" className="w-4 h-4" />
            <span>Download Grátis</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
