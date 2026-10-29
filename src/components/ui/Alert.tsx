import React from "react";
import { Icon } from "./Icon";

interface AlertProps {
  type?: "info" | "warning" | "error" | "success";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Alert({
  type = "info",
  title,
  children,
  className = "",
}: AlertProps) {
  const configs = {
    info: {
      container: "bg-blue-50 border-blue-200 text-blue-950",
      icon: "info" as const,
      iconColor: "text-blue-600",
      titleColor: "text-blue-900",
    },
    warning: {
      container: "bg-amber-50 border-amber-200 text-amber-950",
      icon: "alert-triangle" as const,
      iconColor: "text-amber-600",
      titleColor: "text-amber-900",
    },
    error: {
      container: "bg-red-50 border-red-200 text-red-950",
      icon: "alert-triangle" as const,
      iconColor: "text-red-600",
      titleColor: "text-red-900",
    },
    success: {
      container: "bg-emerald-50 border-emerald-200 text-emerald-950",
      icon: "check" as const,
      iconColor: "text-emerald-600",
      titleColor: "text-emerald-900",
    },
  };

  const config = configs[type];

  return (
    <div
      role="alert"
      className={`border rounded-md p-4 flex gap-3 text-sm leading-relaxed ${config.container} ${className}`}
    >
      <div className="shrink-0 mt-0.5">
        <Icon name={config.icon} className={`w-5 h-5 ${config.iconColor}`} />
      </div>
      <div className="flex-1">
        {title && (
          <h4 className={`font-semibold mb-1 text-sm ${config.titleColor}`}>
            {title}
          </h4>
        )}
        <div className="space-y-1">{children}</div>
      </div>
    </div>
  );
}

