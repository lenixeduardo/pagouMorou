import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import logoData from "@/assets/logo-brand-sheet.png.asset.json";

interface LogoProps {
  className?: string;
  withSlogan?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, withSlogan = false, size = "md" }: LogoProps) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5", className)} aria-label="PagouMorou">
      <div className="flex items-center overflow-hidden h-9 w-[180px]">
        <img 
          src={logoData.url} 
          alt="PagouMorou Logo" 
          className="h-[280%] w-auto object-contain -translate-y-[2%] -translate-x-[2%]"
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