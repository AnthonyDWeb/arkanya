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
        "flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-semibold tracking-wide transition-colors duration-[140ms] ease-out min-h-11",
        isActive ? "text-white" : "text-zinc-500",
      ].join(" ")}
    >
      <span
        className={[
          "w-10 h-7 rounded-[4px] flex items-center justify-center transition-[background-color,color] duration-[140ms] ease-out",
          isActive ? "bg-brand/15 text-brand" : "text-current",
        ].join(" ")}
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
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-base/92 backdrop-blur-xl border-t border-white/[0.06] flex items-stretch h-14 overflow-visible">
      {LEFT_ITEMS.map(({ href, label, icon }) => (
        <NavItem
          key={href}
          href={href}
          label={label}
          icon={icon}
          isActive={pathname === href || pathname.startsWith(href)}
        />
      ))}

      <div className="flex-1 relative flex justify-center items-start">
        <Link
          href="/builder"
          aria-label="Builder"
          style={{
            boxShadow: isBuilderActive
              ? "0 0 0 4px var(--color-base), 0 0 28px -4px color-mix(in oklch, var(--color-arc) 55%, transparent), 0 0 12px -2px color-mix(in oklch, var(--color-gold) 35%, transparent)"
              : "0 0 0 4px var(--color-base), 0 4px 18px -6px color-mix(in oklch, var(--color-arc) 40%, transparent)",
          }}
          className="slab faceted absolute -top-6 w-14 h-14 !rounded-2xl !p-0 flex items-center justify-center transition-[box-shadow,transform] duration-[150ms] ease-out active:scale-95"
        >
          <Plus size={24} strokeWidth={2.5} />
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
