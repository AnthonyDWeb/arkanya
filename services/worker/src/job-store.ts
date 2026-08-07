import type { WorkerStepReport } from "@arkanya/contracts/worker"

export type JobProgress = {
  steps: WorkerStepReport[]
  state: "RUNNING" | "SUCCESS" | "ERROR"
  /** Message live (ex. sous-étape livraison) */
  currentMessage?: string
}

type Listener = (progress: JobProgress) => void

export const jobStore = new Map<string, JobProgress>()
const listeners = new Map<string, Set<Listener>>()

export function setJobProgress(jobId: string, progress: JobProgress): void {
  jobStore.set(jobId, progress)
  const set = listeners.get(jobId)
  if (!set) return
  for (const listener of set) listener(progress)
}

export function setJobMessage(jobId: string, message: string): void {
  const current = jobStore.get(jobId)
  const next: JobProgress = current
    ? { ...current, currentMessage: message }
    : { steps: [], state: "RUNNING", currentMessage: message }
  setJobProgress(jobId, next)
}

export function subscribeJob(
  jobId: string,
  listener: Listener,
): () => void {
  let set = listeners.get(jobId)
  if (!set) {
    set = new Set()
    listeners.set(jobId, set)
  }
  set.add(listener)
  return () => {
    set!.delete(listener)
    if (set!.size === 0) listeners.delete(jobId)
  }
}
