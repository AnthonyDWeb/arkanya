import type { BuilderPage, BuilderDelivery, BuilderStepType } from "./builder.ts"

export type WorkerProjectPayload = {
  jobId: string
  projectSlug: string
  projectName: string
  projectKind: "client" | "product"
  clientId?: string
  clientCompany?: string
  description: string
  objective?: string
  template: string
  pages: BuilderPage[]
  config: Record<string, string>
  features: string[]
  delivery: BuilderDelivery
}

export type ProjectManifest = WorkerProjectPayload

export type TimingEntry = {
  key: string
  label: string
  category: string
  durationMs: number
}

export type WorkerStepReport = {
  stepId: string
  stepType: BuilderStepType
  state: "SUCCESS" | "ERROR" | "SKIPPED"
  message?: string
  startedAt: string
  finishedAt?: string
  durationMs?: number
  timings?: TimingEntry[]
  url?: string
}

export type WorkerReport = {
  jobId: string
  projectSlug: string
  state: "SUCCESS" | "ERROR"
  steps: WorkerStepReport[]
  durationMs: number
  error?: string
}

export type RunBuilderStepInput = {
  payload: WorkerProjectPayload
  step: BuilderStepType
  projectDir: string
}
