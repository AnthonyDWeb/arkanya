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
      data-active={isActive}
      className={[
        "module-rail group relative flex items-center gap-2.5 pl-3 pr-2.5 py-2 rounded-full text-sm transition-[background-color,color,box-shadow] duration-140",
        isActive
          ? "bg-brand/15 text-white shadow-[0_0_18px_-5px_color-mix(in_oklch,var(--color-arc)_50%,transparent)] ring-1 ring-brand/25"
          : "text-zinc-500 hover:text-zinc-100 hover:bg-elevated/70",
      ].join(" ")}
    >
      <Icon
        size={15}
        strokeWidth={isActive ? 2 : 1.75}
        className={isActive ? "text-brand" : "text-zinc-600 group-hover:text-zinc-400"}
      />
      <span className={isActive ? "font-semibold text-[12.5px]" : "text-[12.5px]"}>
        {label}
      </span>
    </Link>
  )
}
