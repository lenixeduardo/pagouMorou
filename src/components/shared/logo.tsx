import { Link } from "@tanstack/react-router";
import { Building2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function Logo({ className, withSlogan = false }: { className?: string; withSlogan?: boolean }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5", className)} aria-label="PagouMorou">
      <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
        <Building2 className="size-5" aria-hidden />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-title tracking-tight text-foreground">PagouMorou</span>
        {withSlogan ? (
          <span className="text-caption text-text-secondary">Alugou. Pagou. Morou.</span>
        ) : null}
      </span>
    </Link>
  );
}