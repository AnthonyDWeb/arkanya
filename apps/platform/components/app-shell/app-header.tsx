"use client"

import Link from "next/link"
import { Settings } from "lucide-react"
import { CommandSearch } from "@/components/app-shell/command-search"
import { SignOutButton } from "@/components/app-shell/sign-out-button"
import { WorkerStatus } from "@/components/app-shell/worker-status"
import type { SearchCatalog } from "@/lib/search/commands"

type AppHeaderProps = {
  userName: string
  catalog: SearchCatalog
}

export function AppHeader({ userName, catalog }: AppHeaderProps) {
  return (
    <header className="shrink-0 sticky top-0 z-30 border-b border-white/[0.05] bg-base/95 backdrop-blur-md">
      <div className="h-14 px-3 sm:px-4 lg:px-6 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 sm:gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 transition-opacity duration-140 hover:opacity-80"
        >
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.webp"
              alt="Arkanya"
              width={28}
              height={28}
              className="w-7 h-7 object-contain relative z-10"
            />
            <span
              aria-hidden
              className="absolute inset-0 rounded-full blur-md bg-gold/25 animate-logo-glow"
            />
          </div>
          <div className="hidden sm:block leading-none">
            <span className="heading text-[14px] text-white block">Arkanya</span>
            <span className="metric text-[9px] uppercase tracking-[0.14em] text-gold/80">
              Platform
            </span>
          </div>
        </Link>

        <CommandSearch catalog={catalog} />

        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 justify-end">
          <div className="hidden md:block mr-1">
            <WorkerStatus compact />
          </div>
          <span className="hidden lg:inline metric text-[11px] text-zinc-500 max-w-[7rem] truncate mr-0.5">
            {userName}
          </span>
          <Link
            href="/settings"
            title="Paramètres"
            aria-label="Paramètres"
            className="p-2 min-h-11 min-w-11 inline-flex items-center justify-center text-zinc-500 hover:text-zinc-200 rounded-lg transition-colors duration-140 touch-manipulation"
          >
            <Settings className="w-4 h-4" strokeWidth={1.75} />
          </Link>
          <SignOutButton />
        </div>
      </div>
    </header>
  )
}
