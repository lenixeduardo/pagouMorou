import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldProps {
  id: string;
  label: string;
  // `| undefined` explícito: com `exactOptionalPropertyTypes`, repassar
  // `errors.campo?.message` direto de um formulário exige aceitar undefined.
  hint?: string | undefined;
  error?: string | undefined;
  required?: boolean | undefined;
  className?: string | undefined;
  children: ReactNode;
}

export function Field({ id, label, hint, error, required, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-[10px]", className)}>
      <Label htmlFor={id} className="text-[16px] font-medium text-[#475467]">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-[13px] text-[#D92D20] mt-2" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[13px] text-[#667085] mt-2">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
