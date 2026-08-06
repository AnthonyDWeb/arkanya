/**
 * Chemins surveillés pour l'Ignored Build Step (Vercel / Railway).
 * Exit 0 = skip deploy · Exit 1 = build
 *
 * Cibles dynamiques :
 *   product:<slug>  → products/<slug> + packages
 *   client:<slug>   → clients/<slug> + packages
 */

const PACKAGES = ["packages"]
const LOCKFILES = ["pnpm-lock.yaml", "pnpm-workspace.yaml", "package.json"]

/** @type {Record<string, { paths: string[]; root?: string; note?: string }>} */
export const projects = {
  platform: {
    root: "apps/platform",
    paths: [
      "apps/platform",
      "packages/database",
      "packages/better-auth",
      "packages/contracts",
      "packages/ui",
      "packages/config",
      ...LOCKFILES,
    ],
  },
  account: {
    root: "apps/account",
    paths: ["apps/account", "packages/config", ...LOCKFILES],
  },
  worker: {
    root: "services/worker",
    note: "Railway — Watch Paths ou ignoreCommand équivalent",
    paths: [
      "services/worker",
      "packages/contracts",
      "packages/config",
      "templates",
      "features",
      ...LOCKFILES,
    ],
  },
  "anthony-delforge": {
    root: "marketing/anthony-delforge",
    paths: ["marketing/anthony-delforge", ...PACKAGES, ...LOCKFILES],
  },
  "arkanya-website": {
    root: "marketing/arkanya-website",
    paths: ["marketing/arkanya-website", ...PACKAGES, ...LOCKFILES],
  },
  arknest: {
    root: "products/arknest",
    paths: ["products/arknest", ...PACKAGES, ...LOCKFILES],
  },
  arkcare: {
    root: "products/arkcare",
    paths: ["products/arkcare", ...PACKAGES, ...LOCKFILES],
  },
  lesservicesdemathilde: {
    root: "clients/lesservicesdemathilde",
    paths: ["clients/lesservicesdemathilde", ...PACKAGES, ...LOCKFILES],
  },
}

/**
 * Produits internes (products/*) et clients Arkanya (clients/*) :
 * résolution générique si la cible n'est pas listée ci-dessus.
 */
export function resolveDynamicTarget(target) {
  const productMatch = target.match(/^product:(.+)$/)
  if (productMatch) {
    const slug = productMatch[1]
    return {
      root: `products/${slug}`,
      paths: [`products/${slug}`, ...PACKAGES, ...LOCKFILES],
    }
  }

  const clientMatch = target.match(/^client:(.+)$/)
  if (clientMatch) {
    const slug = clientMatch[1]
    return {
      root: `clients/${slug}`,
      paths: [`clients/${slug}`, ...PACKAGES, ...LOCKFILES],
    }
  }

  return null
}
