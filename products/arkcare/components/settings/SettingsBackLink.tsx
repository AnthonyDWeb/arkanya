import Link from "next/link";

export function SettingsBackLink() {
  return (
    <Link
      href="/settings"
      className="inline-flex w-fit items-center text-sm font-semibold text-teal-700 hover:text-teal-800"
    >
      ← Paramètres
    </Link>
  );
}
