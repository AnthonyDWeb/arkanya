import { Input } from "@arkanya/ui/core";

export default function DateInput({
  label,
  name,
  required,
  ...props
}: {
  label: string;
  name?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-medium text-[#444444]">
        {label} {required && "*"}
      </label>

      <Input
        type="date"
        name={name}
        required={required}
        {...props}
        className="
                    w-full p-3 rounded-xl bg-[#F9F9F9]
                    border border-[#E2E2E2] text-[#444444]
                    focus:outline-none focus:border-[#809877]
                    focus:ring-2 focus:ring-[#809877]/30 transition
                "
      />
    </div>
  );
}
