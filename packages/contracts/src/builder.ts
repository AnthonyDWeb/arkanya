export type BuilderPageSource = "template" | "custom"

export type BuilderPage = {
  id: string
  name: string
  slug: string
  source: BuilderPageSource
  enabled: boolean
}

export type BuilderStepType =
  | "initialize"
  | "scaffold"
  | "feature"
  | "delivery"
  | "validate"

export type BuilderStep = {
  type: BuilderStepType
  label: string
}

export type BuilderTaskType =
  | "project"
  | "template"
  | "pages"
  | "config"
  | "features"
  | "delivery"
  | "summary"
  | "execution"

export type BuilderTaskState = "IDLE" | "ACTIVE" | "COMPLETE" | "ERROR"

export type BuilderTask = {
  id: BuilderTaskType
  label: string
  state: BuilderTaskState
}

export type BuilderDeliveryTarget = "database" | "github" | "vercel"

export type BuilderDelivery = {
  targets: BuilderDeliveryTarget[]
  githubRepo?: string
  vercelProject?: string
}
