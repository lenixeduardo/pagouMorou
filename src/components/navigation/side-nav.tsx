import { Link } from "@tanstack/react-router";

import { primaryNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

/** Sidebar architecture, ready for dashboard-style areas (owner panel, admin). */
export function SideNav({ className }: { className?: string }) {
  return (
    <aside
      className={cn("hidden w-64 shrink-0 border-r border-border bg-sidebar p-4 lg:block", className)}
    >
      <nav className="flex flex-col gap-1" aria-label="Navegação lateral">
        {primaryNav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.exact }}
            activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-body text-sidebar-foreground transition-colors hover:bg-sidebar-accent/60"
          >
            <item.icon className="size-4" aria-hidden />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}