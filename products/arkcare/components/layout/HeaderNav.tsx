"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/treatments", label: "Traitements" },
  { href: "/doses", label: "Prises" },
  { href: "/history", label: "Historique" },
];

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-nowrap gap-1 overflow-x-auto text-xs font-medium text-slate-700 sm:gap-2 sm:text-sm">
      {links.map((link) => {
        const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={`whitespace-nowrap rounded-lg px-2 py-2 transition sm:px-3 ${active ? "bg-teal-700 text-white shadow-sm" : "hover:bg-slate-100"}`}
            href={link.href}
            key={link.href}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
