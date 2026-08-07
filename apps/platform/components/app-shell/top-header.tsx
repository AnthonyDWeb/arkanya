import Link from "next/link"
import { Settings } from "lucide-react"

export function TopHeader() {
  return (
    <header className="lg:hidden h-12 shrink-0 flex sticky top-0 z-30 bg-base/95 backdrop-blur-md border-b border-white/[0.04]">
      <div className="flex items-center px-4">
        <div className="relative pb-1">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity duration-140 ease-out hover:opacity-80"
          >
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.webp"
                alt="Arkanya"
                width={36}
                height={36}
                className="rounded-[3px] w-9 h-9 object-contain relative z-10"
              />
              <span
                aria-hidden
                className="absolute inset-0 rounded-full blur-md bg-gold/20 animate-logo-glow"
              />
            </div>
            <div>
              <span className="heading text-sm text-white block leading-none">Arkanya</span>
              <span className="metric text-[9px] uppercase tracking-[0.14em] text-gold/75">
                Platform
              </span>
            </div>
          </Link>
          <span
            aria-hidden
            className="absolute inset-x-[12%] bottom-0 h-px bg-gradient-to-r from-transparent via-gold/55 to-transparent pointer-events-none"
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-end px-4">
        <Link
          href="/settings"
          className="p-2 -mr-1 text-zinc-500 hover:text-zinc-200 transition-colors duration-[140ms] ease-out min-h-11 min-w-11 flex items-center justify-center"
          aria-label="Paramètres"
        >
          <Settings size={24} strokeWidth={1.75} />
        </Link>
      </div>
    </header>
  )
}
