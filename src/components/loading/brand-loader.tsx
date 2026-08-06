import { motion } from "framer-motion";
import { Key, Home, DoorOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import logoData from "@/assets/logo.asset.json";

interface BrandLoaderProps {
  className?: string;
  isSplash?: boolean;
}

export function BrandLoader({ className, isSplash = false }: BrandLoaderProps) {
  if (isSplash) {
    return (
      <motion.div 
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn("fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white", className)}
      >
        <div className="relative mb-12 flex items-center justify-center">
          {/* Logo with swinging key effect */}
          <motion.div
            initial={{ rotate: -5 }}
            animate={{ rotate: 5 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="relative"
          >
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className="flex size-32 items-center justify-center rounded-3xl bg-white shadow-xl"
            >
              <img 
                src={logoData.url} 
                alt="PagouMorou Logo" 
                className="size-20 object-contain" 
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Cinematic Counter */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-0.5 w-48 overflow-hidden rounded-full bg-surface-secondary">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
              className="h-full bg-primary"
            />
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-xs tracking-widest text-text-secondary"
          >
            PAGOU MOROU — CINEMATIC EXPERIENCE
          </motion.div>
        </div>
      </motion.div>
    );
  }

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

