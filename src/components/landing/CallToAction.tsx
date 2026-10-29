import React from "react";
import { Icon } from "@/components/ui/Icon";

interface CallToActionProps {
  onSearchTop: () => void;
}

export function CallToAction({ onSearchTop }: CallToActionProps) {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white text-center">
      <div className="container-landing max-w-3xl">
        <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center mx-auto mb-4 font-black shadow-md">
          <Icon name="sparkles" className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4">
          Pronto para descobrir a história do seu nome?
        </h2>
        <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
          Faça uma consulta gratuita agora mesmo com os dados oficiais do Censo do IBGE e descubra quantas pessoas têm o mesmo nome que você.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onSearchTop}
            className="btn-2015-primary !bg-amber-500 !border-amber-600 !text-slate-950 font-bold !py-3.5 !px-8 text-base shadow-lg cursor-pointer"
          >
            Fazer Nova Consulta
          </button>
          <a
            href="#comparar"
            className="btn-2015-secondary !bg-slate-800 !text-white !border-slate-700 hover:!bg-slate-700 !py-3.5 !px-8 text-base"
          >
            Comparar Dois Nomes
          </a>
        </div>
      </div>
    </section>
  );
}
