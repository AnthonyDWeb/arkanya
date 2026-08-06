import type { WorkerStepReport } from "@arkanya/contracts/worker"

export type JobProgress = {
  steps: WorkerStepReport[]
  state: "RUNNING" | "SUCCESS" | "ERROR"
  /** Message live (ex. sous-étape livraison) */
  currentMessage?: string
}

export const jobStore = new Map<string, JobProgress>()

export function setJobMessage(jobId: string, message: string): void {
  const current = jobStore.get(jobId)
  if (!current) {
    jobStore.set(jobId, { steps: [], state: "RUNNING", currentMessage: message })
    return
  }
  jobStore.set(jobId, { ...current, currentMessage: message })
}
