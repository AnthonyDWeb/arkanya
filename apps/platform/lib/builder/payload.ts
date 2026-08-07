import type { WorkerProjectPayload } from "@arkanya/contracts/worker"
import type { BuilderState } from "@/types/builder"

export function buildWorkerPayload(
  state: BuilderState,
  jobId: string,
): WorkerProjectPayload {
  return {
    jobId,
    projectSlug: state.slug,
    projectName: state.name,
    projectKind: state.kind,
    clientId: state.clientId || undefined,
    description: state.description,
    objective: state.objective,
    template: state.template,
    pages: state.pages,
    config: state.config,
    features: state.features,
    delivery: state.delivery,
  }
}
