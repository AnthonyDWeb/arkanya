import type { Client, Job, JobEvent, JobTiming, Project } from "@arkanya/database"
import type { WorkerStepReport } from "@arkanya/contracts/worker"

export type ProjectWithClient = Project & { client: Client | null }

export type ProjectWithRelations = Project & {
  client: Client | null
  jobs: (Job & { events: JobEvent[]; timings: JobTiming[] })[]
}

export type ProjectDetailTab = "fiche" | "livraison" | "pipeline" | "offre"

export type JobWithProject = Job & { project: Project }

export type JobProgress = {
  steps: WorkerStepReport[]
  state: "RUNNING" | "SUCCESS" | "ERROR"
  currentMessage?: string
}
