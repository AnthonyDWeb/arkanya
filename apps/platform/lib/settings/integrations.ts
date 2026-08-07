import type { SettingsEnvEntry, SettingsEnvKey } from "@/types/settings"

export type SettingsIntegrationId =
  | "app"
  | "auth"
  | "database"
  | "github"
  | "vercel"
  | "worker"

export type SettingsIntegration = {
  id: SettingsIntegrationId
  title: string
  description: string
  keys: SettingsEnvKey[]
}

export const SETTINGS_INTEGRATIONS: SettingsIntegration[] = [
  {
    id: "app",
    title: "Application",
    description: "URL publique de la Platform.",
    keys: ["NEXT_PUBLIC_APP_URL"],
  },
  {
    id: "auth",
    title: "Authentification",
    description: "Secret Better Auth pour les sessions.",
    keys: ["BETTER_AUTH_SECRET"],
  },
  {
    id: "database",
    title: "Base de données",
    description: "Connexion PostgreSQL (Prisma).",
    keys: ["DATABASE_URL"],
  },
  {
    id: "github",
    title: "GitHub",
    description: "Push des projets générés.",
    keys: ["GITHUB_TOKEN", "GITHUB_OWNER"],
  },
  {
    id: "vercel",
    title: "Vercel",
    description: "Déploiements automatiques.",
    keys: ["VERCEL_TOKEN", "VERCEL_ORG_ID"],
  },
  {
    id: "worker",
    title: "Worker",
    description: "Moteur de génération (local ou remote).",
    keys: ["WORKER_URL", "WORKER_API_KEY"],
  },
]

export type IntegrationStatus = "ready" | "partial" | "missing"

export function integrationStatus(
  integration: SettingsIntegration,
  entries: SettingsEnvEntry[],
): IntegrationStatus {
  const byKey = new Map(entries.map((e) => [e.key, e.configured]))
  const configured = integration.keys.filter((k) => byKey.get(k)).length
  if (configured === integration.keys.length) return "ready"
  if (configured === 0) return "missing"
  return "partial"
}

export const INTEGRATION_STATUS_LABELS: Record<IntegrationStatus, string> = {
  ready: "Configuré",
  partial: "Partiel",
  missing: "Manquant",
}
