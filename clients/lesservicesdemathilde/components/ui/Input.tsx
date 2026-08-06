import { Input as CoreInput } from "@arkanya/ui/core";

export default function Input({
  label,
  name,
  required,
  ...props
}: {
  label: string;
  name?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="relative w-full">
      <label
        className="text-gray-500
                    pointer-events-none transition-all duration-200
                    peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2
                    peer-focus:top-1 peer-focus:text-sm peer-focus:text-[#809877]
                "
      >
        {label} {required && "*"}
      </label>
      <CoreInput
        {...props}
        placeholder=" "
        name={name}
        required={required}
        className="
                    peer w-full p-3 rounded-xl bg-[#F9F9F9]
                    border border-[#E2E2E2] text-[#444444]
                    focus:outline-none focus:border-[#809877]
                    focus:ring-2 focus:ring-[#809877]/30 transition
                "
      />
    </div>
  );
}
