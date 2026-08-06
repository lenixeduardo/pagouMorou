import { motion } from "framer-motion";
import { Key, Home, DoorOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandLoaderProps {
  className?: string;
}

export function BrandLoader({ className }: BrandLoaderProps) {
  const iconVariants = {
    initial: { scale: 0, opacity: 0, y: 10 },
    animate: (i: number) => ({
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.4,
        duration: 0.6,
        repeat: Infinity,
        repeatType: "reverse" as const,
        repeatDelay: 0.8
      }
    })
  };

  const icons = [
    { icon: Key, color: "text-amber-500" },
    { icon: Home, color: "text-primary" },
    { icon: DoorOpen, color: "text-blue-600" }
  ];

  return (
    <div className={cn("flex flex-col items-center justify-center gap-6", className)}>
      <div className="flex items-center gap-8">
        {icons.map(({ icon: Icon, color }, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={iconVariants}
            initial="initial"
            animate="animate"
            className={cn("p-4 rounded-2xl bg-surface-secondary shadow-sm", color)}
          >
            <Icon className="size-10" strokeWidth={1.5} />
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className="text-label text-text-secondary tracking-widest uppercase"
      >
        Carregando PagouMorou...
      </motion.div>
    </div>
  );
}
