"use client";

import React, { useState, useSyncExternalStore } from "react";
import { ProcessedNameData } from "@/types/ibge";
import { classifyRarity } from "@/utils/rarityCalculator";
import { formatNumber } from "@/utils/formatters";
import { generateResultCardImage, CardFormat } from "@/utils/canvasCardGenerator";
import { CopyResultLink } from "./CopyResultLink";
import { Icon } from "@/components/ui/Icon";
import { BRAND_CONFIG } from "@/config/brand";

interface ShareResultProps {
  data: ProcessedNameData;
}

const emptySubscribe = () => () => {};

export function ShareResult({ data }: ShareResultProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [activeFormat, setActiveFormat] = useState<CardFormat>("stories");

  // useSyncExternalStore resolve perfeitamente a checagem de APIs do navegador no React 19 sem hydration mismatch
  const hasNativeShare = useSyncExternalStore(
    emptySubscribe,
    () => typeof navigator !== "undefined" && typeof navigator.share === "function",
    () => false
  );

  const rarity = classifyRarity(data.totalNacional);

  // URL pública canônica estável e determinística (idêntica no servidor e no cliente)
  const canonicalShareUrl = `${BRAND_CONFIG.url}/?nome=${encodeURIComponent(
    data.nomeFormatado
  )}`;

  const shareTitle = `Descobri a raridade do meu nome (${data.nomeFormatado}) no Brasil!`;
  const shareText = `Existem ${formatNumber(
    data.totalNacional
  )} pessoas com o nome ${data.nomeFormatado} registradas no Brasil pelo IBGE. Classificação: ${
    rarity.titulo
  }. Consulte o seu também:`;

  // Compartilhamento nativo com Web Share API (executado sob clique no cliente)
  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        const activeUrl =
          typeof window !== "undefined" ? window.location.href : canonicalShareUrl;
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: activeUrl,
        });
      } catch {
        // Usuário cancelou ou navegador bloqueou
      }
    }
  };

  const handleGenerateCard = async (format: CardFormat) => {
    setActiveFormat(format);
    setIsGenerating(true);
    try {
      const dataUrl = await generateResultCardImage(data, format);
      setGeneratedImage(dataUrl);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Links sociais diretos determinísticos (usam a URL canônica pública)
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${shareText} ${canonicalShareUrl}`
  )}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(canonicalShareUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    canonicalShareUrl
  )}`;

  const getCopyUrl = () => {
    return typeof window !== "undefined" ? window.location.href : canonicalShareUrl;
  };

  return (
    <div className="card-2015 p-6 mb-8">
      <div className="text-center max-w-xl mx-auto mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/15 text-amber-600 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-2">
          <Icon name="share" className="w-4 h-4 text-amber-500" />
          <span>Compartilhe sua Descoberta</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black tracking-tight">
          Mostre a raridade do nome {data.nomeFormatado}
        </h3>
        <p className="text-xs sm:text-sm opacity-75 mt-1">
          Envie para seus amigos ou baixe um cartão visual oficial para os Stories.
        </p>
      </div>

      {/* Botões de Ação Rápida */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        {hasNativeShare && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="btn-2015-primary !text-sm flex items-center gap-2"
          >
            <Icon name="share" className="w-4 h-4" />
            <span>Compartilhar</span>
          </button>
        )}

        <CopyResultLink getUrl={getCopyUrl} />

        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-2015-success !text-sm flex items-center gap-2"
          aria-label="Compartilhar no WhatsApp"
        >
          <Icon name="whatsapp" className="w-4 h-4 text-white" />
          <span>WhatsApp</span>
        </a>

        {/* X / Twitter */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-2015-secondary !text-sm flex items-center gap-2"
          aria-label="Compartilhar no X"
        >
          <Icon name="twitter" className="w-4 h-4" />
          <span>X / Twitter</span>
        </a>

        {/* Facebook */}
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-2015-secondary !text-sm flex items-center gap-2"
          aria-label="Compartilhar no Facebook"
        >
          <Icon name="facebook" className="w-4 h-4" />
          <span>Facebook</span>
        </a>
      </div>

      {/* Gerador de Cartão Visual (Stories / Post) */}
      <div
        className="pt-6 border-t text-center"
        style={{ borderColor: "var(--theme-surface-border)" }}
      >
        <h4 className="text-sm font-bold mb-3 flex items-center justify-center gap-2">
          <Icon name="sparkles" className="w-4 h-4 text-amber-500" />
          <span>Gerar Cartão Visual para Baixar (Sem Servidor)</span>
        </h4>

        <div className="flex items-center justify-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => handleGenerateCard("stories")}
            disabled={isGenerating}
            className={`px-4 py-2 text-xs font-bold rounded border transition-colors cursor-pointer ${
              activeFormat === "stories" && generatedImage
                ? "btn-2015-primary !py-2 !px-4"
                : "btn-2015-secondary !py-2 !px-4"
            }`}
          >
            Formato Stories (9:16)
          </button>
          <button
            type="button"
            onClick={() => handleGenerateCard("post")}
            disabled={isGenerating}
            className={`px-4 py-2 text-xs font-bold rounded border transition-colors cursor-pointer ${
              activeFormat === "post" && generatedImage
                ? "btn-2015-primary !py-2 !px-4"
                : "btn-2015-secondary !py-2 !px-4"
            }`}
          >
            Formato Feed (1200x630)
          </button>
        </div>

        {isGenerating && (
          <p className="text-xs text-amber-500 font-semibold animate-pulse">
            Desenhando imagem em alta resolução no seu navegador...
          </p>
        )}

        {generatedImage && !isGenerating && (
          <div
            className="max-w-md mx-auto p-4 rounded-lg border space-y-3"
            style={{
              backgroundColor: "var(--theme-surface-subtle)",
              borderColor: "var(--theme-surface-border)",
            }}
          >
            <div
              className="relative overflow-hidden rounded border flex justify-center bg-black/5"
              style={{ borderColor: "var(--theme-surface-border)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={generatedImage}
                alt={`Cartão oficial de ${data.nomeFormatado}`}
                className={
                  activeFormat === "stories"
                    ? "max-h-72 object-contain"
                    : "w-full object-contain"
                }
              />
            </div>
            <a
              href={generatedImage}
              download={`nome-raro-${data.nomeFormatado.toLowerCase()}-${activeFormat}.png`}
              className="btn-2015-primary w-full !text-sm flex items-center justify-center gap-2"
            >
              <Icon name="download" className="w-4 h-4" />
              <span>Baixar Imagem PNG em Alta Resolução</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

