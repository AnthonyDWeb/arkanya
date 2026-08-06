import Image from "next/image";
import Link from "next/link";
import { SettingsIcon, Users } from "@arkanya/icons";

export default function AppHeader() {
  return (
    <header className="arknest-app-header">
      <Link href="/" className="arknest-app-header__brand">
        <Image src="/logo.webp" alt="" width={32} height={32} priority />
        <strong>ArkNest</strong>
      </Link>
      <nav aria-label="Compte et paramètres" className="arknest-app-header__actions">
        <Link href="/auth" aria-label="Connexion" title="Connexion">
          <Users aria-hidden="true" className="arknest-icon--members h-6 w-6" />
        </Link>
        <Link href="/settings" aria-label="Paramètres" title="Paramètres">
          <SettingsIcon aria-hidden="true" className="arknest-icon--dashboard h-6 w-6" />
        </Link>
      </nav>
    </header>
  );
}
