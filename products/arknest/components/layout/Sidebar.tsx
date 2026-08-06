"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartSpline,
  DashboardIcon,
  ExpensesIcon,
  IncomesIcon,
  MembersIcon,
  Rocket,
  SimulationIcon,
  type ArkanyaIcon,
} from "@arkanya/icons";
import { NavList } from "@arkanya/ui/navigation";

const links: { href: string; label: string; icon: ArkanyaIcon; color: string }[] = [
  { href: "/", label: "Dashboard", icon: DashboardIcon, color: "arknest-icon--dashboard" },
  { href: "/simulation", label: "Simulation", icon: SimulationIcon, color: "arknest-icon--simulation" },
  { href: "/statistiques", label: "Statistiques", icon: ChartSpline, color: "arknest-icon--stats" },
  { href: "/objectifs", label: "Objectifs", icon: Rocket, color: "arknest-icon--goals" },
  { href: "/revenus", label: "Revenus", icon: IncomesIcon, color: "arknest-icon--income" },
  { href: "/depenses", label: "Dépenses", icon: ExpensesIcon, color: "arknest-icon--expense" },
  { href: "/membres", label: "Membres", icon: MembersIcon, color: "arknest-icon--members" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="arknest-sidebar">
      <NavList orientation="vertical">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href ||
            (link.href === "/settings" && pathname.startsWith("/settings/"));

          return (
            <Link
              key={link.href}
              href={link.href}
              data-active={isActive ? "true" : undefined}
              className="ark-nav-link"
            >
              <Icon
                aria-hidden="true"
                className={`arknest-nav-icon h-5 w-5 shrink-0 ${link.color}`}
              />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </NavList>
    </aside>
  );
}
