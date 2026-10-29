"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import type { Layer, LeafletMouseEvent, PathOptions } from "leaflet";
import type { FeatureCollection, Feature, Geometry } from "geojson";
import type { ProcessedNameData, ProcessedUfItem } from "@/types/ibge";
import { UF_BY_CODE } from "@/config/brazilUFs";
import { formatNumber, formatPercent } from "@/utils/formatters";
import { Icon } from "@/components/ui/Icon";

interface BrazilLeafletMapInnerProps {
  data: ProcessedNameData;
}

type MapMetric = "frequencia" | "proporcao";

// Controlador de visualização e limites para o mapa
function MapViewHandler() {
  const map = useMap();
  useEffect(() => {
    // Garante renderização correta de tamanho após montagem
    map.invalidateSize();
  }, [map]);

  return null;
}

export function BrazilLeafletMapInner({ data }: BrazilLeafletMapInnerProps) {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [metric, setMetric] = useState<MapMetric>("proporcao");
  const [selectedUf, setSelectedUf] = useState<ProcessedUfItem | null>(null);
  const [loadingGeo, setLoadingGeo] = useState<boolean>(true);
  const mapRef = useRef<L.Map | null>(null);

  // Mapeamento rápido de UF por código IBGE
  const ufMap = useMemo(() => {
    const map = new Map<string, ProcessedUfItem>();
    data.distribuicaoUf.forEach((item) => {
      map.set(item.codigoIbge, item);
    });
    return map;
  }, [data.distribuicaoUf]);

  // Ranking ordenado para tooltips (1º lugar, 2º lugar, etc.)
  const rankings = useMemo(() => {
    const byFreq = [...data.distribuicaoUf].sort((a, b) => b.frequencia - a.frequencia);
    const byProp = [...data.distribuicaoUf].sort((a, b) => b.proporcao - a.proporcao);

    const freqRank = new Map<string, number>();
    byFreq.forEach((item, index) => freqRank.set(item.codigoIbge, index + 1));

    const propRank = new Map<string, number>();
    byProp.forEach((item, index) => propRank.set(item.codigoIbge, index + 1));

    return { freqRank, propRank };
  }, [data.distribuicaoUf]);

  // Valores máximos e mínimos para interpolação da escala coroplética
  const stats = useMemo(() => {
    let maxFreq = 0;
    let minFreq = Infinity;
    let maxProp = 0;
    let minProp = Infinity;

    data.distribuicaoUf.forEach((item) => {
      if (item.frequencia > maxFreq) maxFreq = item.frequencia;
      if (item.frequencia < minFreq) minFreq = item.frequencia;
      if (item.proporcao > maxProp) maxProp = item.proporcao;
      if (item.proporcao < minProp) minProp = item.proporcao;
    });

    return {
      maxFreq: maxFreq || 1,
      minFreq: minFreq === Infinity ? 0 : minFreq,
      maxProp: maxProp || 1,
      minProp: minProp === Infinity ? 0 : minProp,
    };
  }, [data.distribuicaoUf]);

  // Carrega GeoJSON local oficial dos 27 estados (98 KB)
  useEffect(() => {
    let isMounted = true;
    fetch("/data/brazil-states.json")
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao carregar malha dos estados");
        return res.json();
      })
      .then((json: FeatureCollection) => {
        if (isMounted) {
          setGeoData(json);
          setLoadingGeo(false);
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar GeoJSON:", err);
        if (isMounted) setLoadingGeo(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Paleta de cores para os níveis da escala (5 níveis visuais)
  // Métrica Frequência: Azul clássico a Índigo Profundo
  const freqColors = ["#dbeafe", "#93c5fd", "#3b82f6", "#1d4ed8", "#1e3a8a"];
  // Métrica Proporção: Esmeralda a Verde Escuro Profundo
  const propColors = ["#d1fae5", "#6ee7b7", "#10b981", "#047857", "#064e3b"];

  // Função para calcular cor de cada estado
  const getColor = (codarea: string): string => {
    const ufItem = ufMap.get(codarea);
    if (!ufItem) return "#94a3b8"; // Sem dados suficientes ou abaixo do sigilo (cinza neutro)

    const palette = metric === "frequencia" ? freqColors : propColors;
    const value = metric === "frequencia" ? ufItem.frequencia : ufItem.proporcao;
    const min = metric === "frequencia" ? stats.minFreq : stats.minProp;
    const max = metric === "frequencia" ? stats.maxFreq : stats.maxProp;

    if (max === min) return palette[2];

    const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
    const index = Math.min(palette.length - 1, Math.floor(ratio * palette.length));
    return palette[index];
  };

  // Estilização dos polígonos GeoJSON
  const styleFeature = (feature?: Feature<Geometry, { codarea: string }>): PathOptions => {
    const codarea = feature?.properties?.codarea || "";
    const hasData = ufMap.has(codarea);
    const isSelected = selectedUf?.codigoIbge === codarea;

    return {
      fillColor: getColor(codarea),
      weight: isSelected ? 3 : 1.2,
      opacity: 1,
      color: isSelected ? "#f59e0b" : "#ffffff",
      dashArray: hasData ? undefined : "3",
      fillOpacity: hasData ? (isSelected ? 0.95 : 0.78) : 0.25,
    };
  };

  // Eventos de interação (hover, click) em cada estado
  const onEachFeature = (
    feature: Feature<Geometry, { codarea: string }>,
    layer: Layer
  ) => {
    const codarea = feature.properties?.codarea || "";
    const configUf = UF_BY_CODE.get(codarea);
    const ufItem = ufMap.get(codarea);
    const estadoNome = configUf ? `${configUf.nome} (${configUf.sigla})` : `UF ${codarea}`;

    const rank =
      metric === "frequencia"
        ? rankings.freqRank.get(codarea)
        : rankings.propRank.get(codarea);

    // Conteúdo rico do Tooltip
    let tooltipContent = "";
    if (ufItem) {
      tooltipContent = `
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4; padding: 2px;">
          <div style="font-weight: 800; font-size: 13px; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <span>${estadoNome}</span>
            <span style="background: #2563eb; color: #fff; font-size: 10px; padding: 1px 6px; border-radius: 4px; font-weight: bold;">
              ${rank ? `${rank}º lugar` : ""}
            </span>
          </div>
          <div style="margin-bottom: 2px;">
            <strong>Ocorrências:</strong> ${formatNumber(ufItem.frequencia)} pessoas
          </div>
          <div style="margin-bottom: 2px;">
            <strong>% do Brasil:</strong> ${formatPercent(ufItem.percentualNacional)}
          </div>
          <div style="color: #047857; font-weight: 700;">
            <strong>Densidade:</strong> ${ufItem.proporcao.toFixed(1)} / 100k hab.
          </div>
        </div>
      `;
    } else {
      tooltipContent = `
        <div style="font-family: inherit; font-size: 12px; padding: 2px;">
          <div style="font-weight: bold; margin-bottom: 2px;">${estadoNome}</div>
          <div style="color: #64748b; font-size: 11px;">Abaixo do limiar de divulgação do IBGE (&lt;20 pessoas)</div>
        </div>
      `;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (layer as any).bindTooltip(tooltipContent, {
      sticky: true,
      className: "leaflet-custom-tooltip",
      direction: "auto",
    });

    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        const target = e.target;
        target.setStyle({
          weight: 3,
          color: "#f59e0b",
          fillOpacity: 0.95,
        });
        target.bringToFront();
      },
      mouseout: (e: LeafletMouseEvent) => {
        const target = e.target;
        const isCurrentSelected = selectedUf?.codigoIbge === codarea;
        target.setStyle({
          weight: isCurrentSelected ? 3 : 1.2,
          color: isCurrentSelected ? "#f59e0b" : "#ffffff",
          fillOpacity: ufItem ? (isCurrentSelected ? 0.95 : 0.78) : 0.25,
        });
      },
      click: () => {
        if (ufItem) {
          setSelectedUf(ufItem);
        }
      },
    });
  };

  const resetView = () => {
    if (mapRef.current) {
      mapRef.current.setView([-14.235, -51.9253], 4);
    }
    setSelectedUf(null);
  };

  return (
    <div className="space-y-4">
      {/* Barra de Controles e Alternância de Métrica */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border bg-slate-50/80">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider block text-slate-500 mb-1">
            Modo de Visualização do Mapa
          </span>
          <div className="inline-flex rounded-md shadow-xs" role="group">
            <button
              type="button"
              onClick={() => setMetric("proporcao")}
              className={`px-3 py-1.5 text-xs font-bold rounded-l border cursor-pointer transition-colors ${
                metric === "proporcao"
                  ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border-slate-300"
              }`}
            >
              Proporção por 100k hab. (Densidade)
            </button>
            <button
              type="button"
              onClick={() => setMetric("frequencia")}
              className={`px-3 py-1.5 text-xs font-bold rounded-r border-t border-b border-r cursor-pointer transition-colors ${
                metric === "frequencia"
                  ? "bg-blue-600 text-white border-blue-700 shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border-slate-300"
              }`}
            >
              Frequência Absoluta (Total de Pessoas)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={resetView}
            className="btn-2015-secondary !text-xs !py-1.5 !px-3 flex items-center gap-1.5"
            title="Recentralizar mapa no Brasil"
          >
            <Icon name="search" className="w-3.5 h-3.5" />
            <span>Centralizar Brasil</span>
          </button>
        </div>
      </div>

      {/* Container do Mapa Leaflet */}
      <div className="relative w-full h-[460px] sm:h-[520px] rounded-lg overflow-hidden border border-slate-300 shadow-inner bg-slate-100">
        {loadingGeo && (
          <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs">
            <div className="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full mb-2" />
            <span className="text-xs font-bold text-slate-600">
              Carregando mapa interativo do Brasil...
            </span>
          </div>
        )}

        <MapContainer
          ref={(instance) => {
            if (instance) mapRef.current = instance;
          }}
          center={[-14.235, -51.9253]}
          zoom={4}
          minZoom={3}
          maxZoom={8}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <MapViewHandler />

          {/* Camada Base: CartoDB Voyager com estilo limpo e sem poluição */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={19}
          />

          {/* Camada Coroplética com Polígonos dos 27 Estados */}
          {geoData && (
            <GeoJSON
              key={`${metric}-${data.nome}`}
              data={geoData}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              style={styleFeature as any}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onEachFeature={onEachFeature as any}
            />
          )}
        </MapContainer>

        {/* Legenda Dinâmica Flutuante sobre o mapa */}
        <div className="absolute bottom-4 left-4 z-[500] bg-white/95 backdrop-blur-xs p-3 rounded-lg border border-slate-300 shadow-md max-w-xs text-xs">
          <div className="font-bold text-slate-800 mb-1.5">
            {metric === "frequencia"
              ? "Ocorrências Registradas"
              : "Densidade por 100k hab."}
          </div>
          <div className="flex items-center gap-1 mb-1">
            <div
              className="h-3 w-6 rounded-xs"
              style={{
                backgroundColor:
                  metric === "frequencia" ? freqColors[0] : propColors[0],
              }}
            />
            <div
              className="h-3 w-6 rounded-xs"
              style={{
                backgroundColor:
                  metric === "frequencia" ? freqColors[1] : propColors[1],
              }}
            />
            <div
              className="h-3 w-6 rounded-xs"
              style={{
                backgroundColor:
                  metric === "frequencia" ? freqColors[2] : propColors[2],
              }}
            />
            <div
              className="h-3 w-6 rounded-xs"
              style={{
                backgroundColor:
                  metric === "frequencia" ? freqColors[3] : propColors[3],
              }}
            />
            <div
              className="h-3 w-6 rounded-xs"
              style={{
                backgroundColor:
                  metric === "frequencia" ? freqColors[4] : propColors[4],
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-600 font-medium">
            <span>
              {metric === "frequencia"
                ? formatNumber(stats.minFreq)
                : stats.minProp.toFixed(1)}
            </span>
            <span>
              {metric === "frequencia"
                ? formatNumber(stats.maxFreq)
                : stats.maxProp.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-500">
            <span className="inline-block w-2.5 h-2.5 rounded-xs bg-slate-300 border border-dashed border-slate-400" />
            <span>Sem registro suficiente (&lt;20 casos)</span>
          </div>
        </div>

        {/* Dica de interação flutuante no topo do mapa */}
        <div className="absolute top-3 right-3 z-[500] hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 text-white text-[11px] font-medium backdrop-blur-xs">
          <span>Passe o mouse ou clique em um estado para ver detalhes</span>
        </div>
      </div>

      {/* Cartão de Detalhes do Estado Selecionado ao Clicar */}
      {selectedUf && (
        <div className="p-4 rounded-lg border border-blue-200 bg-blue-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-xs">
                {selectedUf.sigla}
              </span>
              <h4 className="font-bold text-slate-900 text-sm">
                {selectedUf.nome} — Região {selectedUf.regiao}
              </h4>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              População censitária: <strong>{formatNumber(selectedUf.populacao)}</strong> habitantes
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <div className="text-slate-500 text-[11px]">Total de Pessoas</div>
              <div className="font-black text-slate-900 text-base">
                {formatNumber(selectedUf.frequencia)}
              </div>
            </div>
            <div className="text-right border-l pl-4 border-slate-300">
              <div className="text-slate-500 text-[11px]">% do Total Nacional</div>
              <div className="font-black text-blue-700 text-base">
                {formatPercent(selectedUf.percentualNacional)}
              </div>
            </div>
            <div className="text-right border-l pl-4 border-slate-300">
              <div className="text-slate-500 text-[11px]">Por 100k hab.</div>
              <div className="font-black text-emerald-700 text-base">
                {selectedUf.proporcao.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

