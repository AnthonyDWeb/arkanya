import type { ProjectEnvironment } from "@arkanya/database"

export const PROJECT_ENVIRONMENTS: Array<{
  id: ProjectEnvironment
  label: string
  hint: string
}> = [
  { id: "LOCAL", label: "Local", hint: "Développement sur machine" },
  { id: "ONLINE", label: "En ligne", hint: "Accessible via une URL" },
  { id: "PRODUCTION", label: "Production", hint: "Déployé et utilisable" },
]

export const PROJECT_ENVIRONMENT_LABELS: Record<ProjectEnvironment, string> = {
  LOCAL: "Local",
  ONLINE: "En ligne",
  PRODUCTION: "Production",
}

export const PROJECT_ENVIRONMENT_SET = new Set<ProjectEnvironment>(
  PROJECT_ENVIRONMENTS.map((e) => e.id),
)
