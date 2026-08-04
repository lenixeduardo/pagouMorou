import type { Transition, Variants } from "framer-motion";

export const easeOut: Transition["ease"] = [0.22, 1, 0.36, 1];

export const duration = {
  fast: 0.2,
  base: 0.25,
  slow: 0.3,
} as const;

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.base, ease: easeOut } },
  exit: { opacity: 0, transition: { duration: duration.fast, ease: easeOut } },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: easeOut } },
  exit: { opacity: 0, y: 8, transition: { duration: duration.fast, ease: easeOut } },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: duration.slow, ease: easeOut } },
  exit: { opacity: 0, x: -16, transition: { duration: duration.fast, ease: easeOut } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: duration.base, ease: easeOut } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: duration.fast, ease: easeOut } },
};

export const staggerChildren = (stagger = 0.06): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger } },
});

export const hoverLift = {
  whileHover: { y: -3, transition: { duration: duration.fast, ease: easeOut } },
  whileTap: { scale: 0.99 },
} as const;

export const imageZoom = {
  rest: { scale: 1 },
  hover: { scale: 1.06, transition: { duration: 0.45, ease: easeOut } },
} as const;

export const pageTransition = {
  initial: "hidden",
  animate: "visible",
  exit: "exit",
  variants: slideUp,
} as const;