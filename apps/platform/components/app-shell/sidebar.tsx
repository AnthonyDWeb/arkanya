"use client"

import {
  BookOpen,
  FolderOpen,
  LayoutDashboard,
  Settings,
  Terminal,
  Users,
  Wand2,
} from "lucide-react"
import { NavItem } from "./nav-item"
import { WorkerStatus } from "./worker-status"
import { SignOutButton } from "./sign-out-button"

const NAV_ITEMS = [
  { href: "/", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/projects", label: "Projets", icon: FolderOpen },
  { href: "/catalogue", label: "Catalogue", icon: BookOpen },
  { href: "/builder", label: "Builder", icon: Wand2 },
  { href: "/console", label: "Console", icon: Terminal },
  { href: "/settings", label: "Paramètres", icon: Settings },
] as const

type SidebarProps = {
  userName: string
}

export function Sidebar({ userName }: SidebarProps) {
  return (
    <aside className="w-[212px] shrink-0 hidden lg:flex flex-col h-full bg-base/85 border-r border-white/[0.05] relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-brand/25 to-transparent"
      />
      <div className="h-14 flex items-center px-3.5 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.webp"
              alt="Arkanya"
              width={26}
              height={26}
              className="w-[26px] h-[26px] object-contain relative z-10"
            />
            <span
              aria-hidden
              className="absolute inset-0 rounded-full blur-md bg-gold/30 animate-logo-glow"
            />
          </div>
          <div className="min-w-0">
            <span className="heading text-[14px] text-white block leading-tight">
              Arkanya
            </span>
            <span className="metric text-[9px] uppercase tracking-[0.16em] text-gold">
              Platform
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2.5 py-1.5 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </nav>

      <div className="border-t border-white/[0.06] p-2.5 space-y-2">
        <WorkerStatus />
        <div className="flex items-center justify-between px-2.5 py-2">
          <span className="text-xs text-zinc-500 truncate metric">{userName}</span>
          <SignOutButton />
        </div>
      </div>
    </aside>
  )
}
