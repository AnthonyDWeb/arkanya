import { createArkanyaAuthClient } from "@arkanya/better-auth/client"

export const authClient = createArkanyaAuthClient({
  baseURL: process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000",
})
