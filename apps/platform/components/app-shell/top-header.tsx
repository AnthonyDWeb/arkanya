import Link from "next/link"
import { Settings } from "lucide-react"

export function TopHeader() {
  return (
    <header className="lg:hidden h-12 shrink-0 flex sticky top-0 z-30 bg-zinc-900">
      {/* Partie logo — alignée avec la sidebar en desktop */}
      <div className="flex items-center px-4 bg-zinc-900 lg:w-[220px] lg:shrink-0 lg:bg-zinc-950 lg:border-r lg:border-zinc-800">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity duration-150 ease-out hover:opacity-75"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.webp"
            alt="Arkanya"
            width={36}
            height={36}
            className="rounded-md w-9 h-9 object-contain"
          />
          <span className="text-sm font-semibold tracking-tight text-white">
            Arkanya Platform
          </span>
        </Link>
      </div>

      {/* Partie droite — fond page */}
      <div className="flex-1 flex items-center justify-end px-4 bg-zinc-900">
        <Link
          href="/settings"
          className="lg:hidden p-2 -mr-1 text-zinc-500 hover:text-zinc-200 transition-colors duration-[120ms] ease-out"
          aria-label="Paramètres"
        >
          <Settings size={26} strokeWidth={1.75} />
        </Link>
      </div>
    </header>
  )
}
