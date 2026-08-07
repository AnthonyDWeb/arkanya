import type { ProjectStatus } from "@arkanya/database"

export const PROJECT_STATUSES: Array<{ id: ProjectStatus; label: string }> = [
  { id: "TO_QUALIFY", label: "À qualifier" },
  { id: "IN_PROGRESS", label: "En cours" },
  { id: "IN_REVIEW", label: "En validation" },
]

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  TO_QUALIFY: "À QUALIFIER",
  IN_PROGRESS: "EN COURS",
  IN_REVIEW: "EN VALIDATION",
}

export const PROJECT_STATUS_SET = new Set<ProjectStatus>(
  PROJECT_STATUSES.map((s) => s.id),
)
