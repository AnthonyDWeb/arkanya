import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@arkanya/database/client"

export type ArkanyaAuthOptions = {
  /** Origines autorisées (SSO cross-app, Capacitor, etc.). */
  trustedOrigins?: string[]
  /** URL publique de l’hôte auth (ex. http://127.0.0.1:3001). */
  baseURL?: string
  /** Secret Better Auth — défaut: BETTER_AUTH_SECRET. */
  secret?: string
}

export function createArkanyaAuth(options: ArkanyaAuthOptions = {}) {
  return betterAuth({
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),
    secret: options.secret ?? process.env["BETTER_AUTH_SECRET"],
    baseURL: options.baseURL ?? process.env["BETTER_AUTH_URL"] ?? process.env["NEXT_PUBLIC_APP_URL"],
    trustedOrigins: options.trustedOrigins,
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      // Platform = outil perso : jamais d’inscription (compte via script admin)
      disableSignUp: true,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
  })
}

export type ArkanyaAuth = ReturnType<typeof createArkanyaAuth>
