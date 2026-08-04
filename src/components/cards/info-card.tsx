import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface InfoCardProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function InfoCard({ icon: Icon, title, description, action, className }: InfoCardProps) {
  return (
    <section
      className={cn(
        "flex items-start gap-4 rounded-card border border-border bg-card p-6 shadow-xs",
        className,
      )}
    >
      {Icon ? (
        <span className="grid size-11 shrink-0 place-items-center rounded-md bg-primary-soft text-primary-soft-foreground">
          <Icon className="size-5" aria-hidden />
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <h3 className="text-title text-foreground">{title}</h3>
        {description ? <p className="mt-1 text-body text-text-secondary">{description}</p> : null}
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </section>
  );
}