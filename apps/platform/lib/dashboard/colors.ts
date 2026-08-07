/**
 * Code couleur dashboard — une teinte par type de donnée, nuances seulement.
 * Pas d’arc-en-ciel : chaque domaine garde sa famille, sans emprunter aux autres.
 *
 * | Domaine      | Teinte        | Usage                          |
 * |--------------|---------------|--------------------------------|
 * | Clients      | Corail        | ShareMap uniquement            |
 * | Pipeline     | Bleu ciel     | File / en cours / revue        |
 * | Destination  | Teal          | clients/ vs products/          |
 * | Catalogue    | Ardoise bleue | modèles + features             |
 * | Livraison    | Vert sauge    | en ligne / à livrer            |
 * | Jobs         | Vert / rouge  | sémantique succès / erreur     |
 */

/** Statuts client — nuances zinc/or pour ne pas empiéter sur le corail portefeuille. */
export const CLIENT_STATUS_COLORS = {
  prospect: "#d4a574",
  active: "#6aab8e",
  archived: "#71717a",
} as const

/** Corail — réservé aux barres portefeuille clients. */
export const CLIENT_BAR_PALETTE = [
  "#e8917a",
  "#d4725e",
  "#f0a894",
  "#c45f4c",
  "#e8b4a8",
  "#b54e3d",
] as const

/** Bleu ciel — pipeline statut. */
export const PIPELINE_COLORS = {
  TO_QUALIFY: "#5a9fd4",
  IN_PROGRESS: "#8bb8de",
  IN_REVIEW: "#b8d4eb",
} as const

/** Teal — destination filesystem. */
export const DEST_COLORS = {
  clients: "#5a9e96",
  products: "#8fbfb8",
} as const

/** Ardoise bleue — catalogue (modèles + features). */
export const CATALOG_PALETTE = [
  "#6b8cae",
  "#8aa3be",
  "#a9bbce",
  "#4f7399",
  "#c2cfdc",
  "#3d5c7a",
] as const

export const CATALOG = {
  primary: CATALOG_PALETTE[0],
  muted: CATALOG_PALETTE[1],
} as const

/** Vert sauge — livraison / déploiement. */
export const DELIVERY_COLORS = {
  live: "#6aab8e",
  pending: "#9dc4b0",
  /** Neutre clair — orphelins (pas de teinte métier). */
  orphan: "#e8eef2",
} as const

/** Sémantique jobs — exception volontaire. */
export const JOB_COLORS = {
  SUCCESS: "#3dd68c",
  ERROR: "#f07178",
  RUNNING: "#5a9fd4",
  PENDING: "#52525b",
} as const
