import { Select as CoreSelect } from "@arkanya/ui/core";

export default function Select({
  label,
  name,
  required,
  children,
  defaultValue,
}: {
  label: string;
  name?: string;
  required?: boolean;
  children: React.ReactNode;
  defaultValue?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-medium text-[#444444]">
        {label} {required && "*"}
      </label>

      <CoreSelect
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="
          w-full px-3 py-3 pr-10
          rounded-xl bg-[#F9F9F9]
          border border-[#E2E2E2] text-[#444444]
          focus:outline-none focus:border-[#809877]
          focus:ring-2 focus:ring-[#809877]/30 transition"
      >
        {children}
      </CoreSelect>
    </div>
  );
}
