"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import { BookOpen, FolderOpen, Plus, Terminal, Users } from "lucide-react"

const LEFT_ITEMS = [
  { href: "/projects", label: "Projets", icon: FolderOpen },
  { href: "/clients", label: "Clients", icon: Users },
] as const

const RIGHT_ITEMS = [
  { href: "/catalogue", label: "Catalogue", icon: BookOpen },
  { href: "/console", label: "Console", icon: Terminal },
] as const

const GRADIENT = "linear-gradient(to bottom, #8b5cf6, #4338ca)"

function NavItem({
  href,
  label,
  icon: Icon,
  isActive,
}: {
  href: string
  label: string
  icon: LucideIcon
  isActive: boolean
}) {
  return (
    <Link
      href={href}
      className={[
        "flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-medium transition-colors duration-[120ms] ease-out",
        isActive ? "text-white" : "text-zinc-500",
      ].join(" ")}
    >
      <span
        className="w-10 h-7 rounded-lg flex items-center justify-center"
        style={isActive ? { background: GRADIENT } : undefined}
      >
        <Icon size={20} strokeWidth={isActive ? 2 : 1.75} />
      </span>
      {label}
    </Link>
  )
}

export function BottomNav() {
  const pathname = usePathname()
  const isBuilderActive = pathname.startsWith("/builder")

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-zinc-950 border-t border-zinc-800 flex items-stretch h-14 overflow-visible">
      {LEFT_ITEMS.map(({ href, label, icon }) => (
        <NavItem
          key={href}
          href={href}
          label={label}
          icon={icon}
          isActive={pathname === href || pathname.startsWith(href)}
        />
      ))}

      {/* Bouton Builder central surélevé */}
      <div className="flex-1 relative flex justify-center items-start">
        <Link
          href="/builder"
          aria-label="Builder"
          style={{
            background: isBuilderActive
              ? "linear-gradient(to bottom, #8b5cf6, #4338ca)"
              : "linear-gradient(to bottom, #f0b429, #b45309)",
            boxShadow: isBuilderActive
              ? "0 0 0 4px #09090b, 0 0 24px rgba(139,92,246,0.5), 0 8px 24px rgba(99,102,241,0.3)"
              : "0 0 0 4px #09090b, 0 4px 20px rgba(240,180,41,0.35)",
          }}
          className="absolute -top-6 w-14 h-11 rounded-[18px] flex items-center justify-center transition-all duration-[150ms] ease-out active:scale-95"
        >
          <Plus size={22} strokeWidth={2.5} className="text-white" />
        </Link>
      </div>

      {RIGHT_ITEMS.map(({ href, label, icon }) => (
        <NavItem
          key={href}
          href={href}
          label={label}
          icon={icon}
          isActive={pathname === href || pathname.startsWith(href)}
        />
      ))}
    </nav>
  )
}
