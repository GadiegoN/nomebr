import React from "react";
import { Icon } from "@/components/ui/Icon";
import { Alert } from "@/components/ui/Alert";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface SearchStatusProps {
  status: "idle" | "loading" | "success" | "not_found" | "error";
  searchName: string;
  errorMessage?: string;
  warningMessage?: string;
  onRetry?: () => void;
}

export function SearchStatus({
  status,
  searchName,
  errorMessage,
  warningMessage,
  onRetry,
}: SearchStatusProps) {
  if (status === "loading") {
    return (
      <div className="card-2015 p-8 text-center my-6">
        <LoadingSpinner
          size="lg"
          label={`Consultando dados de "${searchName}" diretamente no banco de dados do IBGE...`}
        />
        <p className="text-xs text-slate-500 mt-2">
          Consultando registros demográficos de mais de 190 milhões de brasileiros.
        </p>
      </div>
    );
  }

  if (status === "not_found") {
    return (
      <div className="card-2015 p-8 my-6 border-amber-200 bg-amber-50/40 text-left">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
            <Icon name="alert-triangle" className="w-6 h-6" />
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-lg font-bold text-slate-900">
              Nenhum registro divulgado para &ldquo;{searchName}&rdquo;
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              O IBGE adota um critério estatístico de proteção e sigilo: apenas nomes com{" "}
              <strong>pelo menos 20 registros</strong> em todo o Brasil são divulgados na base de dados oficial.
            </p>
            <div className="bg-white p-3.5 rounded border border-amber-200 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Possíveis motivos:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>O nome pode ser extremamente raro no Brasil (menos de 20 ocorrências).</li>
                <li>Pode haver variação de grafia (por exemplo: Y em vez de I, dois L, etc.).</li>
                <li>Se for um nome composto (ex: Maria Clara), o IBGE registra apenas o prenome individual isolado.</li>
              </ul>
            </div>
            {warningMessage && (
              <p className="text-xs text-amber-800 font-medium pt-1">
                {warningMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="card-2015 p-8 my-6 border-red-200 bg-red-50/30 text-left">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-700">
            <Icon name="alert-triangle" className="w-6 h-6" />
          </div>
          <div className="space-y-3 flex-1">
            <h3 className="text-lg font-bold text-red-950">
              Não foi possível carregar os dados no momento
            </h3>
            <p className="text-sm text-red-800">
              {errorMessage ||
                "Houve uma instabilidade temporária na comunicação com a API pública do IBGE."}
            </p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="btn-2015-secondary !text-sm !py-2 !px-4 flex items-center gap-2"
              >
                <Icon name="refresh" className="w-4 h-4" />
                <span>Tentar novamente</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (warningMessage) {
    return (
      <div className="my-4">
        <Alert type="info" title="Nota sobre a metodologia do IBGE">
          {warningMessage}
        </Alert>
      </div>
    );
  }

  return null;
}
