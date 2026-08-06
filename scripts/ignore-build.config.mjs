/**
 * Chemins surveillés pour l'Ignored Build Step (Vercel / Railway).
 * Exit 0 = skip deploy · Exit 1 = build
 *
 * Important : ne PAS surveiller pnpm-lock.yaml / package.json racine.
 * Un changement de lockfile rebuildait TOUS les projets Vercel.
 * Si une dep partagée change vraiment, le dossier packages/<name> change aussi.
 */

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
    ],
  },
  account: {
    root: "apps/account",
    paths: ["apps/account", "packages/config"],
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
    ],
  },
  "anthony-delforge": {
    root: "marketing/anthony-delforge",
    paths: [
      "marketing/anthony-delforge",
      "packages/brand",
      "packages/icons",
      "packages/ui",
      "packages/config",
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
      "packages/config",
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
      "packages/config",
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
      "packages/config",
    ],
  },
  lesservicesdemathilde: {
    root: "clients/lesservicesdemathilde",
    paths: [
      "clients/lesservicesdemathilde",
      "packages/email",
      "packages/icons",
      "packages/ui",
      "packages/config",
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
      paths: [`products/${slug}`, "packages"],
    }
  }

  const clientMatch = target.match(/^client:(.+)$/)
  if (clientMatch) {
    const slug = clientMatch[1]
    return {
      root: `clients/${slug}`,
      paths: [`clients/${slug}`, "packages"],
    }
  }

  return null
}
