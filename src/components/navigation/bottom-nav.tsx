import { Link } from "@tanstack/react-router";

import { primaryNav } from "@/config/navigation";

export function BottomNav() {
  return (
    <nav
      aria-label="Navegação inferior"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-xl md:hidden"
    >
      <ul className="mx-auto flex max-w-app items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {primaryNav.map((item) => (
          <li key={item.to} className="flex-1">
            <Link
              to={item.to}
              activeOptions={{ exact: item.exact }}
              activeProps={{ className: "text-primary" }}
              inactiveProps={{ className: "text-text-secondary" }}
              className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-md px-1 py-2 transition-colors"
            >
              <item.icon className="size-5" aria-hidden />
              <span className="text-[11px] font-medium leading-none">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}