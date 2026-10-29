import React from "react";

interface SearchSuggestionsProps {
  onSelectName: (name: string) => void;
  isLoading?: boolean;
}

const SAMPLE_NAMES = [
  { name: "Maria", label: "Mais Frequente" },
  { name: "João", label: "Tradicional" },
  { name: "Enzo", label: "Fenômeno Anos 2000" },
  { name: "Gadiego", label: "Exemplo Ultra Raro" },
  { name: "Valentina", label: "Crescimento Recente" },
  { name: "Aparecida", label: "Pico Década de 50" },
];

export function SearchSuggestions({
  onSelectName,
  isLoading = false,
}: SearchSuggestionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-300">
      <span className="font-semibold text-slate-300">Exemplos rápidos:</span>
      {SAMPLE_NAMES.map((item) => (
        <button
          key={item.name}
          type="button"
          onClick={() => onSelectName(item.name)}
          disabled={isLoading}
          className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 px-2.5 py-1 rounded transition-colors disabled:opacity-50 cursor-pointer text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          title={`${item.name} (${item.label})`}
        >
          <span className="font-medium">{item.name}</span>
          <span className="opacity-60 ml-1 text-[10px]">({item.label})</span>
        </button>
      ))}
    </div>
  );
}

