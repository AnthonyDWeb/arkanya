import type { NextConfig } from "next"
import path from "node:path"

const nextConfig: NextConfig = {
  // Racine monorepo pour que Next retrouve @prisma/client / .prisma dans le store pnpm
  outputFileTracingRoot: path.join(process.cwd(), "../.."),
  serverExternalPackages: ["@prisma/client"],
}

export default nextConfig
