"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { ProcessedNameData } from "@/types/ibge";

interface BrazilLeafletMapProps {
  data: ProcessedNameData;
}

// Skeleton elegante exibido durante a inicialização assíncrona do Leaflet no navegador
function MapLoadingSkeleton() {
  return (
    <div className="w-full h-[460px] sm:h-[520px] rounded-lg border border-slate-300 bg-slate-100 flex flex-col items-center justify-center p-6 text-center animate-pulse">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
      <span className="text-sm font-bold text-slate-700">
        Carregando mapa interativo do Brasil...
      </span>
      <span className="text-xs text-slate-500 mt-1">
        Inicializando camadas cartográficas oficiais do IBGE
      </span>
    </div>
  );
}

// Import dinâmico com ssr: false para segurança contra falhas de window do Leaflet
const BrazilLeafletMapInner = dynamic(
  () =>
    import("./BrazilLeafletMapInner").then((mod) => mod.BrazilLeafletMapInner),
  {
    ssr: false,
    loading: () => <MapLoadingSkeleton />,
  }
);

export function BrazilLeafletMap({ data }: BrazilLeafletMapProps) {
  return <BrazilLeafletMapInner data={data} />;
}

