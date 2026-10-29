/**
 * Gerador de cartões visuais para compartilhamento direto no navegador via HTML5 Canvas.
 * Permite exportação em alta resolução para Stories (9:16) ou Feed/Mensagens (1200x630).
 */

import { ProcessedNameData } from "@/types/ibge";
import { classifyRarity } from "./rarityCalculator";
import { formatNumber, formatPercent } from "./formatters";
import { BRAND_CONFIG } from "@/config/brand";

export type CardFormat = "stories" | "post";

export async function generateResultCardImage(
  data: ProcessedNameData,
  format: CardFormat = "stories"
): Promise<string> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Não foi possível inicializar o contexto 2D do Canvas.");
  }

  const isStories = format === "stories";
  const width = isStories ? 1080 : 1200;
  const height = isStories ? 1920 : 630;

  canvas.width = width;
  canvas.height = height;

  const rarity = classifyRarity(data.totalNacional);

  if (isStories) {
    // --- Layout Stories (1080 x 1920) ---
    // Fundo degradê clássico e elegante
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#0f2744");
    gradient.addColorStop(0.5, "#16375c");
    gradient.addColorStop(1, "#091728");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Borda decorativa dourada superior
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(80, 80, width - 160, 6);

    // Marca no topo
    ctx.font = "bold 36px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(BRAND_CONFIG.name.toUpperCase(), width / 2, 160);

    ctx.font = "400 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("ESTATÍSTICAS OFICIAIS DO IBGE", width / 2, 205);

    // Cartão central branco
    const cardX = 80;
    const cardY = 270;
    const cardW = width - 160;
    const cardH = 1420;
    const radius = 24;

    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, radius);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#e2e8f0";
    ctx.stroke();

    // Título dentro do cartão
    ctx.fillStyle = "#64748b";
    ctx.font = "600 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("FREQUÊNCIA E HISTÓRIA DO NOME", width / 2, cardY + 90);

    // Nome pesquisado grande
    ctx.fillStyle = "#0f172a";
    ctx.font = "900 84px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(data.nomeFormatado, width / 2, cardY + 200);

    // Selo de raridade
    const badgeW = 420;
    const badgeH = 64;
    const badgeX = (width - badgeW) / 2;
    const badgeY = cardY + 245;

    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 32);
    ctx.fillStyle = "#eff6ff";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#2563eb";
    ctx.stroke();

    ctx.fillStyle = "#1e40af";
    ctx.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(`Classificação: ${rarity.titulo}`, width / 2, badgeY + 44);

    // Bloco 1: Ocorrências no Brasil
    const stat1Y = cardY + 410;
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.roundRect(cardX + 40, stat1Y, cardW - 80, 190, 16);
    ctx.fill();
    ctx.strokeStyle = "#cbd5e1";
    ctx.stroke();

    ctx.fillStyle = "#64748b";
    ctx.font = "500 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("Total de pessoas registradas no Brasil", width / 2, stat1Y + 60);

    ctx.fillStyle = "#2563eb";
    ctx.font = "900 68px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(formatNumber(data.totalNacional), width / 2, stat1Y + 140);

    // Bloco 2: Década de Pico
    const stat2Y = stat1Y + 230;
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.roundRect(cardX + 40, stat2Y, cardW - 80, 190, 16);
    ctx.fill();
    ctx.strokeStyle = "#cbd5e1";
    ctx.stroke();

    ctx.fillStyle = "#64748b";
    ctx.font = "500 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("Década de maior popularidade", width / 2, stat2Y + 60);

    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(
      data.decadaAuge ? data.decadaAuge.rotulo : "Dados históricos distribuídos",
      width / 2,
      stat2Y + 130
    );

    // Bloco 3: Estado com mais registros
    const stat3Y = stat2Y + 230;
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.roundRect(cardX + 40, stat3Y, cardW - 80, 190, 16);
    ctx.fill();
    ctx.strokeStyle = "#cbd5e1";
    ctx.stroke();

    ctx.fillStyle = "#64748b";
    ctx.font = "500 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("Estado com maior concentração", width / 2, stat3Y + 60);

    ctx.fillStyle = "#047857";
    ctx.font = "bold 48px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    const ufText = data.ufMaiorFrequencia
      ? `${data.ufMaiorFrequencia.nome} (${data.ufMaiorFrequencia.sigla}) - ${formatPercent(data.ufMaiorFrequencia.percentualNacional)}`
      : "Dados de UF não divulgados";
    ctx.fillText(ufText, width / 2, stat3Y + 130);

    // Descrição explicativa do censo
    ctx.fillStyle = "#475569";
    ctx.font = "400 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(
      "Dados apurados pelo IBGE com base no Censo Demográfico.",
      width / 2,
      cardY + cardH - 120
    );
    ctx.fillStyle = "#94a3b8";
    ctx.font = "400 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(
      "Consulte o seu nome gratuitamente em nomeraro.com.br",
      width / 2,
      cardY + cardH - 80
    );

    // Rodapé
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "400 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("Fonte Oficial: IBGE • Censo Demográfico", width / 2, height - 90);
  } else {
    // --- Layout Post / Feed (1200 x 630) ---
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#0f2744");
    gradient.addColorStop(1, "#16375c");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Faixa dourada no topo
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(0, 0, width, 6);

    // Cartão branco interno
    const cardX = 40;
    const cardY = 36;
    const cardW = width - 80;
    const cardH = height - 72;

    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 16);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#cbd5e1";
    ctx.stroke();

    // Nome e cabeçalho
    ctx.textAlign = "left";
    ctx.fillStyle = "#64748b";
    ctx.font = "600 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("FREQUÊNCIA DE NOMES NO BRASIL (IBGE)", cardX + 50, cardY + 60);

    ctx.fillStyle = "#0f172a";
    ctx.font = "900 64px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(data.nomeFormatado, cardX + 50, cardY + 140);

    // Badge
    ctx.fillStyle = "#2563eb";
    ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(`Classificação: ${rarity.titulo}`, cardX + 50, cardY + 185);

    // Bloco central com métricas
    const gridY = cardY + 230;

    // Coluna 1: Total
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.roundRect(cardX + 50, gridY, 310, 160, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#64748b";
    ctx.font = "500 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("Registros no Brasil", cardX + 70, gridY + 45);

    ctx.fillStyle = "#2563eb";
    ctx.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(formatNumber(data.totalNacional), cardX + 70, gridY + 110);

    // Coluna 2: Pico
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.roundRect(cardX + 390, gridY, 310, 160, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#64748b";
    ctx.font = "500 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("Década de Maior Auge", cardX + 410, gridY + 45);

    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(
      data.decadaAuge ? data.decadaAuge.rotulo : "Distribuído",
      cardX + 410,
      gridY + 105
    );

    // Coluna 3: Maior Estado
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.roundRect(cardX + 730, gridY, 330, 160, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#64748b";
    ctx.font = "500 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("Maior Concentração", cardX + 750, gridY + 45);

    ctx.fillStyle = "#047857";
    ctx.font = "bold 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(
      data.ufMaiorFrequencia ? `${data.ufMaiorFrequencia.sigla} (${formatPercent(data.ufMaiorFrequencia.percentualNacional)})` : "N/D",
      cardX + 750,
      gridY + 105
    );

    // Rodapé interno
    ctx.fillStyle = "#94a3b8";
    ctx.font = "400 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("Dados Oficiais: IBGE • Censo Demográfico | Consulte o seu em nomeraro.com.br", cardX + 50, cardY + cardH - 30);
  }

  return canvas.toDataURL("image/png");
}

