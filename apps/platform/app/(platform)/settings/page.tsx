import type { Metadata } from "next"
import { MaintenancePanel } from "@/components/maintenance-panel"

export const metadata: Metadata = { title: "Paramètres" }
export const dynamic = "force-dynamic"

function flag(value: string | undefined): boolean {
  return Boolean(value && value.trim().length > 0)
}

export default function SettingsPage() {
  const workerUrl = process.env["WORKER_URL"] ?? "http://127.0.0.1:4000"
  const appUrl = process.env["NEXT_PUBLIC_APP_URL"] ?? "—"
  const githubOwner = process.env["GITHUB_OWNER"] ?? "—"

  const checks = [
    { label: "DATABASE_URL", ok: flag(process.env["DATABASE_URL"]) },
    { label: "BETTER_AUTH_SECRET", ok: flag(process.env["BETTER_AUTH_SECRET"]) },
    { label: "WORKER_URL", ok: flag(process.env["WORKER_URL"]) },
    { label: "WORKER_API_KEY", ok: flag(process.env["WORKER_API_KEY"]) },
    { label: "GITHUB_TOKEN", ok: flag(process.env["GITHUB_TOKEN"]) },
    { label: "GITHUB_OWNER", ok: flag(process.env["GITHUB_OWNER"]) },
    { label: "VERCEL_TOKEN", ok: flag(process.env["VERCEL_TOKEN"]) },
    { label: "VERCEL_ORG_ID", ok: flag(process.env["VERCEL_ORG_ID"]) },
  ]

  return (
    <div>
      <div className="px-4 lg:px-6 h-16 flex flex-col justify-center border-b border-zinc-800">
        <h1 className="text-xl font-semibold text-zinc-100">Paramètres</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Environnement Platform (valeurs non secrètes)</p>
      </div>

      <div className="p-4 lg:p-6 space-y-6 max-w-2xl">
        <div className="bg-zinc-800/40 rounded-lg border border-zinc-700/40 px-4 divide-y divide-zinc-800">
          <div className="py-3 flex justify-between gap-4 text-sm">
            <span className="text-zinc-500">App URL</span>
            <code className="text-zinc-300 font-mono text-xs break-all text-right">{appUrl}</code>
          </div>
          <div className="py-3 flex justify-between gap-4 text-sm">
            <span className="text-zinc-500">Worker URL</span>
            <code className="text-zinc-300 font-mono text-xs break-all text-right">{workerUrl}</code>
          </div>
          <div className="py-3 flex justify-between gap-4 text-sm">
            <span className="text-zinc-500">GitHub owner</span>
            <code className="text-zinc-300 font-mono text-xs">{githubOwner}</code>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
            Variables configurées
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {checks.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between px-3 py-2 bg-zinc-800/40 border border-zinc-700/40 rounded-lg"
              >
                <code className="text-xs text-zinc-400 font-mono">{item.label}</code>
                <span
                  className={[
                    "text-[10px] px-1.5 py-0.5 rounded",
                    item.ok
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-red-500/15 text-red-400",
                  ].join(" ")}
                >
                  {item.ok ? "OK" : "Manquant"}
                </span>
              </div>
            ))}
          </div>
        </div>

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
