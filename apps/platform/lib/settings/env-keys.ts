import type { SettingsEnvEntry, SettingsEnvKey } from "@/types/settings"

export const SETTINGS_ENV_KEYS: readonly SettingsEnvKey[] = [
  "NEXT_PUBLIC_APP_URL",
  "DATABASE_URL",
  "BETTER_AUTH_SECRET",
  "WORKER_URL",
  "WORKER_API_KEY",
  "GITHUB_TOKEN",
  "GITHUB_OWNER",
  "VERCEL_TOKEN",
  "VERCEL_ORG_ID",
] as const

export function isEnvConfigured(key: string): boolean {
  const value = process.env[key]
  return Boolean(value && value.trim().length > 0)
}

export function buildSettingsEnvEntries(): SettingsEnvEntry[] {
  return SETTINGS_ENV_KEYS.map((key) => ({
    key,
    configured: isEnvConfigured(key),
  }))
}
