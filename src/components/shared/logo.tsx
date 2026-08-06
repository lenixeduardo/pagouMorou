import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import logoData from "@/assets/logo.asset.json";

interface LogoProps {
  className?: string;
  withSlogan?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, withSlogan = false, size = "md" }: LogoProps) {
  const sizes = {
    sm: "h-8",
    md: "h-12",
    lg: "h-16",
  };

  return (
    <Link to="/" className={cn("flex items-center gap-2.5", className)} aria-label="PagouMorou">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-transparent overflow-hidden">
          <img 
            src={logoData.url} 
            alt="PagouMorou Icon" 
            className="w-full h-full object-contain" 
          />
        </div>
        <span 
          className="text-2xl font-bold tracking-tight text-primary"
        >
          PagouMorou
        </span>
      </div>
      {withSlogan && (
        <span className="flex flex-col leading-none">
          <span className="text-caption text-text-secondary mt-1">Alugou. Pagou. Morou.</span>
        </span>
      )}
    </Link>
  );
}