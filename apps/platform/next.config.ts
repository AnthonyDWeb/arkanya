import type { NextConfig } from "next"
import path from "node:path"
import { fileURLToPath } from "node:url"

const monorepoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..")
const prismaClientPath = path.join(
  monorepoRoot,
  "packages/database/src/generated/client/**/*",
)

const nextConfig: NextConfig = {
  outputFileTracingRoot: monorepoRoot,
  outputFileTracingIncludes: {
    "/**": [prismaClientPath],
  },
  serverExternalPackages: ["@prisma/client", "prisma"],
}

export default nextConfig
