import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SimpleCard({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}) {
  return (
    <Tag className={cn("rounded-card border border-border bg-card p-6 shadow-xs", className)}>
      {children}
    </Tag>
  );
}