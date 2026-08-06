"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DashboardIcon,
  ExpensesIcon,
  IncomesIcon,
  MembersIcon,
  SimulationIcon,
  type ArkanyaIcon,
} from "@arkanya/icons";

type Tab = {
  href: string;
  label: string;
  icon: ArkanyaIcon;
  color: string;
};

const tabs: Tab[] = [
  { href: "/", label: "Accueil", icon: DashboardIcon, color: "arknest-icon--dashboard" },
  { href: "/simulation", label: "Simulation", icon: SimulationIcon, color: "arknest-icon--simulation" },
  { href: "/revenus", label: "Revenus", icon: IncomesIcon, color: "arknest-icon--income" },
  { href: "/depenses", label: "Depenses", icon: ExpensesIcon, color: "arknest-icon--expense" },
  { href: "/membres", label: "Membres", icon: MembersIcon, color: "arknest-icon--members" },
];

export default function MobileNavbar() {
  const pathname = usePathname();

  return (
    <nav className="arknest-mobile-nav">
      <div className="arknest-mobile-nav__grid">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              data-active={isActive ? "true" : undefined}
              className="arknest-mobile-link"
            >
              <Icon
                aria-hidden="true"
                className={`arknest-nav-icon h-5 w-5 ${tab.color}`}
              />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
