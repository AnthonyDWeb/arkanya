import Link from "next/link";

export default function SettingsBackLink() {
  return (
    <Link href="/settings" className="arknest-settings-back">
      ← Paramètres
    </Link>
  );
}
