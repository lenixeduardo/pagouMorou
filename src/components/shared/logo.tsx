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
      <div className="flex items-center">
        <img 
          src={logoData.url} 
          alt="PagouMorou Logo" 
          className={cn(
            "object-contain w-auto",
            size === "sm" ? "h-6" : size === "md" ? "h-9" : "h-12"
          )}
        />
      </div>
      {withSlogan && (
        <span className="flex flex-col leading-none">
          <span className="text-caption text-text-secondary mt-1">Alugou. Pagou. Morou.</span>
        </span>
      )}
    </Link>
  );
}