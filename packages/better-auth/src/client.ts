import { createAuthClient } from "better-auth/react"

export type ArkanyaAuthClientOptions = {
  /** Base URL du serveur Better Auth (même hôte que `/api/auth`). */
  baseURL?: string
}

export function createArkanyaAuthClient(options: ArkanyaAuthClientOptions = {}) {
  return createAuthClient({
    baseURL:
      options.baseURL ??
      process.env["NEXT_PUBLIC_BETTER_AUTH_URL"] ??
      process.env["NEXT_PUBLIC_APP_URL"] ??
      "http://127.0.0.1:3000",
  })
}

export type ArkanyaAuthClient = ReturnType<typeof createArkanyaAuthClient>
