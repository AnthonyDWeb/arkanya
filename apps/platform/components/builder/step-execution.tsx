"use client"

import { useState, useEffect, useRef } from "react"
import type { WorkerReport, WorkerStepReport } from "@arkanya/contracts/worker"

type StepExecutionProps = {
  running: boolean
  liveSteps: WorkerStepReport[]
  liveMessage: string | null
  report: WorkerReport | null
  error: string | null
  onReset: () => void
  onRetry: () => void
}

const PIPELINE_STEPS: Array<{ id: string; label: string }> = [
  { id: "initialize", label: "Initialisation" },
  { id: "scaffold", label: "Scaffold template" },
  { id: "feature", label: "Installation features" },
  { id: "validate", label: "Validation (npm + build)" },
  { id: "delivery", label: "Livraison" },
]

function formatMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`
  const m = Math.floor(ms / 60_000)
  const s = Math.floor((ms % 60_000) / 1000)
  return `${m}m ${s}s`
}

function formatMsVerbose(ms: number): string {
  const min = Math.floor(ms / 60_000)
  const sec = Math.floor((ms % 60_000) / 1000)
  const rem = ms % 1000
  if (min > 0) return `${min}m ${sec}s ${rem}ms`
  if (sec > 0) return `${sec}s ${rem}ms`
  return `${rem}ms`
}

function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

type StepRowProps = {
  label: string
  stepReport: WorkerStepReport | undefined
  isNext: boolean
  detail?: string | null
}

function StepRow({ label, stepReport, isNext, detail }: StepRowProps) {
  const state = stepReport?.state

  return (
    <div className="py-3 border-b border-zinc-800 last:border-0">
      <div className="flex items-center gap-3">
        <div className="shrink-0">
          {state === "SUCCESS" && (
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg viewBox="0 0 10 8" className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4l3 3 5-6" />
              </svg>
            </div>
          )}
          {state === "ERROR" && (
            <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg viewBox="0 0 8 8" className="w-2.5 h-2.5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 1l6 6M7 1l-6 6" />
              </svg>
            </div>
          )}
          {state === "SKIPPED" && (
            <div className="w-5 h-5 rounded-full border border-zinc-700 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-zinc-600" />
            </div>
          )}
          {!state && isNext && (
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!state && !isNext && (
            <div className="w-5 h-5 rounded-full border border-zinc-800" />
          )}
        </div>

        <span
          className={[
            "flex-1 text-sm transition-colors duration-300",
            state === "SUCCESS"
              ? "text-zinc-200"
              : state === "ERROR"
                ? "text-red-400"
                : isNext
                  ? "text-zinc-300"
                  : "text-zinc-600",
          ].join(" ")}
        >
          {label}
        </span>

        <span className="text-xs tabular-nums shrink-0 w-16 text-right">
          {state && stepReport?.durationMs !== undefined && stepReport.durationMs !== null ? (
            <span className={state === "SUCCESS" ? "text-zinc-400" : "text-red-500"}>
              {formatMs(stepReport.durationMs)}
            </span>
          ) : isNext ? (
            <span className="text-zinc-600 animate-pulse">…</span>
          ) : (
            <span className="text-zinc-800">—</span>
          )}
        </span>
      </div>

      {detail && (isNext || state === "ERROR") && (
        <p className="mt-1.5 ml-8 text-xs text-zinc-500 font-mono truncate">{detail}</p>
      )}
    </div>
  )
}

const GENERATION_STEPS = new Set(["initialize", "scaffold", "feature"])
const DELIVERY_STEPS = new Set(["delivery"])
const VALIDATE_STEPS = new Set(["validate"])

function sumMs(steps: WorkerStepReport[], ids: Set<string>): number {
  return steps
    .filter((s) => ids.has(s.stepType) && s.durationMs != null)
    .reduce((acc, s) => acc + (s.durationMs ?? 0), 0)
}

function StepDurationBreakdown({ steps }: { steps: WorkerStepReport[] }) {
  const genMs = sumMs(steps, GENERATION_STEPS)
  const delivMs = sumMs(steps, DELIVERY_STEPS)
  const valMs = sumMs(steps, VALIDATE_STEPS)
  const totalMs = genMs + delivMs + valMs

  return (
    <div className="flex gap-4 text-xs">
      <div>
        <span className="text-zinc-600">Génération</span>
        <p className="text-zinc-400 font-mono mt-0.5">{formatMsVerbose(genMs)}</p>
      </div>
      <div>
        <span className="text-zinc-600">Livraison</span>
        <p className="text-zinc-400 font-mono mt-0.5">{formatMsVerbose(delivMs)}</p>
      </div>
      <div>
        <span className="text-zinc-600">Validation</span>
        <p className="text-zinc-400 font-mono mt-0.5">{formatMsVerbose(valMs)}</p>
      </div>
      <div className="ml-2 pl-3 border-l border-zinc-700/60">
        <span className="text-zinc-500">Total</span>
        <p className="text-zinc-200 font-mono font-medium mt-0.5">{formatMsVerbose(totalMs)}</p>
      </div>
    </div>
  )
}

export function StepExecution({
  running,
  liveSteps,
  liveMessage,
  report,
  error,
  onReset,
  onRetry,
}: StepExecutionProps) {
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (running) {
      startRef.current = Date.now()
      setElapsed(0)
      intervalRef.current = setInterval(() => {
        if (startRef.current !== null) {
          setElapsed(Math.floor((Date.now() - startRef.current) / 1000))
        }
      }, 1000)
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current)
    }
  }, [running])

  const totalMs = report?.durationMs ?? null
  const failed = Boolean(error || report?.state === "ERROR")

  const stepMap = new Map<string, WorkerStepReport>()
  const sourceSteps = report ? report.steps : liveSteps
  for (const step of sourceSteps) {
    stepMap.set(step.stepType, step)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {running ? (
            <>
              <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
              <span className="text-sm font-medium text-zinc-300">Génération en cours…</span>
            </>
          ) : report ? (
            <>
              <div className={`w-2 h-2 rounded-full ${report.state === "SUCCESS" ? "bg-emerald-400" : "bg-red-400"}`} />
              <span className={`text-sm font-semibold ${report.state === "SUCCESS" ? "text-emerald-400" : "text-red-400"}`}>
                {report.state === "SUCCESS" ? "Génération réussie" : "La génération a échoué"}
              </span>
            </>
          ) : error ? (
            <>
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-sm font-semibold text-red-400">Erreur</span>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-1.5 font-mono">
          <svg viewBox="0 0 12 12" className="w-3 h-3 text-zinc-600" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="6" cy="6" r="5" />
            <path d="M6 3v3l2 1.5" />
          </svg>
          <span className={`text-sm tabular-nums ${running ? "text-zinc-300" : "text-zinc-500"}`}>
            {totalMs !== null ? formatMs(totalMs) : formatClock(elapsed)}
          </span>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 px-5">
        {PIPELINE_STEPS.map((step, i) => {
          const done = stepMap.has(step.id)
          const prevDone = i === 0 || stepMap.has(PIPELINE_STEPS[i - 1]!.id)
          const isNext = running && !done && prevDone
          const stepReport = stepMap.get(step.id)
          const detail =
            step.id === "delivery"
              ? (isNext ? liveMessage : stepReport?.message) ?? null
              : stepReport?.state === "ERROR"
                ? (stepReport.message ?? null)
                : null
          return (
            <StepRow
              key={step.id}
              label={step.label}
              stepReport={stepReport}
              isNext={isNext}
              detail={detail}
            />
          )
        })}
      </div>

      {!running && error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-xs text-red-300/80 font-mono break-all">{error}</p>
        </div>
      )}

      {!running && report?.error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-xs font-medium text-red-400 mb-1">Erreur pipeline</p>
          <p className="text-xs text-red-300/70 font-mono break-all">{report.error}</p>
        </div>
      )}

      {!running && report?.state === "SUCCESS" && (
        <div className="p-4 bg-zinc-800/40 rounded-lg border border-zinc-700/40 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Projet{" "}
              <code className="text-zinc-200 font-mono">{report.projectSlug}</code>{" "}
              généré avec succès.
            </p>
            <a
              href={`/projects/${report.projectSlug}`}
              className="text-xs text-brand hover:underline shrink-0"
            >
              Voir le projet →
            </a>
          </div>
          <StepDurationBreakdown steps={report.steps} />
        </div>
      )}

      {!running && (report ?? error) && (
        <div className="flex items-center gap-3">
          {failed && (
            <button
              type="button"
              onClick={onRetry}
              className="px-5 py-2 bg-brand text-white rounded-lg text-sm font-medium transition-opacity duration-[120ms] ease-out hover:opacity-90"
            >
              Redéployer
            </button>
          )}
          <button
            type="button"
            onClick={onReset}
            className="px-5 py-2 text-zinc-400 hover:text-zinc-200 rounded-lg text-sm transition-colors duration-[120ms] ease-out"
          >
            ← Nouveau projet
          </button>
        </div>
      )}
    </div>
  )
}
