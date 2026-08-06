import { Field, Textarea as CoreTextarea } from "@arkanya/ui/core";
import type { TextareaHTMLAttributes } from "react";

export function Textarea({
  label,
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <Field label={label} className="grid gap-1.5 text-sm font-medium text-slate-800">
      <CoreTextarea
        className={`min-h-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-700 ${className}`}
        {...props}
      />
    </Field>
  );
}
