"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function PrivacyFooterLink() {
  if (usePathname() === "/privacy") return null;

  return (
    <>
      {" · "}
      <Link className="underline" href="/privacy">
        Confidentialité
      </Link>
    </>
  );
}
