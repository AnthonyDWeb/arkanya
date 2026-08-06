import { Field as CoreField, Input } from "@arkanya/ui/core";
import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Field({ label, className = "", ...props }: Props) {
  return (
    <CoreField label={label} className="grid gap-1.5 text-sm font-medium text-slate-800">
      <Input
        className={`min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-teal-700 ${className}`}
        {...props}
      />
    </CoreField>
  );
}
