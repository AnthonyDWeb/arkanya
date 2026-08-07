import type { Metadata } from "next"
import { MaintenancePanel } from "@/components/maintenance-panel"
import { SettingsEnvPanel } from "@/components/settings-env-panel"

export const metadata: Metadata = { title: "Paramètres" }
export const dynamic = "force-dynamic"

function configured(key: string): boolean {
  const value = process.env[key]
  return Boolean(value && value.trim().length > 0)
}

export default function SettingsPage() {
  const entries = [
    { key: "NEXT_PUBLIC_APP_URL", configured: configured("NEXT_PUBLIC_APP_URL") },
    { key: "DATABASE_URL", configured: configured("DATABASE_URL") },
    { key: "BETTER_AUTH_SECRET", configured: configured("BETTER_AUTH_SECRET") },
    { key: "WORKER_URL", configured: configured("WORKER_URL") },
    { key: "WORKER_API_KEY", configured: configured("WORKER_API_KEY") },
    { key: "GITHUB_TOKEN", configured: configured("GITHUB_TOKEN") },
    { key: "GITHUB_OWNER", configured: configured("GITHUB_OWNER") },
    { key: "VERCEL_TOKEN", configured: configured("VERCEL_TOKEN") },
    { key: "VERCEL_ORG_ID", configured: configured("VERCEL_ORG_ID") },
  ]

  const ready = entries.filter((e) => e.configured).length

  return (
    <div className="animate-page-in">
      <header className="px-4 lg:px-6 pt-4 pb-3">
        <p className="metric text-[10px] tracking-[0.14em] text-gold uppercase mb-1.5">
          Système
        </p>
        <div className="flex items-baseline gap-3">
          <h1 className="page-title">Paramètres</h1>
          <span className="metric text-xs text-brand tabular-nums">
            {ready}/{entries.length} env
          </span>
        </div>
      </header>

      <div className="px-4 lg:px-6 pb-6">
        <div className="flex flex-wrap justify-around lg:justify-start items-start gap-3 max-w-3xl">
          <div className="w-full max-w-md">
            <SettingsEnvPanel entries={entries} />
          </div>
          <MaintenancePanel />
        </div>
      </div>
    </div>
  )
}
