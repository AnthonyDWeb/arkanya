"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NestedRouteBackLink() {
  const segments = usePathname().split("/").filter(Boolean);
  if (segments[0] === "auth") return null;
  if (segments.length < 2) return null;
  const parent = `/${segments.slice(0, -1).join("/")}`;
  return (
    <Link href={parent} className="arknest-back-link mb-3 inline-flex">
      ← Retour
    </Link>
  );
}
