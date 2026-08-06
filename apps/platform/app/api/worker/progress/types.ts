import type { WorkerStepReport } from "@arkanya/contracts/worker"

export type JobProgress = {
  steps: WorkerStepReport[]
  state: "RUNNING" | "SUCCESS" | "ERROR"
}
