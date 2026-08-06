import Link from "next/link";
import { CheckCircle, Clock, Percent, Rocket, Undo2, Users } from "@arkanya/icons";

const links = [
  { href: "/settings/account", title: "Mon compte", icon: Users },
  { href: "/settings/notifications", title: "Notifications", icon: Clock },
  { href: "/settings/premium", title: "Premium et codes", icon: Percent },
  { href: "/settings/application", title: "Application et mises à jour", icon: Rocket },
  { href: "/settings/donnees", title: "Données et sauvegarde", icon: Undo2 },
  { href: "/privacy", title: "Confidentialité", icon: CheckCircle },
];

export function SettingsHub() {
  return (
    <nav aria-label="Catégories de paramètres">
      {links.map(({ href, title, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex min-h-12 items-center gap-3 border-b border-slate-200 px-1 py-3 text-sm font-semibold text-slate-900 transition hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          <Icon aria-hidden="true" className="h-5 w-5 text-teal-700" />
          <span>{title}</span>
        </Link>
      ))}
    </nav>
  );
}
