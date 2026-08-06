import { Field, Select as CoreSelect } from "@arkanya/ui/core";
import type { Option } from "@/types";
import type { SelectHTMLAttributes } from "react";

type Props<T extends string> = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: Option<T>[];
};

export function Select<T extends string>({ label, options, className = "", ...props }: Props<T>) {
  return (
    <Field label={label} className="grid gap-1.5 text-sm font-medium text-slate-800">
      <CoreSelect
        className={`min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-teal-700 ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </CoreSelect>
    </Field>
  );
}
