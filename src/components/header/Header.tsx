"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BRAND_CONFIG } from "@/config/brand";
import { Icon } from "@/components/ui/Icon";
import { ThemeSelector } from "@/components/theme/ThemeSelector";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      const targetId = href.slice(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        if (targetId === "pesquisa") {
          const input = document.getElementById("search-name-input");
          input?.focus();
        }
        // Atualiza a URL para o hash específico sem recarregar
        window.history.pushState(null, "", href);
      }
    }
  };

  const handleMobileNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setIsMobileMenuOpen(false);
    handleNavClick(e, href);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-sm">
      <div className="container-landing flex items-center justify-between h-16">
        {/* Logo / Marca */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-white hover:text-amber-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
        >
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white shadow-inner">
            <Icon name="sparkles" className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight">
              {BRAND_CONFIG.name}
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
              Dados Oficiais IBGE
            </span>
          </div>
        </Link>

        {/* Navegação Desktop */}
        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-300"
        >
          {BRAND_CONFIG.navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="hover:text-white transition-colors py-1 hover:border-b-2 hover:border-amber-400"
            >
              {link.label}
            </a>
          ))}

          <ThemeSelector />

          <a
            href="#pesquisa"
            onClick={(e) => handleNavClick(e, "#pesquisa")}
            className="btn-2015-primary text-xs uppercase tracking-wider !py-2 !px-4"
          >
            Consultar Nome
          </a>
        </nav>

        {/* Lado Direito Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeSelector />

          {/* Botão Menu Mobile */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu de navegação"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {BRAND_CONFIG.navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleMobileNavClick(e, link.href)}
              className="block px-3 py-2 rounded text-base font-medium text-slate-200 hover:bg-slate-800 hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2">
            <a
              href="#pesquisa"
              onClick={(e) => handleMobileNavClick(e, "#pesquisa")}
              className="btn-2015-primary w-full text-center text-sm"
            >
              Consultar Meu Nome
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

