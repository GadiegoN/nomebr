import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BRAND_CONFIG } from "@/config/brand";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0f2744",
};

export const metadata: Metadata = {
  metadataBase: new URL(BRAND_CONFIG.url),
  title: {
    default: `${BRAND_CONFIG.name} — Frequência e Raridade de Nomes no Brasil (IBGE)`,
    template: `%s | ${BRAND_CONFIG.name}`,
  },
  description: BRAND_CONFIG.fullDescription,
  applicationName: BRAND_CONFIG.name,
  authors: [{ name: BRAND_CONFIG.author, url: BRAND_CONFIG.url }],
  creator: BRAND_CONFIG.author,
  publisher: BRAND_CONFIG.name,
  keywords: [
    "nomes raros",
    "frequência de nomes",
    "nomes no brasil",
    "ibge nomes",
    "censo ibge",
    "estatística de nomes",
    "popularidade de nomes",
    "significado de nomes",
  ],
  alternates: {
    canonical: BRAND_CONFIG.url,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: BRAND_CONFIG.url,
    title: `${BRAND_CONFIG.name} — Descubra a Raridade do seu Nome no Brasil`,
    description: BRAND_CONFIG.shortDescription,
    siteName: BRAND_CONFIG.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_CONFIG.name} — Estatísticas Oficiais do IBGE`,
    description: BRAND_CONFIG.shortDescription,
    creator: BRAND_CONFIG.social.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full antialiased scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('nomeraro-active-theme');if(s){document.documentElement.setAttribute('data-theme',s);}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col selection:bg-amber-300 selection:text-slate-900">
        {children}
      </body>
    </html>
  );
}
