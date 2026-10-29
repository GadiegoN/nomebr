"use client";

import React, { useState } from "react";
import { Icon } from "@/components/ui/Icon";

interface CopyResultLinkProps {
  url?: string;
  getUrl?: () => string;
}

export function CopyResultLink({ url, getUrl }: CopyResultLinkProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const targetUrl = getUrl ? getUrl() : url || (typeof window !== "undefined" ? window.location.href : "");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(targetUrl);
      } else {
        // Fallback clássico
        const textArea = document.createElement("textarea");
        textArea.value = targetUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Ignora erro
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="btn-2015-secondary !text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
      aria-label={copied ? "Link copiado para a área de transferência" : "Copiar link do resultado"}
    >
      <Icon name={copied ? "check" : "copy"} className={copied ? "w-4 h-4 text-emerald-600" : "w-4 h-4"} />
      <span>{copied ? "Link Copiado!" : "Copiar Link"}</span>
    </button>
  );
}

