import { auth } from "@/lib/auth"
import { toNextJsHandler } from "@arkanya/better-auth/next"

export const { GET, POST } = toNextJsHandler(auth)
