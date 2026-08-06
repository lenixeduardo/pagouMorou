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
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary shadow-sm overflow-hidden p-1.5">
          <img 
            src={logoData.url} 
            alt="PagouMorou Icon" 
            className="w-full h-full object-contain brightness-0 invert" 
          />
        </div>
        <span className="text-xl font-display font-bold tracking-tight text-text">
          Pagou<span className="text-primary">Morou</span>
        </span>
      </div>
        className={cn("object-contain w-auto", sizes[size])} 
      />
      {withSlogan && (
        <span className="flex flex-col leading-none">
          <span className="text-caption text-text-secondary mt-1">Alugou. Pagou. Morou.</span>
        </span>
      )}
    </Link>
  );
}