"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SettingsIcon } from "@arkanya/icons";

export function SettingsIconLink() {
  const active = usePathname().startsWith("/settings");

  return (
    <Link
      aria-current={active ? "page" : undefined}
      aria-label="Parametres"
      className={`grid h-10 w-10 place-items-center transition ${
        active ? "text-teal-700" : "text-slate-700 hover:text-teal-700"
      }`}
      href="/settings"
      title="Parametres"
    >
      <SettingsIcon aria-hidden="true" className="h-7 w-7" strokeWidth={1.8} />
    </Link>
  );
}
