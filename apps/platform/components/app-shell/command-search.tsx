"use client"

import {
  BookOpen,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  Terminal,
  User,
  Wand2,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react"
import { authClient } from "@/lib/auth-client"
import {
  resolveSearch,
  type SearchActionId,
  type SearchCatalog,
  type SearchHit,
  type SearchHitKind,
} from "@/lib/search/commands"

type CommandSearchProps = {
  catalog: SearchCatalog
}

const KIND_ICON: Record<SearchHitKind, LucideIcon> = {
  page: LayoutDashboard,
  project: FolderOpen,
  client: User,
  action: Zap,
}

const KIND_LABEL: Record<SearchHitKind, string> = {
  page: "Page",
  project: "Projet",
  client: "Client",
  action: "Action",
}

const ACTION_ICON: Record<SearchActionId, LucideIcon> = {
  logout: LogOut,
  builder: Wand2,
  home: LayoutDashboard,
}

function pageIcon(href: string): LucideIcon {
  if (href === "/") return LayoutDashboard
  if (href.startsWith("/projects")) return FolderOpen
  if (href.startsWith("/clients")) return User
  if (href.startsWith("/catalogue")) return BookOpen
  if (href.startsWith("/builder")) return Wand2
  if (href.startsWith("/console")) return Terminal
  if (href.startsWith("/settings")) return Settings
  return Search
}

export function CommandSearch({ catalog }: CommandSearchProps) {
  const router = useRouter()
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [running, setRunning] = useState(false)

  const hits = resolveSearch(query, catalog)

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onPointerDown)
    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [])

  useEffect(() => {
    function onKey(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  async function runAction(actionId: SearchActionId) {
    setRunning(true)
    try {
      if (actionId === "logout") {
        await authClient.signOut()
        router.push("/login")
        router.refresh()
        return
      }
      if (actionId === "builder") {
        router.push("/builder")
        return
      }
      if (actionId === "home") {
        router.push("/")
        return
      }
    } finally {
      setRunning(false)
    }
  }

  async function go(hit: SearchHit) {
    setQuery("")
    setOpen(false)
    if (hit.kind === "action" && hit.actionId) {
      await runAction(hit.actionId)
      return
    }
    if (hit.href) router.push(hit.href)
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    if (hits.length === 0 || running) return
    if (hits.length === 1) {
      void go(hits[0]!)
      return
    }
    const target = hits[activeIndex] ?? hits[0]
    if (target) void go(target)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setOpen(true)
      return
    }
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((i) => (hits.length === 0 ? 0 : (i + 1) % hits.length))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((i) =>
        hits.length === 0 ? 0 : (i - 1 + hits.length) % hits.length,
      )
    } else if (event.key === "Escape") {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div ref={rootRef} className="relative w-full max-w-xl mx-auto">
      <form onSubmit={submit} className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500"
          strokeWidth={2}
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="/projets · #slug · @client · $logout"
          aria-label="Recherche"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          role="combobox"
          autoComplete="off"
          disabled={running}
          className="w-full h-10 pl-9 pr-14 rounded-xl border border-white/[0.08] bg-well/70 text-[13px] text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-brand/45 focus:bg-surface/90 transition-[border-color,background-color] duration-140 disabled:opacity-50"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline metric text-[9px] text-zinc-600 border border-white/[0.08] rounded px-1.5 py-0.5">
          ⌘K
        </kbd>
      </form>

      {open && (
        <div
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1.5 w-full rounded-xl border border-white/[0.1] bg-surface/95 backdrop-blur-md shadow-[0_16px_40px_-12px_rgba(0,0,0,0.65)] overflow-hidden"
        >
          {hits.length === 0 ? (
            <p className="px-3 py-3 text-[12px] text-zinc-500">
              Aucun résultat — `/projets`, `#slug`, `@client` ou `$logout`.
            </p>
          ) : (
            <ul className="max-h-72 overflow-y-auto py-1">
              {hits.map((hit, index) => {
                const Icon =
                  hit.kind === "page" && hit.href
                    ? pageIcon(hit.href)
                    : hit.kind === "action" && hit.actionId
                      ? ACTION_ICON[hit.actionId]
                      : KIND_ICON[hit.kind]
                const active = index === activeIndex
                return (
                  <li key={hit.id} role="option" aria-selected={active}>
                    <button
                      type="button"
                      disabled={running}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => void go(hit)}
                      className={[
                        "w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors duration-140 disabled:opacity-50",
                        active ? "bg-brand/12" : "hover:bg-white/[0.04]",
                      ].join(" ")}
                    >
                      <span className="w-7 h-7 rounded-lg bg-well/80 border border-white/[0.06] flex items-center justify-center text-zinc-300 shrink-0">
                        <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] text-zinc-100 truncate">
                          {hit.title}
                        </p>
                        <p className="metric text-[10px] text-zinc-500 truncate">
                          {hit.subtitle}
                        </p>
                      </div>
                      <span className="metric text-[9px] uppercase tracking-wide text-zinc-600 shrink-0">
                        {KIND_LABEL[hit.kind]}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
          <p className="px-3 py-1.5 border-t border-white/[0.06] metric text-[9px] text-zinc-600">
            Entrée pour lancer · ↑↓ pour naviguer · `$` = action
          </p>
        </div>
      )}
    </div>
  )
}
