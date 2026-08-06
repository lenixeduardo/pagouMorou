import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { slideUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface PageProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  fullWidth?: boolean;
  component?: "main" | "div";
}

export function Page({ title, description, actions, children, className, fullWidth, component = "div" }: PageProps) {
  const Component = motion[component];
  const content = (
    <>
      {(title || actions) && (
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
          <div className="min-w-0">
            {title && <h1 className="text-heading text-foreground">{title}</h1>}
            {description ? (
              <p className="mt-2 max-w-2xl text-body text-text-secondary">{description}</p>
            ) : null}
          </div>
          {actions}
        </header>
      )}
      {children ? <div className={cn((title || actions) && "mt-8 md:mt-10")}>{children}</div> : null}
    </>
  );

  return (
    <Component
      initial="hidden"
      animate="visible"
      variants={slideUp}
      className={cn("py-8 md:py-12", className)}
    >
      {fullWidth ? content : <Container>{content}</Container>}
    </Component>
  );
}
