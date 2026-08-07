"use client"

import { useState } from "react"
import type { TemplateSummary, FeatureSummary, ClientOption, BuilderState, BuilderStep } from "./types"
import { INITIAL_STATE, BUILDER_STEPS } from "./types"
import type { WorkerReport } from "@arkanya/contracts/worker"
import { runWorkerJob } from "@/lib/actions/worker-run"
import { StepProject } from "./step-project"
import { StepTemplate } from "./step-template"
import { StepPages } from "./step-pages"
import { StepConfig } from "./step-config"
import { StepFeatures } from "./step-features"
import { StepDelivery } from "./step-delivery"
import { StepSummary } from "./step-summary"
import { StepExecution } from "./step-execution"
import { formatEstimateMs, useBuilderEstimate } from "./use-builder-estimate"
import { buildWorkerPayload } from "@/lib/builder/payload"

type BuilderWizardProps = {
  templates: TemplateSummary[]
  features: FeatureSummary[]
  clients: ClientOption[]
}

function StepIndicator({
  steps,
  current,
}: {
  steps: typeof BUILDER_STEPS
  current: BuilderStep
}) {
  const currentIndex = steps.findIndex((s) => s.id === current)

  return (
    <ol className="flex items-center justify-center gap-1 w-fit max-w-full mx-auto overflow-x-auto">
      {steps.map((step, i) => {
        const done = i < currentIndex
        const active = step.id === current
        return (
          <li key={step.id} className="flex items-center gap-1.5 shrink-0">
            {i > 0 && (
              <span
                className={[
                  "w-3 h-px mx-0.5 rounded-full",
                  done || active ? "bg-brand/50" : "bg-white/10",
                ].join(" ")}
              />
            )}
            <div
              className={[
                "w-6 h-6 rounded-full flex items-center justify-center metric text-[10px] shrink-0 transition-colors duration-140",
                done
                  ? "bg-brand text-[var(--color-ink-on-brand)]"
                  : active
                    ? "bg-brand/15 text-brand ring-1 ring-brand/50"
                    : "bg-elevated text-zinc-600",
              ].join(" ")}
            >
              {done ? (
                <svg
                  viewBox="0 0 10 8"
                  className="w-2.5 h-2.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 4l3 3 5-6" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={[
                "text-[11px] hidden xl:inline",
                active
                  ? "text-zinc-100 font-medium"
                  : done
                    ? "text-zinc-500"
                    : "text-zinc-600",
              ].join(" ")}
            >
              {step.label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export function BuilderWizard({ templates, features, clients }: BuilderWizardProps) {
  const [currentStep, setCurrentStep] = useState<BuilderStep>("project")
  const [state, setState] = useState<BuilderState>(INITIAL_STATE)
  const [report, setReport] = useState<WorkerReport | null>(null)
  const [execError, setExecError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [liveSteps, setLiveSteps] = useState<WorkerReport["steps"]>([])
  const [liveMessage, setLiveMessage] = useState<string | null>(null)

  function patch(partial: Partial<BuilderState>) {
    setState((prev) => ({ ...prev, ...partial }))
  }

  function next() {
    const idx = BUILDER_STEPS.findIndex((s) => s.id === currentStep)
    if (idx < BUILDER_STEPS.length - 1) {
      setCurrentStep(BUILDER_STEPS[idx + 1]!.id)
    }
  }

  function back() {
    const idx = BUILDER_STEPS.findIndex((s) => s.id === currentStep)
    if (idx > 0) {
      setCurrentStep(BUILDER_STEPS[idx - 1]!.id)
    }
  }

  function reset() {
    setState(INITIAL_STATE)
    setReport(null)
    setExecError(null)
    setRunning(false)
    setLiveSteps([])
    setLiveMessage(null)
    setCurrentStep("project")
  }

  async function launch() {
    setCurrentStep("execution")
    setRunning(true)
    setReport(null)
    setExecError(null)
    setLiveSteps([])
    setLiveMessage(null)

    const jobId = crypto.randomUUID()

    let pollInterval: ReturnType<typeof setInterval> | null = null
    let eventSource: EventSource | null = null

    function applyProgress(data: unknown) {
      if (data && typeof data === "object" && "steps" in data) {
        const progress = data as {
          steps: WorkerReport["steps"]
          currentMessage?: string
        }
        setLiveSteps(progress.steps)
        setLiveMessage(progress.currentMessage ?? null)
      }
    }

    function startPollFallback() {
      if (pollInterval) return
      pollInterval = setInterval(() => {
        void fetch(`/api/worker/progress/${jobId}`)
          .then((r) => r.json())
          .then(applyProgress)
          .catch(() => undefined)
      }, 800)
    }

    try {
      eventSource = new EventSource(`/api/worker/events/${jobId}`)
      eventSource.addEventListener("progress", (event) => {
        try {
          applyProgress(JSON.parse(event.data) as unknown)
        } catch {
          /* ignore malformed */
        }
      })
      eventSource.onerror = () => {
        eventSource?.close()
        eventSource = null
        startPollFallback()
      }
    } catch {
      startPollFallback()
    }

    const payload = buildWorkerPayload(state, jobId)

    try {
      const result = await runWorkerJob(payload)

      if (!result.ok) {
        setExecError(result.error)
      } else if (result.data.state !== "SUCCESS") {
        setExecError(result.data.error ?? "Génération échouée")
        setReport(result.data)
      } else {
        setReport(result.data)
      }
    } catch (err) {
      setExecError(err instanceof Error ? err.message : "Erreur réseau")
    } finally {
      eventSource?.close()
      if (pollInterval) clearInterval(pollInterval)
      setRunning(false)
    }
  }

  const isExecution = currentStep === "execution"
  const estimate = useBuilderEstimate(state)

  return (
    <div className="h-full flex flex-col min-h-0 gap-3">
      {!isExecution && (
        <div className="shrink-0 flex justify-center">
          <div className="rounded-xl border border-white/[0.08] bg-surface/80 px-3 py-2 w-fit max-w-full">
            <StepIndicator steps={BUILDER_STEPS} current={currentStep} />
          </div>
        </div>
      )}

      <div
        className={[
          "flex-1 min-h-0",
          isExecution
            ? "flex justify-center items-start overflow-y-auto pt-2"
            : "flex flex-wrap justify-around items-start content-start gap-4 pt-2",
        ].join(" ")}
      >
        <div
          className={[
            "min-w-0",
            isExecution ? "w-full" : "w-full max-w-xl h-fit chassis",
          ].join(" ")}
        >
          <div className={isExecution ? "" : "p-3"}>
            {currentStep === "project" && (
              <StepProject
                state={state}
                clients={clients}
                onChange={patch}
                onNext={next}
              />
            )}
            {currentStep === "template" && (
              <StepTemplate
                state={state}
                templates={templates}
                onChange={patch}
                onNext={next}
                onBack={back}
              />
            )}
            {currentStep === "pages" && (
              <StepPages
                state={state}
                onChange={patch}
                onNext={next}
                onBack={back}
              />
            )}
            {currentStep === "config" && (
              <StepConfig
                state={state}
                onChange={patch}
                onNext={next}
                onBack={back}
              />
            )}
            {currentStep === "features" && (
              <StepFeatures
                state={state}
                features={features}
                onChange={patch}
                onNext={next}
                onBack={back}
              />
            )}
            {currentStep === "delivery" && (
              <StepDelivery
                state={state}
                onChange={patch}
                onNext={next}
                onBack={back}
              />
            )}
            {currentStep === "summary" && (
              <StepSummary
                state={state}
                onLaunch={() => void launch()}
                onBack={back}
              />
            )}
            {currentStep === "execution" && (
              <StepExecution
                running={running}
                liveSteps={liveSteps}
                liveMessage={liveMessage}
                report={report}
                error={execError}
                onReset={reset}
                onRetry={() => void launch()}
              />
            )}
          </div>
        </div>

        {!isExecution && (
          <aside className="w-full max-w-[14rem] shrink-0 hidden lg:flex flex-col gap-2 h-fit">
            <div className="rounded-xl border border-white/[0.08] bg-surface/80 p-3">
              <p className="metric text-[10px] text-gold mb-2">Résumé en direct</p>
              <div className="space-y-2 text-[11px]">
                {state.name ? (
                  <div>
                    <span className="metric text-[10px] text-zinc-500">Projet</span>
                    <p className="text-zinc-100 font-medium mt-0.5 truncate">{state.name}</p>
                  </div>
                ) : (
                  <p className="text-zinc-500">Configure le pipeline…</p>
                )}
                {state.slug && (
                  <div>
                    <span className="metric text-[10px] text-zinc-500">Slug</span>
                    <p className="metric text-gold/90 mt-0.5 truncate">
                      {state.kind === "client" ? "clients/" : "products/"}
                      {state.slug}
                    </p>
                  </div>
                )}
                {state.template && (
                  <div>
                    <span className="metric text-[10px] text-zinc-500">Modèle</span>
                    <p className="text-zinc-300 mt-0.5 truncate">
                      {state.templateData?.name ?? state.template}
                    </p>
                  </div>
                )}
                {state.pages.filter((p) => p.enabled).length > 0 && (
                  <div>
                    <span className="metric text-[10px] text-zinc-500">Pages</span>
                    <div className="mt-0.5 space-y-px">
                      {state.pages
                        .filter((p) => p.enabled)
                        .map((p) => (
                          <p key={p.id} className="metric text-gold/80 truncate">
                            {state.template === "landing-page" && p.source !== "custom"
                              ? `#${p.slug || p.id}`
                              : `/${p.slug || ""}`}
                          </p>
                        ))}
                    </div>
                  </div>
                )}
                {(state.config["primary-color"] ?? state.config["secondary-color"]) && (
                  <div>
                    <span className="metric text-[10px] text-zinc-500">Couleurs</span>
                    <div className="flex gap-1.5 mt-1">
                      {state.config["primary-color"] && (
                        <div
                          className="w-4 h-4 rounded-full border border-white/10"
                          style={{ backgroundColor: state.config["primary-color"] }}
                          title={state.config["primary-color"]}
                        />
                      )}
                      {state.config["secondary-color"] && (
                        <div
                          className="w-4 h-4 rounded-full border border-white/10"
                          style={{ backgroundColor: state.config["secondary-color"] }}
                          title={state.config["secondary-color"]}
                        />
                      )}
                    </div>
                  </div>
                )}
                {state.features.length > 0 && (
                  <div>
                    <span className="metric text-[10px] text-zinc-500">Fonctionnalités</span>
                    <div className="mt-0.5 space-y-px">
                      {state.features.map((f) => (
                        <p key={f} className="text-zinc-400 truncate">
                          {f}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                {state.delivery.targets.length > 0 && (
                  <div>
                    <span className="metric text-[10px] text-zinc-500">Livraison</span>
                    <p className="text-zinc-400 mt-0.5 truncate">
                      {state.delivery.targets.join(" · ")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-surface/80 p-3">
              <p className="metric text-[10px] text-zinc-400 mb-1">Temps estimé</p>
              {!state.template ? (
                <p className="text-[11px] text-zinc-500">Choisissez un modèle</p>
              ) : estimate.loading ? (
                <p className="text-[11px] text-zinc-500">Calcul…</p>
              ) : estimate.known === 0 ? (
                <p className="text-[11px] text-zinc-500">Pas encore de données</p>
              ) : (
                <p className="heading text-lg text-brand tabular-nums leading-none">
                  ~{formatEstimateMs(Math.round(estimate.totalAvgMs))}
                </p>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
