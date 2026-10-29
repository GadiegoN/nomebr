/**
 * Definição dos temas disponíveis para a aplicação Nome Raro.
 * Inclui temas temáticos por décadas históricas, dark mode e estilos estéticos.
 */

export interface ThemeDefinition {
  id: string;
  name: string;
  decade: string;
  description: string;
  previewColors: [string, string, string]; // Cores para o seletor visual
}

export const THEMES: ThemeDefinition[] = [
  {
    id: "default-2015",
    name: "Web 2015 (Padrão)",
    decade: "2010s",
    description: "Estética clássica de landing pages da época de Bootstrap 3.",
    previewColors: ["#0f2744", "#2563eb", "#f59e0b"],
  },
  {
    id: "synthwave-80s",
    name: "Anos 80 (Synthwave)",
    decade: "1980s",
    description: "Tons de neon magenta, ciano elétrico e violeta arcade retrô.",
    previewColors: ["#1a0933", "#ec4899", "#06b6d4"],
  },
  {
    id: "grunge-90s",
    name: "Anos 90 (Teal & Y2K Prep)",
    decade: "1990s",
    description: "O clássico Teal de navegadores dos anos 90 com cinza e amarelo vibrante.",
    previewColors: ["#004d40", "#00897b", "#fbc02d"],
  },
  {
    id: "y2k-2000s",
    name: "Anos 2000 (Frutiger Aero)",
    decade: "2000s",
    description: "Visual aquático cristalino, prateado e azul da era da banda larga.",
    previewColors: ["#0369a1", "#38bdf8", "#4ade80"],
  },
  {
    id: "dark-mode",
    name: "Modo Noturno (Dark)",
    decade: "Moderno",
    description: "Tons de ardósia escuro e azul profundo para menor fadiga visual.",
    previewColors: ["#090d16", "#1e293b", "#3b82f6"],
  },
  {
    id: "brasilidade",
    name: "Brasilidade Oficial",
    decade: "Nacional",
    description: "Verde esmeralda, amarelo ouro e azul anil inspirados na bandeira e no IBGE.",
    previewColors: ["#064e3b", "#059669", "#eab308"],
  },
  {
    id: "pergaminho-vintage",
    name: "Arquivo Histórico (Sépia)",
    decade: "Histórico",
    description: "Tons de pergaminho, couro e documentos antigos de certidões censitárias.",
    previewColors: ["#3e2723", "#d7ccc8", "#8d6e63"],
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk 2077",
    decade: "Futurista",
    description: "Amarelo elétrico de alto contraste com fundo preto e detalhes ciano.",
    previewColors: ["#0a0a0a", "#facc15", "#00f0ff"],
  },
  {
    id: "pastel-nordico",
    name: "Pastel Nórdico",
    decade: "Minimalista",
    description: "Tons pastéis relaxantes de lavanda, menta e creme suave.",
    previewColors: ["#f3f4f6", "#818cf8", "#34d399"],
  },
  {
    id: "espresso-cafe",
    name: "Espresso & Caramelo",
    decade: "Aconchegante",
    description: "Tons quentes de café torrado, caramelo aveludado e marfim.",
    previewColors: ["#2d1b16", "#78350f", "#d97706"],
  },
];

export const DEFAULT_THEME_ID = "default-2015";

