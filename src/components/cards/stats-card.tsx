import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string;
  trend?: { value: string; positive?: boolean };
  icon?: LucideIcon;
  className?: string;
}

export function StatsCard({ label, value, trend, icon: Icon, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-border bg-card p-6 shadow-xs",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-label uppercase tracking-wide text-text-secondary">{label}</p>
        {Icon ? <Icon className="size-4 text-muted-foreground" aria-hidden /> : null}
      </div>
      <p className="mt-3 text-heading text-foreground">{value}</p>
      {trend ? (
        <p className={cn("mt-1 text-caption", trend.positive ? "text-success" : "text-danger")}>
          {trend.value}
        </p>
      ) : null}
    </div>
  );
}