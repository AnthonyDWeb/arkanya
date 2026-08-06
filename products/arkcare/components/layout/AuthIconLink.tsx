"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users } from "@arkanya/icons";

export function AuthIconLink() {
  const active = usePathname().startsWith("/auth");

  return (
    <Link
      aria-current={active ? "page" : undefined}
      aria-label="Connexion"
      className={`grid h-10 w-10 place-items-center transition ${
        active ? "text-teal-700" : "text-slate-700 hover:text-teal-700"
      }`}
      href="/auth"
      title="Connexion"
    >
      <Users aria-hidden="true" className="h-7 w-7" strokeWidth={1.8} />
    </Link>
  );
}
