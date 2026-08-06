import type { Metadata } from "next"
import { MaintenancePanel } from "@/components/maintenance-panel"
import { SettingsEnvPanel } from "@/components/settings-env-panel"

export const metadata: Metadata = { title: "Paramètres" }
export const dynamic = "force-dynamic"

function env(key: string): string {
  return process.env[key] ?? ""
}

export default function SettingsPage() {
  const publicInfo = [
    { label: "App URL", value: env("NEXT_PUBLIC_APP_URL") },
    { label: "Worker URL", value: env("WORKER_URL") || "http://127.0.0.1:4000" },
    { label: "GitHub owner", value: env("GITHUB_OWNER") },
  ]

  const entries = [
    { key: "DATABASE_URL", value: env("DATABASE_URL"), secret: true },
    { key: "BETTER_AUTH_SECRET", value: env("BETTER_AUTH_SECRET"), secret: true },
    { key: "WORKER_URL", value: env("WORKER_URL"), secret: false },
    { key: "WORKER_API_KEY", value: env("WORKER_API_KEY"), secret: true },
    { key: "GITHUB_TOKEN", value: env("GITHUB_TOKEN"), secret: true },
    { key: "GITHUB_OWNER", value: env("GITHUB_OWNER"), secret: false },
    { key: "VERCEL_TOKEN", value: env("VERCEL_TOKEN"), secret: true },
    { key: "VERCEL_ORG_ID", value: env("VERCEL_ORG_ID"), secret: true },
  ]

  return (
    <div>
      <div className="px-4 lg:px-6 h-16 flex flex-col justify-center border-b border-zinc-800">
        <h1 className="text-xl font-semibold text-zinc-100">Paramètres</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Environnement Platform — secrets masqués, copiables depuis ta session
        </p>
      </div>

      <div className="p-4 lg:p-6 space-y-8 max-w-2xl">
        <SettingsEnvPanel entries={entries} publicInfo={publicInfo} />

        <div>
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
            Santé
          </h2>
          <MaintenancePanel />
        </div>
      </div>
    </div>
  )
}
