import React from "react";

interface LoadingSpinnerProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  label = "Carregando dados oficiais do IBGE...",
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-7 h-7 border-3",
    lg: "w-10 h-10 border-4",
  };

  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center p-6 text-center ${className}`}
    >
      <div
        className={`${sizeClasses[size]} border-blue-600 border-t-transparent rounded-full animate-spin mb-3`}
        aria-hidden="true"
      />
      {label && (
        <span className="text-slate-700 text-sm font-medium">{label}</span>
      )}
      <span className="sr-only">{label}</span>
    </div>
  );
}

