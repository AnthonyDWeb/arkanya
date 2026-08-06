import { Badge as CoreBadge } from "@arkanya/ui/core";
import type { ReactNode } from "react";

const tones = {
  slate: "bg-slate-100 text-slate-700",
  teal: "bg-teal-100 text-teal-800",
  rose: "bg-rose-100 text-rose-700",
  amber: "bg-amber-100 text-amber-800",
  sky: "bg-sky-100 text-sky-800",
};

export function Badge({
  children,
  tone = "slate",
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
}) {
  return (
    <CoreBadge
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </CoreBadge>
  );
}
