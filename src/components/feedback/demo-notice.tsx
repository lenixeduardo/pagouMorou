import { Info } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface DemoNoticeProps {
  children: ReactNode;
  /** `inline` cabe dentro de cards compactos; `block` destaca o aviso na página. */
  variant?: "inline" | "block";
  className?: string;
}

/**
 * Marca explicitamente uma área da interface como demonstração, para que nenhuma
 * tela sugira verificação, análise ou integração que o sistema ainda não executa.
 */
export function DemoNotice({ children, variant = "inline", className }: DemoNoticeProps) {
  if (variant === "inline") {
    return (
      <p
        className={cn(
          "flex items-start gap-1.5 text-[11px] leading-snug text-text-secondary",
          className,
        )}
      >
        <Info className="mt-px size-3 shrink-0" aria-hidden />
        <span>{children}</span>
      </p>
    );
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-card border border-dashed border-border bg-surface px-4 py-3 text-caption text-text-secondary",
        className,
      )}
    >
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p>{children}</p>
    </div>
  );
}
