export const JOB_STATE_COLORS: Record<string, string> = {
  SUCCESS: "text-success",
  ERROR: "text-danger",
  RUNNING: "text-brand",
  PENDING: "text-zinc-500",
}

export const JOB_STATE_LABELS: Record<string, string> = {
  SUCCESS: "Succès",
  ERROR: "Erreur",
  RUNNING: "En cours",
  PENDING: "Attente",
}

export const JOB_STATE_LABELS_LONG: Record<string, string> = {
  SUCCESS: "Succès",
  ERROR: "Erreur",
  RUNNING: "En cours",
  PENDING: "En attente",
}

export const JOB_ACTION_LABELS: Record<string, string> = {
  generate: "Génération",
  redeploy: "Redéploiement",
}

export function jobActionLabel(action: string): string {
  return JOB_ACTION_LABELS[action] ?? action
}

export const STEP_LABELS: Record<string, string> = {
  initialize: "Initialisation",
  scaffold: "Scaffold du modèle",
  feature: "Installation des fonctionnalités",
  delivery: "Livraison",
  validate: "Validation",
}

export const TIMING_CATEGORY_LABELS: Record<string, string> = {
  scaffold: "Scaffold",
  feature: "Fonctionnalité",
  validate: "Validation",
  delivery: "Livraison",
  initialize: "Initialisation",
}

export function formatJobDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatDurationShort(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`
  const m = Math.floor(ms / 60_000)
  const s = Math.round((ms % 60_000) / 1000)
  return `${m}m ${s}s`
}

export function shortId(id: string): string {
  return id.length > 12 ? `${id.slice(0, 8)}…` : id
}
