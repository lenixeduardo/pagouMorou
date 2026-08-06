import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import logoAsset from "@/assets/pagoumorou-logo.png.asset.json";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "custom";
  width?: number;
}

export function Logo({ className, size = "md", width }: LogoProps) {
  const widthMap = {
    sm: 160,
    md: 200,
    lg: 260,
    custom: width || 260,
  };

  const selectedWidth = widthMap[size as keyof typeof widthMap] || widthMap.md;

  return (
    <Link 
      to="/" 
      className={cn("block", className)} 
      aria-label="PagouMorou"
    >
      <img 
        src={logoAsset.url} 
        alt="PagouMorou" 
        style={{ width: selectedWidth }}
        className="h-auto object-contain"
      />
    </Link>
  );
}
