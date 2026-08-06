/**
 * Chemins surveillés pour l'Ignored Build Step (Vercel / Railway).
 * Exit 0 = skip deploy · Exit 1 = build
 *
 * Chaque projet ne regarde que ses deps packages réelles (pas tout packages/).
 */

const LOCKFILES = ["pnpm-lock.yaml", "pnpm-workspace.yaml", "package.json"]
const SHARED = ["packages/config", ...LOCKFILES]

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
      ...SHARED,
    ],
  },
  account: {
    root: "apps/account",
    paths: ["apps/account", ...SHARED],
  },
  worker: {
    root: "services/worker",
    note: "Railway — Watch Paths ou ignoreCommand équivalent",
    paths: [
      "services/worker",
      "packages/contracts",
      "templates",
      "features",
      ...SHARED,
    ],
  },
  "anthony-delforge": {
    root: "marketing/anthony-delforge",
    paths: [
      "marketing/anthony-delforge",
      "packages/brand",
      "packages/icons",
      "packages/ui",
      ...SHARED,
    ],
  },
  "arkanya-website": {
    root: "marketing/arkanya-website",
    paths: [
      "marketing/arkanya-website",
      "packages/brand",
      "packages/email",
      "packages/icons",
      "packages/ui",
      ...SHARED,
    ],
  },
  arknest: {
    root: "products/arknest",
    paths: [
      "products/arknest",
      "packages/auth-client",
      "packages/codes",
      "packages/icons",
      "packages/ui",
      ...SHARED,
    ],
  },
  arkcare: {
    root: "products/arkcare",
    paths: [
      "products/arkcare",
      "packages/auth-client",
      "packages/capacitor",
      "packages/codes",
      "packages/icons",
      "packages/ui",
      ...SHARED,
    ],
  },
  lesservicesdemathilde: {
    root: "clients/lesservicesdemathilde",
    paths: [
      "clients/lesservicesdemathilde",
      "packages/email",
      "packages/icons",
      "packages/ui",
      ...SHARED,
    ],
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
      paths: [`products/${slug}`, "packages", ...LOCKFILES],
    }
  }

  const clientMatch = target.match(/^client:(.+)$/)
  if (clientMatch) {
    const slug = clientMatch[1]
    return {
      root: `clients/${slug}`,
      paths: [`clients/${slug}`, "packages", ...LOCKFILES],
    }
  }

  return null
}
