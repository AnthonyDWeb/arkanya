"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NestedRouteBackLink() {
  const segments = usePathname().split("/").filter(Boolean);
  if (segments[0] === "auth") return null;
  if (segments.length < 2) return null;
  const parent = `/${segments.slice(0, -1).join("/")}`;
  return (
    <Link href={parent} className="mb-3 inline-flex text-sm font-semibold text-teal-700 underline">
      ← Retour
    </Link>
  );
}
