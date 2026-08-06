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
    <aside className="w-[220px] shrink-0 hidden lg:flex flex-col border-r border-zinc-800 bg-zinc-950 h-screen sticky top-0">
      <div className="h-16 flex items-center px-4 border-b border-zinc-800/60 shrink-0">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.webp" alt="Arkanya" width={28} height={28} className="rounded-sm w-7 h-7 object-contain" />
          <span className="text-base font-semibold tracking-tight text-white">Arkanya Platform</span>
        </div>
      </div>
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
        ))}
      </nav>

      <div className="border-t border-zinc-800/60 p-2 space-y-1">
        <WorkerStatus />
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-xs text-zinc-400 truncate">{userName}</span>
          <SignOutButton />
        </div>
      </div>
    </aside>
  )
}
