import Link from "next/link";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { Icon } from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="card-2015 p-8 max-w-lg w-full text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Icon name="alert-triangle" className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Página ou Nome Não Encontrado
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            O nome informado não foi localizado na base pública do IBGE ou não atingiu o limite mínimo de 20 ocorrências exigido para divulgação estatística.
          </p>
          <div className="pt-4">
            <Link href="/" className="btn-2015-primary text-sm inline-flex items-center gap-2">
              <Icon name="search" className="w-4 h-4" />
              <span>Voltar e Fazer Nova Pesquisa</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
