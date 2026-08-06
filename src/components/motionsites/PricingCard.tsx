import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  priceLabel: string;
  dark?: boolean;
  delay?: number;
  children?: ReactNode;
}

export function PricingCard({ 
  title, 
  description, 
  price, 
  priceLabel, 
  dark = false, 
  delay = 0,
  children 
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className={cn(
        "rounded-[40px] px-10 pt-12 pb-10 flex flex-col h-full transition-all",
        dark 
          ? "bg-[#051A24] text-[#F6FCFF] shadow-inner" 
          : "bg-white text-[#0D212C] shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
      )}
    >
      <h3 className="text-[22px] font-medium mb-2">{title}</h3>
      <p className={cn("text-base mb-8 whitespace-pre-line", dark ? "text-[#E0EBF0]/80" : "text-[#0D212C]/70")}>
        {description}
      </p>
      
      <div className="mt-auto">
        <div className="mb-8">
          <span className={cn("text-4xl font-semibold", dark ? "text-[#F6FCFF]" : "text-[#0D212C]")}>
            {price}
          </span>
          <p className={cn("text-sm mt-1 uppercase tracking-wider", dark ? "text-[#E0EBF0]/60" : "text-[#0D212C]/50")}>
            {priceLabel}
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
