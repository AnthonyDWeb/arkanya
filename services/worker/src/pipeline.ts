import type { WorkerProjectPayload, WorkerReport, WorkerStepReport } from "@arkanya/contracts/worker"
import { getProjectDir, runInitialize } from "./steps/initialize.js"
import { runScaffold } from "./steps/scaffold.js"
import { runFeature } from "./steps/feature.js"
import { runDelivery } from "./steps/delivery.js"
import { runValidate } from "./steps/validate.js"
import { jobStore, setJobMessage, setJobProgress } from "./job-store.js"

export async function runPipeline(payload: WorkerProjectPayload): Promise<WorkerReport> {
  const start = Date.now()
  const steps: WorkerStepReport[] = []

  setJobProgress(payload.jobId, { steps: [], state: "RUNNING" })

  function push(step: WorkerStepReport) {
    steps.push(step)
    setJobProgress(payload.jobId, {
      steps: [...steps],
      state: "RUNNING",
      currentMessage: undefined,
    })
  }

  const projectDir = getProjectDir(payload)

  const initReport = await runInitialize(payload)
  push(initReport)

  if (initReport.state === "ERROR") {
    const result: WorkerReport = {
      jobId: payload.jobId,
      projectSlug: payload.projectSlug,
      state: "ERROR",
      steps,
      durationMs: Date.now() - start,
      error: initReport.message,
    }
    setJobProgress(payload.jobId, { steps, state: "ERROR" })
    return result
  }

  const scaffoldReport = await runScaffold(payload, projectDir)
  push(scaffoldReport)

  if (scaffoldReport.state === "ERROR") {
    const result: WorkerReport = {
      jobId: payload.jobId,
      projectSlug: payload.projectSlug,
      state: "ERROR",
      steps,
      durationMs: Date.now() - start,
      error: scaffoldReport.message,
    }
    setJobProgress(payload.jobId, { steps, state: "ERROR" })
    return result
  }

  const featureReport = await runFeature(payload, projectDir)
  push(featureReport)

  if (featureReport.state === "ERROR") {
    const result: WorkerReport = {
      jobId: payload.jobId,
      projectSlug: payload.projectSlug,
      state: "ERROR",
      steps,
      durationMs: Date.now() - start,
      error: featureReport.message,
    }
    setJobProgress(payload.jobId, { steps, state: "ERROR" })
    return result
  }

  const validateReport = await runValidate(projectDir)
  push(validateReport)

  if (validateReport.state === "ERROR") {
    const result: WorkerReport = {
      jobId: payload.jobId,
      projectSlug: payload.projectSlug,
      state: "ERROR",
      steps,
      durationMs: Date.now() - start,
      error: validateReport.message,
    }
    setJobProgress(payload.jobId, { steps, state: "ERROR" })
    return result
  }

  setJobMessage(payload.jobId, "Livraison — démarrage")
  const deliveryReport = await runDelivery(payload, projectDir, (message) => {
    setJobMessage(payload.jobId, message)
  })
  push(deliveryReport)

  const finalState = deliveryReport.state === "ERROR" ? "ERROR" : "SUCCESS"

  const result: WorkerReport = {
    jobId: payload.jobId,
    projectSlug: payload.projectSlug,
    state: finalState,
    steps,
    durationMs: Date.now() - start,
    error: finalState === "ERROR" ? deliveryReport.message : undefined,
  }

  setJobProgress(payload.jobId, { steps, state: finalState })

  setTimeout(() => jobStore.delete(payload.jobId), 60_000)

  return result
}
