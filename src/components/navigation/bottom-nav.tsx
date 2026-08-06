import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { primaryNav } from "@/config/navigation";

export function BottomNav() {
  return (
    <motion.nav
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
      aria-label="Navegação inferior"
      className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/80 shadow-lg backdrop-blur-2xl md:hidden"
    >
      <ul className="flex items-stretch justify-around px-2 py-1">
        {primaryNav.map((item) => (
          <li key={item.to} className="flex-1">
            <Link
              to={item.to}
              activeOptions={{ exact: item.exact }}
              activeProps={{ className: "text-primary" }}
              inactiveProps={{ className: "text-text-secondary" }}
              className="flex min-h-16 flex-col items-center justify-center gap-1 px-1 py-2 transition-colors"
            >
              <item.icon className="size-5" aria-hidden />
              <span className="text-[11px] font-medium leading-none">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
