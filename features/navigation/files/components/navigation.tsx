import Link from "next/link"

type NavLink = {
  href: string
  label: string
}

type NavigationProps = {
  links?: NavLink[]
}

const DEFAULT_LINKS: NavLink[] = [
  { href: "/", label: "Accueil" },
]

export function Navigation({ links = DEFAULT_LINKS }: NavigationProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href={links[0]?.href ?? "/"}
          className="font-semibold text-sm transition-opacity duration-150 ease-out hover:opacity-70"
          style={{ color: "{{primary-color}}" }}
        >
          {{site-name}}
        </a>
        <ul className="flex items-center gap-6">
          {links.slice(1).map((link) => {
            const isAnchor = link.href.startsWith("#")
            const className =
              "text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150 ease-out"
            return (
              <li key={link.href}>
                {isAnchor ? (
                  <a href={link.href} className={className}>
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} className={className}>
                    {link.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
