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

  return (
    <div>
      <div className="px-4 lg:px-6 h-14 flex flex-col justify-center border-b border-zinc-800">
        <h1 className="text-lg font-semibold text-zinc-100">Paramètres</h1>
      </div>

      <div className="p-4 lg:p-6 space-y-6 max-w-lg">
        <SettingsEnvPanel entries={entries} />

        <div>
          <h2 className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-2">
            Santé
          </h2>
          <MaintenancePanel />
        </div>
      </div>
    </div>
  )
}
