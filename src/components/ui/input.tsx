import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[58px] w-full rounded-[14px] border border-[#D9DEE7] bg-white px-[18px] py-2 text-base text-[#101828] shadow-sm transition-all duration-200 placeholder:text-[#98A2B3] focus-visible:outline-none focus-visible:border-[#0F9B4D] focus-visible:ring-[4px] focus-visible:ring-[#0F9B4D]/10 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
