"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Header } from "@/components/header/Header";
import { HeroSection } from "@/components/hero/HeroSection";
import { SearchStatus } from "@/components/search/SearchStatus";
import { NameResultHeader } from "@/components/results/NameResultHeader";
import { RarityIndicator } from "@/components/results/RarityIndicator";
import { DecadeDistributionChart } from "@/components/results/DecadeDistributionChart";
import { GeographicDistribution } from "@/components/results/GeographicDistribution";
import { StatisticsGrid } from "@/components/results/StatisticsGrid";
import { ShareResult } from "@/components/share/ShareResult";
import { NameComparison } from "@/components/compare/NameComparison";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PopularNamesShowcase } from "@/components/landing/PopularNamesShowcase";
import { DataSourceSection } from "@/components/landing/DataSourceSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CallToAction } from "@/components/landing/CallToAction";
import { Footer } from "@/components/footer/Footer";
import { AdBanner } from "@/components/ads/AdBanner";

import { fetchNameData } from "@/services/ibgeApi";
import { ProcessedNameData } from "@/types/ibge";
import { validateAndNormalizeName } from "@/utils/normalization";

interface MainAppClientProps {
  initialName?: string;
  initialData?: ProcessedNameData | null;
}

export function MainAppClient({
  initialName = "",
  initialData = null,
}: MainAppClientProps) {
  const [currentName, setCurrentName] = useState(initialName);
  const currentNameRef = useRef(initialName);
  const [resultData, setResultData] = useState<ProcessedNameData | null>(initialData);

  useEffect(() => {
    currentNameRef.current = currentName;
  }, [currentName]);
  const [searchStatus, setSearchStatus] = useState<"idle" | "loading" | "success" | "not_found" | "error">(
    initialData ? "success" : "idle"
  );
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [warningMessage, setWarningMessage] = useState<string | undefined>();

  const resultsRef = useRef<HTMLDivElement>(null);

  const executeSearch = useCallback(async (nameToSearch: string, updateUrl: boolean = true) => {
    const validation = validateAndNormalizeName(nameToSearch);

    if (!validation.isValid) {
      setSearchStatus("error");
      setErrorMessage(validation.errorMessage);
      return;
    }

    const cleanName = validation.firstNameOnly;
    setCurrentName(cleanName);
    setSearchStatus("loading");
    setErrorMessage(undefined);
    setWarningMessage(undefined);

    // Atualiza a URL sem recarregar a página
    if (updateUrl && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("nome", cleanName);
      window.history.pushState({}, "", url.toString());
    }

    const res = await fetchNameData(cleanName);

    if (res.status === "success" && res.data) {
      setResultData(res.data);
      setSearchStatus("success");
      setWarningMessage(res.warningMessage);

      // Rola suavemente até os resultados
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else if (res.status === "not_found") {
      setResultData(null);
      setSearchStatus("not_found");
      setWarningMessage(res.warningMessage);
    } else {
      setResultData(null);
      setSearchStatus("error");
      setErrorMessage(res.errorMessage || "Não foi possível carregar os dados.");
    }
  }, []);

  // Sincroniza consultas via histórico de navegação (popstate) apenas quando o nome consultado realmente mudar
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const queryName = params.get("nome");
      if (
        queryName &&
        queryName.trim().toLowerCase() !== currentNameRef.current.trim().toLowerCase()
      ) {
        void executeSearch(queryName, false);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [executeSearch]);

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-200"
      style={{ backgroundColor: "var(--theme-bg)", color: "var(--theme-text)" }}
    >
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onSearch={(name) => executeSearch(name, true)}
          isLoading={searchStatus === "loading"}
        />

        {/* Área de Resultados ou Estados de Busca */}
        <div ref={resultsRef} className="container-landing py-8">
          {/* Banner Publicitário Superior (Leaderboard) */}
          <AdBanner slot="leaderboard" />

          <SearchStatus
            status={searchStatus}
            searchName={currentName}
            errorMessage={errorMessage}
            warningMessage={warningMessage}
            onRetry={() => executeSearch(currentName, false)}
          />

          {searchStatus === "success" && resultData && (
            <div className="space-y-6 animate-fadeIn">
              {/* Cabeçalho do Resultado */}
              <NameResultHeader data={resultData} />

              {/* Indicador e Classificação de Raridade */}
              <RarityIndicator data={resultData} />

              {/* Métricas e Curiosidades */}
              <StatisticsGrid data={resultData} />

              {/* Gráfico de Evolução Histórica */}
              <DecadeDistributionChart data={resultData} />

              {/* Anúncio Patrocinado no Fluxo de Resultados */}
              <AdBanner slot="in-content" />

              {/* Distribuição por Estados */}
              <GeographicDistribution data={resultData} />

              {/* Compartilhamento e Download de Cartão */}
              <ShareResult data={resultData} />
            </div>
          )}
        </div>

        {/* Comparador de Nomes */}
        <NameComparison
          initialName1={resultData ? resultData.nomeFormatado : ""}
          initialName2=""
        />

        {/* Como Funciona */}
        <HowItWorks />

        {/* Nomes Mais Populares do Censo */}
        <PopularNamesShowcase
          onSelectName={(name) => executeSearch(name, true)}
          isLoading={searchStatus === "loading"}
        />

        {/* Fonte dos Dados e Metodologia Oficial */}
        <DataSourceSection />

        {/* Perguntas Frequentes (FAQ) */}
        <FAQSection />

        {/* Chamada para Ação */}
        <CallToAction
          onSearchTop={() => {
            const input = document.getElementById("search-name-input");
            input?.focus();
            input?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </main>

      <Footer />

      {/* Banner Fixo no Rodapé (Anchor Ad) */}
      <AdBanner slot="anchor-footer" />
    </div>
  );
}
