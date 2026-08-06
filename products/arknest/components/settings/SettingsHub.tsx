import Link from "next/link";
import {
  Boxes,
  CheckCircle,
  Percent,
  ReceiptText,
  Rocket,
  SettingsIcon,
  Undo2,
  Users,
} from "@arkanya/icons";

const links = [
  { href: "/settings/account", title: "Mon compte", icon: Users, color: "arknest-icon--members" },
  { href: "/settings/repartition", title: "Mode de répartition", icon: SettingsIcon, color: "arknest-icon--dashboard" },
  { href: "/settings/categories", title: "Catégories", icon: Boxes, color: "arknest-icon--stats" },
  { href: "/settings/types-depenses", title: "Types de dépenses", icon: ReceiptText, color: "arknest-icon--expense" },
  { href: "/settings/premium", title: "Premium et codes", icon: Percent, color: "arknest-icon--goals" },
  { href: "/settings/application", title: "Application et mises à jour", icon: Rocket, color: "arknest-icon--simulation" },
  { href: "/settings/donnees", title: "Données et sauvegarde", icon: Undo2, color: "arknest-icon--income" },
  { href: "/privacy", title: "Confidentialité", icon: CheckCircle, color: "arknest-icon--privacy" },
];

export default function SettingsHub() {
  return (
    <nav aria-label="Catégories de paramètres" className="arknest-settings-hub">
      {links.map(({ href, title, icon: Icon, color }) => (
        <Link key={href} href={href} className="arknest-settings-hub__link">
          <Icon aria-hidden="true" className={`h-5 w-5 ${color}`} />
          <strong>{title}</strong>
        </Link>
      ))}
    </nav>
  );
}
