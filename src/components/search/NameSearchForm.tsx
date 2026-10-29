"use client";

import React, { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { validateAndNormalizeName } from "@/utils/normalization";

interface NameSearchFormProps {
  onSearch: (name: string) => void;
  isLoading?: boolean;
  initialValue?: string;
  placeholder?: string;
  buttonText?: string;
  size?: "lg" | "md";
}

export function NameSearchForm({
  onSearch,
  isLoading = false,
  initialValue = "",
  placeholder = "Digite um nome (ex: João, Larissa, Enzo)...",
  buttonText = "Consultar Frequência",
  size = "lg",
}: NameSearchFormProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateAndNormalizeName(inputValue);

    if (!result.isValid) {
      setValidationError(result.errorMessage || "Digite um nome válido.");
      return;
    }

    setValidationError(null);
    onSearch(result.firstNameOnly);
  };

  const isLg = size === "lg";

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto"
      noValidate
      role="search"
    >
      <div className="relative">
        <label htmlFor="search-name-input" className="sr-only">
          Nome a pesquisar no banco de dados do IBGE
        </label>
        <div
          className={`flex flex-col sm:flex-row shadow-lg rounded-md overflow-hidden border-2 ${
            validationError
              ? "border-red-400 ring-2 ring-red-200"
              : "border-blue-600 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-300"
          }`}
        >
          <div className="relative flex-1 bg-white flex items-center">
            <span className="pl-4 text-slate-400 pointer-events-none" aria-hidden="true">
              <Icon name="search" className="w-5 h-5 text-slate-400" />
            </span>
            <input
              id="search-name-input"
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder={placeholder}
              disabled={isLoading}
              autoComplete="given-name"
              aria-invalid={!!validationError}
              aria-describedby={validationError ? "search-validation-error" : undefined}
              className={`w-full bg-white text-slate-900 placeholder-slate-400 focus:outline-none font-medium ${
                isLg ? "py-4 px-3 text-lg" : "py-3 px-3 text-base"
              }`}
            />
            {inputValue && !isLoading && (
              <button
                type="button"
                onClick={() => {
                  setInputValue("");
                  setValidationError(null);
                }}
                className="pr-4 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label="Limpar campo de pesquisa"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`btn-2015-primary sm:rounded-none !border-0 font-bold whitespace-nowrap flex items-center justify-center gap-2 ${
              isLg ? "py-4 px-8 text-base" : "py-3 px-6 text-sm"
            } ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <>
                <div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  aria-hidden="true"
                />
                <span>Consultando...</span>
              </>
            ) : (
              <>
                <span>{buttonText}</span>
                <Icon name="arrow-right" className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {validationError && (
          <p
            id="search-validation-error"
            role="alert"
            className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200 text-left"
          >
            {validationError}
          </p>
        )}
      </div>
    </form>
  );
}

