import type { NextConfig } from "next"
import path from "node:path"

const nextConfig: NextConfig = {
  // Monorepo : inclure le moteur Prisma dans les fonctions Vercel
  outputFileTracingRoot: path.join(process.cwd(), "../.."),
  outputFileTracingIncludes: {
    "/**": [
      "./node_modules/.prisma/client/**/*",
      "./node_modules/@prisma/client/**/*",
      "../../node_modules/.prisma/client/**/*",
      "../../node_modules/@prisma/client/**/*",
      "../../node_modules/.pnpm/@prisma+client@*/node_modules/.prisma/client/**/*",
      "../../node_modules/.pnpm/@prisma+client@*/node_modules/@prisma/client/**/*",
      "../../packages/database/node_modules/.prisma/client/**/*",
      "../../packages/database/node_modules/@prisma/client/**/*",
    ],
  },
  serverExternalPackages: ["@prisma/client"],
}

export default nextConfig
