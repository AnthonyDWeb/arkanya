"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"

type NavItemProps = {
  href: string
  label: string
  icon: LucideIcon
}

export function NavItem({ href, label, icon: Icon }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href))

  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-[120ms] ease-out",
        isActive
          ? "bg-zinc-800 text-white"
          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900",
      ].join(" ")}
    >
      <Icon size={16} strokeWidth={1.75} />
      {label}
    </Link>
  )
}
