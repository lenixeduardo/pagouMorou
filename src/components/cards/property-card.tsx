import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bath, BedDouble, Heart, MapPin, Ruler, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { imageZoom } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Apartment } from "@/types";
import { formatArea, formatCurrency } from "@/utils/format";

interface PropertyCardProps {
  apartment: Apartment;
  favorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  className?: string;
}

const statusLabel: Record<Apartment["status"], string> = {
  available: "Disponível",
  reserved: "Reservado",
  rented: "Alugado",
};

export function PropertyCard({
  apartment,
  favorite = false,
  onToggleFavorite,
  className,
}: PropertyCardProps) {
  const cover = apartment.images[0];

  return (
    <motion.article
      initial="rest"
      whileHover="hover"
      viewport={{ once: true }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-card border border-border bg-card shadow-xs transition-all duration-300 hover:shadow-md",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-secondary">
        {cover ? (
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            variants={imageZoom}
            src={cover}
            alt={apartment.title}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          <div className="grid size-full place-items-center text-caption text-muted-foreground">
            Sem foto
          </div>
        )}
        <Badge
          variant="secondary"
          className="absolute left-3 top-3 rounded-full bg-background/90 text-label text-foreground backdrop-blur"
        >
          {statusLabel[apartment.status]}
        </Badge>
        {apartment.rating >= 4.8 && (
          <Badge
            variant="default"
            className="absolute left-3 top-10 rounded-full bg-amber-500 text-white border-none shadow-sm flex items-center gap-1 py-0.5"
          >
            <Star className="size-3 fill-white" />
            Top Proprietário
          </Badge>
        )}
        {onToggleFavorite ? (
          <button
            type="button"
            aria-label={favorite ? "Remover dos favoritos" : "Salvar nos favoritos"}
            aria-pressed={favorite}
            onClick={() => onToggleFavorite(apartment.id)}
            className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-background/90 text-foreground shadow-xs backdrop-blur transition-transform duration-200 hover:scale-105"
          >
            <Heart className={cn("size-4", favorite && "fill-danger text-danger")} aria-hidden />
          </button>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-title line-clamp-2 text-foreground">
            <Link
              to="/apartamento/$id"
              params={{ id: apartment.id }}
              className="outline-none after:absolute after:inset-0 after:content-['']"
            >
              {apartment.title}
            </Link>
          </h3>
          <span className="flex shrink-0 items-center gap-1 text-caption text-foreground">
            <Star className="size-3.5 text-warning" aria-hidden />
            {apartment.rating.toFixed(1)}
          </span>
        </div>

        <p className="flex items-center gap-1.5 text-caption text-text-secondary">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">
            {apartment.address.street}, {apartment.address.city} — {apartment.address.state}
          </span>
        </p>

        <ul className="flex flex-wrap items-center gap-4 text-caption text-text-secondary">
          <li className="flex items-center gap-1.5">
            <BedDouble className="size-4" aria-hidden /> {apartment.features.bedrooms}
          </li>
          <li className="flex items-center gap-1.5">
            <Bath className="size-4" aria-hidden /> {apartment.features.bathrooms}
          </li>
          <li className="flex items-center gap-1.5">
            <Ruler className="size-4" aria-hidden /> {formatArea(apartment.features.areaM2)}
          </li>
        </ul>

        <p className="mt-1 text-title text-foreground">
          {formatCurrency(apartment.rent)}
          <span className="text-caption font-normal text-text-secondary"> /mês</span>
        </p>
      </div>
    </motion.article>
  );
}