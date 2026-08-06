import * as React from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative">
      <div className="absolute left-[18px] top-1/2 -translate-y-1/2 text-[#0F9B4D]">
        <LockKeyhole size={21} strokeWidth={2} />
      </div>
      <Input
        ref={ref}
        type={visible ? "text" : "password"}
        className={cn("pl-[54px] pr-[54px]", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Ocultar senha" : "Exibir senha"}
        className="absolute right-[18px] top-1/2 -translate-y-1/2 rounded-full p-1 text-[#98A2B3] transition-colors hover:text-[#101828]"
      >
        {visible ? (
          <EyeOff size={21} strokeWidth={2} aria-hidden />
        ) : (
          <Eye size={21} strokeWidth={2} aria-hidden />
        )}
      </button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";
