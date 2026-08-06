import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  withSlogan?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, withSlogan = false, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <Link 
      to="/" 
      className={cn("flex flex-col items-start gap-0 group transition-all duration-300", className)} 
      aria-label="PagouMorou"
    >
      <span className={cn(
        "font-signature text-primary tracking-tight leading-none transition-transform duration-300 group-hover:scale-105", 
        sizeClasses[size]
      )}>
        PagouMorou
      </span>
      {withSlogan && (
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-text-secondary mt-1 opacity-80">
          Alugou. Pagou. Morou.
        </span>
      )}
    </Link>
  );
}
