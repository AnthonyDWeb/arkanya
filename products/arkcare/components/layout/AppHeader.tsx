import Link from "next/link";
import Image from "next/image";
import { HeaderNav } from "./HeaderNav";
import { SettingsIconLink } from "./SettingsIconLink";
import { AuthIconLink } from "./AuthIconLink";

export function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Image
              src="/logo.webp"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg"
              priority
            />
            <span className="bg-gradient-to-r from-teal-700 via-sky-600 to-emerald-600 bg-clip-text text-transparent">
              ArkCare
            </span>
          </Link>
          <div className="flex items-center">
            <AuthIconLink />
            <SettingsIconLink />
          </div>
        </div>
        <HeaderNav />
      </div>
    </header>
  );
}
