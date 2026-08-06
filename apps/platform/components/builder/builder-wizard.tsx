"use client"

import { useState } from "react"
import type { TemplateSummary, FeatureSummary, ClientOption, BuilderState, BuilderStep } from "./types"
import { INITIAL_STATE, BUILDER_STEPS } from "./types"
import type { WorkerReport } from "@arkanya/contracts/worker"
import { StepProject } from "./step-project"
import { StepTemplate } from "./step-template"
import { StepPages } from "./step-pages"
import { StepConfig } from "./step-config"
import { StepFeatures } from "./step-features"
import { StepDelivery } from "./step-delivery"
import { StepSummary } from "./step-summary"
import { StepExecution } from "./step-execution"

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
    <ol className="flex items-center justify-between w-full">
      {steps.map((step, i) => {
        const done = i < currentIndex
        const active = step.id === current
        return (
          <li key={step.id} className="flex items-center gap-1.5 min-w-0">
            <div
              className={[
                "w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium shrink-0",
                done
                  ? "bg-brand text-white"
                  : active
                    ? "bg-brand-muted border border-brand text-brand-light"
                    : "bg-zinc-800 border border-zinc-700 text-zinc-600",
              ].join(" ")}
            >
              {done ? (
                <svg viewBox="0 0 10 8" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 4l3 3 5-6" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={`text-xs hidden sm:inline truncate ${active ? "text-zinc-200" : "text-zinc-600"}`}
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
    setCurrentStep("project")
  }

  async function launch() {
    setCurrentStep("execution")
    setRunning(true)
    setReport(null)
    setExecError(null)
    setLiveSteps([])

    const jobId = crypto.randomUUID()

    const pollInterval = setInterval(() => {
      void fetch(`/api/worker/progress/${jobId}`)
        .then((r) => r.json())
        .then((data: unknown) => {
          if (data && typeof data === "object" && "steps" in data) {
            const progress = data as { steps: WorkerReport["steps"] }
            setLiveSteps(progress.steps)
          }
        })
        .catch(() => undefined)
    }, 800)

    const payload = {
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

    try {
      const res = await fetch("/api/worker/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = (await res.json()) as WorkerReport | { error: string }

      if ("error" in data) {
        setExecError(data.error ?? "Erreur inconnue")
      } else {
        setReport(data)
      }
    } catch (err) {
      setExecError(err instanceof Error ? err.message : "Erreur réseau")
    } finally {
      clearInterval(pollInterval)
      setRunning(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <StepIndicator steps={BUILDER_STEPS} current={currentStep} />
      </div>

      <div className="flex gap-8 max-w-3xl mx-auto">
        <div className="flex-1 min-w-0">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
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
              report={report}
              error={execError}
              onReset={reset}
            />
          )}
          </div>
        </div>

        {currentStep !== "execution" && (
        <aside className="w-52 shrink-0 hidden lg:block">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
            Résumé en direct
          </p>
          <div className="space-y-2 text-xs">
            {state.name && (
              <div>
                <span className="text-zinc-600">Projet</span>
                <p className="text-zinc-300 font-medium mt-0.5 truncate">{state.name}</p>
              </div>
            )}
            {state.slug && (
              <div>
                <span className="text-zinc-600">Slug</span>
                <p className="text-zinc-400 font-mono mt-0.5 truncate">{state.slug}</p>
              </div>
            )}
            {state.template && (
              <div>
                <span className="text-zinc-600">Template</span>
                <p className="text-zinc-300 mt-0.5">{state.templateData?.name ?? state.template}</p>
              </div>
            )}
            {state.pages.filter((p) => p.enabled).length > 0 && (
              <div>
                <span className="text-zinc-600">Pages</span>
                <div className="mt-0.5 space-y-0.5">
                  {state.pages
                    .filter((p) => p.enabled)
                    .map((p) => (
                      <p key={p.id} className="text-zinc-400">
                        /{p.slug || ""}
                      </p>
                    ))}
                </div>
              </div>
            )}
            {(state.config["primary-color"] ?? state.config["secondary-color"]) && (
              <div>
                <span className="text-zinc-600">Couleurs</span>
                <div className="flex gap-1.5 mt-1">
                  {state.config["primary-color"] && (
                    <div
                      className="w-5 h-5 rounded border border-zinc-700"
                      style={{ backgroundColor: state.config["primary-color"] }}
                      title={state.config["primary-color"]}
                    />
                  )}
                  {state.config["secondary-color"] && (
                    <div
                      className="w-5 h-5 rounded border border-zinc-700"
                      style={{ backgroundColor: state.config["secondary-color"] }}
                      title={state.config["secondary-color"]}
                    />
                  )}
                </div>
              </div>
            )}
            {state.features.length > 0 && (
              <div>
                <span className="text-zinc-600">Features</span>
                <div className="mt-0.5 space-y-0.5">
                  {state.features.map((f) => (
                    <p key={f} className="text-zinc-400">{f}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
        )}
      </div>
    </div>
  )
}
