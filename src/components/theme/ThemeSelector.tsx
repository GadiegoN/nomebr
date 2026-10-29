"use client";

import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { THEMES, DEFAULT_THEME_ID, ThemeDefinition } from "@/config/themes";

const STORAGE_KEY = "nomeraro-active-theme";

function subscribeToThemeChange(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("theme-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("theme-change", callback);
    window.removeEventListener("storage", callback);
  };
}

function getThemeSnapshot(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && THEMES.some((t) => t.id === saved)) {
      return saved;
    }
  } catch {
    // Ignora
  }
  return DEFAULT_THEME_ID;
}

function getServerThemeSnapshot(): string {
  return DEFAULT_THEME_ID;
}

export function ThemeSelector() {
  const activeThemeId = useSyncExternalStore(
    subscribeToThemeChange,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown se clicar fora ou pressionar Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelectTheme = (theme: ThemeDefinition) => {
    setIsOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, theme.id);
      document.documentElement.setAttribute("data-theme", theme.id);
      window.dispatchEvent(new Event("theme-change"));
    } catch {
      // Ignora
    }
  };

  const currentTheme = THEMES.find((t) => t.id === activeThemeId) || THEMES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer shadow-sm"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Tema visual ativo: ${currentTheme.name}. Clique para mudar de tema.`}
        title="Personalizar tema da aplicação (Anos 80, 90, 2000, Dark, etc.)"
      >
        <span className="flex items-center gap-1">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block border border-black/20"
            style={{ backgroundColor: currentTheme.previewColors[0] }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full inline-block border border-black/20"
            style={{ backgroundColor: currentTheme.previewColors[1] }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full inline-block border border-black/20"
            style={{ backgroundColor: currentTheme.previewColors[2] }}
          />
        </span>
        <span className="hidden sm:inline-block max-w-[120px] truncate">
          {currentTheme.name}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown de Temas */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-72 rounded-lg bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-fadeIn text-left"
        >
          <div className="px-3 py-2 border-b border-slate-800 mb-1 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Escolha a Década ou Estilo
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 font-semibold border border-blue-800">
              {THEMES.length} Temas
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {THEMES.map((theme) => {
              const isSelected = theme.id === activeThemeId;
              return (
                <button
                  key={theme.id}
                  type="button"
                  role="menuitem"
                  onClick={() => handleSelectTheme(theme)}
                  className={`w-full flex items-center justify-between p-2 rounded text-xs transition-colors cursor-pointer text-left ${
                    isSelected
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <div className="space-y-0.5 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-xs">{theme.name}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                          isSelected
                            ? "bg-blue-800 text-blue-100"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {theme.decade}
                      </span>
                    </div>
                    <p
                      className={`text-[10px] leading-snug line-clamp-1 ${
                        isSelected ? "text-blue-100" : "text-slate-400"
                      }`}
                    >
                      {theme.description}
                    </p>
                  </div>

                  {/* Amostra visual de cores da paleta */}
                  <div className="flex items-center gap-1 shrink-0 p-1 rounded bg-black/30 border border-white/10">
                    <span
                      className="w-3 h-3 rounded-full shadow-inner"
                      style={{ backgroundColor: theme.previewColors[0] }}
                    />
                    <span
                      className="w-3 h-3 rounded-full shadow-inner"
                      style={{ backgroundColor: theme.previewColors[1] }}
                    />
                    <span
                      className="w-3 h-3 rounded-full shadow-inner"
                      style={{ backgroundColor: theme.previewColors[2] }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

