"use client"

import {
  ChevronDown,
  Cloud,
  Database,
  Github,
  Globe,
  KeyRound,
  LogOut,
  Radio,
  Server,
} from "lucide-react"
import { useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { EnvKeyRow } from "@/components/settings/copy-env-button"
import { SettingsRow } from "@/components/ui/settings-row"
import { SurfacePanel } from "@/components/ui/surface-panel"
import {
  INTEGRATION_STATUS_LABELS,
  SETTINGS_INTEGRATIONS,
  integrationStatus,
  type IntegrationStatus,
  type SettingsIntegrationId,
} from "@/lib/settings/integrations"
import type { SettingsEnvEntry, WorkerHealth } from "@/types/settings"

type SettingsViewProps = {
  userName: string
  userEmail: string
  entries: SettingsEnvEntry[]
}

type SettingsPane = "account" | "connections" | "system"

const PANES: Array<{ id: SettingsPane; label: string }> = [
  { id: "account", label: "Compte" },
  { id: "connections", label: "Connexions" },
  { id: "system", label: "Système" },
]

const STATUS_TONE: Record<IntegrationStatus, string> = {
  ready: "text-success",
  partial: "text-warning",
  missing: "text-danger",
}

const STATUS_DOT: Record<IntegrationStatus, string> = {
  ready: "text-success",
  partial: "text-warning",
  missing: "text-danger",
}

const INTEGRATION_ICONS: Record<SettingsIntegrationId, ReactNode> = {
  app: <Globe className="w-4 h-4" strokeWidth={1.75} />,
  auth: <KeyRound className="w-4 h-4" strokeWidth={1.75} />,
  database: <Database className="w-4 h-4" strokeWidth={1.75} />,
  github: <Github className="w-4 h-4" strokeWidth={1.75} />,
  vercel: <Cloud className="w-4 h-4" strokeWidth={1.75} />,
  worker: <Server className="w-4 h-4" strokeWidth={1.75} />,
}

export function SettingsView({ userName, userEmail, entries }: SettingsViewProps) {
  const router = useRouter()
  const [pane, setPane] = useState<SettingsPane>("account")
  const [openId, setOpenId] = useState<SettingsIntegrationId | null>(null)
  const [showEnvDump, setShowEnvDump] = useState(false)
  const [health, setHealth] = useState<WorkerHealth | null>(null)
  const [checking, setChecking] = useState(true)
  const [signingOut, setSigningOut] = useState(false)

  const ready = entries.filter((e) => e.configured).length
  const byKey = new Map(entries.map((e) => [e.key, e]))
  const initials = userName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("")

  async function checkWorker() {
    setChecking(true)
    try {
      const res = await fetch("/api/worker/health", { cache: "no-store" })
      const data = (await res.json()) as WorkerHealth
      setHealth({ ...data, status: res.ok ? data.status : "offline" })
    } catch {
      setHealth({ status: "offline" })
    } finally {
      setChecking(false)
    }
  }

  useEffect(() => {
    void checkWorker()
  }, [])

  async function signOut() {
    setSigningOut(true)
    try {
      await authClient.signOut()
      router.push("/login")
      router.refresh()
    } finally {
      setSigningOut(false)
    }
  }

  const online = health?.status === "ok"
  const connectionReady = SETTINGS_INTEGRATIONS.filter(
    (i) => integrationStatus(i, entries) === "ready",
  ).length

  return (
    <div className="animate-page-in min-h-full">
      <header className="px-4 lg:px-6 pt-4 pb-4 border-b border-white/[0.04]">
        <p className="metric text-[10px] tracking-[0.14em] text-gold uppercase mb-1.5">
          Système
        </p>
        <h1 className="page-title">Paramètres</h1>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 metric text-[11px] text-zinc-500">
          <span>
            Connexions{" "}
            <span className="text-brand tabular-nums">
              {connectionReady}/{SETTINGS_INTEGRATIONS.length}
            </span>
          </span>
          <span className="text-zinc-700">·</span>
          <span>
            Secrets{" "}
            <span className="text-brand tabular-nums">
              {ready}/{entries.length}
            </span>
          </span>
          <span className="text-zinc-700">·</span>
          <span className="inline-flex items-center gap-1.5">
            Worker
            <span
              className={`status-dot ${checking ? "text-zinc-600" : online ? "text-success" : "text-danger"}`}
            />
            <span
              className={
                online ? "text-success" : checking ? "text-zinc-500" : "text-danger"
              }
            >
              {checking ? "…" : online ? "OK" : "DOWN"}
            </span>
          </span>
        </div>
      </header>

      <div className="px-4 lg:px-6 pt-3 pb-8">
        <div className="segment-group segment-group-fit mb-4">
          {PANES.map((p) => (
            <button
              key={p.id}
              type="button"
              data-active={pane === p.id}
              onClick={() => setPane(p.id)}
              className="segment"
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="max-w-lg">
          {pane === "account" && (
            <SurfacePanel>
              <div className="px-3.5 py-4 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-brand/15 text-brand flex items-center justify-center heading text-sm shrink-0 ring-1 ring-brand/25">
                  {initials || "A"}
                </div>
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold text-white truncate">
                    {userName}
                  </p>
                  <p className="metric text-[11px] text-zinc-500 truncate mt-0.5">
                    {userEmail}
                  </p>
                </div>
              </div>
              <SettingsRow
                title="Rôle"
                description="Compte unique — accès complet à la Platform."
                control={
                  <span className="metric text-[10px] uppercase tracking-wide text-gold px-2 py-1 rounded-md bg-gold/10">
                    Admin
                  </span>
                }
              />
              <SettingsRow
                title="Session"
                description="Déconnecte cet appareil et revient à l’écran de connexion."
                control={
                  <button
                    type="button"
                    disabled={signingOut}
                    onClick={() => void signOut()}
                    className="inline-flex items-center gap-1.5 metric text-[11px] text-danger hover:text-danger/80 transition-colors duration-140 disabled:opacity-40 touch-manipulation"
                  >
                    <LogOut className="w-3.5 h-3.5" strokeWidth={2} />
                    {signingOut ? "…" : "Déconnexion"}
                  </button>
                }
              />
            </SurfacePanel>
          )}

          {pane === "connections" && (
            <div className="space-y-3">
              <p className="text-[12px] text-zinc-500 px-0.5 leading-snug">
                Touche une connexion pour copier ses secrets. Les valeurs ne sont
                jamais affichées.
              </p>
              <SurfacePanel>
                {SETTINGS_INTEGRATIONS.map((integration) => {
                  const status = integrationStatus(integration, entries)
                  const open = openId === integration.id
                  return (
                    <div key={integration.id}>
                      <button
                        type="button"
                        onClick={() => setOpenId(open ? null : integration.id)}
                        className="w-full flex items-center gap-3 px-3.5 py-3 text-left hover:bg-brand/[0.04] transition-colors duration-140 touch-manipulation"
                      >
                        <span className="w-8 h-8 rounded-lg bg-well/80 border border-white/[0.06] flex items-center justify-center text-zinc-300 shrink-0">
                          {INTEGRATION_ICONS[integration.id]}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-[13px] font-medium text-white">
                              {integration.title}
                            </p>
                            <span className={`status-dot ${STATUS_DOT[status]}`} />
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-0.5 truncate">
                            {integration.description}
                          </p>
                        </div>
                        <span
                          className={`metric text-[10px] shrink-0 ${STATUS_TONE[status]}`}
                        >
                          {INTEGRATION_STATUS_LABELS[status]}
                        </span>
                        <ChevronDown
                          className={[
                            "w-4 h-4 text-zinc-600 shrink-0 transition-transform duration-140",
                            open ? "rotate-180" : "",
                          ].join(" ")}
                          strokeWidth={2}
                        />
                      </button>
                      {open && (
                        <div className="px-3 pb-3">
                          <div className="rounded-lg border border-white/[0.06] bg-well/50 divide-y divide-white/[0.04] overflow-hidden">
                            {integration.keys.map((key) => {
                              const entry = byKey.get(key)
                              if (!entry) return null
                              return <EnvKeyRow key={key} entry={entry} />
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </SurfacePanel>
            </div>
          )}

          {pane === "system" && (
            <div className="space-y-3">
              <SurfacePanel>
                <div className="px-3.5 py-3.5 flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-well/80 border border-white/[0.06] flex items-center justify-center text-zinc-300 shrink-0">
                    <Radio className="w-4 h-4" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-white">Worker</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      {checking
                        ? "Vérification du healthcheck…"
                        : online
                          ? `Répond · mode ${health?.mode ?? "inconnu"}`
                          : "Aucune réponse — génération impossible"}
                    </p>
                  </div>
                  <span
                    className={[
                      "status-dot shrink-0",
                      checking
                        ? "text-zinc-600 animate-pulse"
                        : online
                          ? "text-success animate-glow-pulse"
                          : "text-danger",
                    ].join(" ")}
                  />
                </div>
                <SettingsRow
                  title="Healthcheck"
                  description="Interroge le proxy Platform sans exposer le Worker."
                  control={
                    <button
                      type="button"
                      onClick={() => void checkWorker()}
                      disabled={checking}
                      className="metric text-[11px] px-2.5 py-1.5 rounded-lg border border-white/[0.1] text-zinc-200 hover:border-brand/40 hover:text-brand transition-[color,border-color] duration-140 disabled:opacity-40 touch-manipulation"
                    >
                      {checking ? "…" : "Vérifier"}
                    </button>
                  }
                />
              </SurfacePanel>

              <SurfacePanel>
                <SettingsRow
                  title="Variables d’environnement"
                  description="Liste technique complète — debug uniquement."
                  control={
                    <button
                      type="button"
                      onClick={() => setShowEnvDump((v) => !v)}
                      className="metric text-[11px] text-zinc-400 hover:text-brand transition-colors duration-140 touch-manipulation"
                    >
                      {showEnvDump ? "Masquer" : "Voir"}
                    </button>
                  }
                />
                {showEnvDump && (
                  <div className="px-3 pb-3">
                    <div className="rounded-lg border border-white/[0.06] bg-well/50 divide-y divide-white/[0.04] overflow-hidden">
                      {entries.map((entry) => (
                        <EnvKeyRow key={entry.key} entry={entry} />
                      ))}
                    </div>
                    <p className="metric text-[9px] text-zinc-600 mt-2 px-0.5">
                      Valeurs jamais affichées — copie uniquement.
                    </p>
                  </div>
                )}
              </SurfacePanel>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
