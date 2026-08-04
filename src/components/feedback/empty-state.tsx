import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-card border border-dashed border-border bg-surface px-6 py-16 text-center",
        className,
      )}
    >
      {Icon ? (
        <span className="grid size-14 place-items-center rounded-full bg-primary-soft text-primary-soft-foreground">
          <Icon className="size-6" aria-hidden />
        </span>
      ) : null}
      <div className="max-w-sm">
        <h3 className="text-title text-foreground">{title}</h3>
        {description ? <p className="mt-2 text-body text-text-secondary">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}