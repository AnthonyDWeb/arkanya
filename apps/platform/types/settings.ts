export type SettingsEnvKey =
  | "NEXT_PUBLIC_APP_URL"
  | "DATABASE_URL"
  | "BETTER_AUTH_SECRET"
  | "WORKER_URL"
  | "WORKER_API_KEY"
  | "GITHUB_TOKEN"
  | "GITHUB_OWNER"
  | "VERCEL_TOKEN"
  | "VERCEL_ORG_ID"

export type SettingsEnvEntry = {
  key: SettingsEnvKey
  configured: boolean
}

export type WorkerHealth = {
  status: string
  mode?: string
}

export type WorkerUiStatus = "checking" | "online" | "offline"
