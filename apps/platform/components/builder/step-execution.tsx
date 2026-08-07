"use client"

import type { WorkerReport, WorkerStepReport } from "@arkanya/contracts/worker"
import { ArrowRight, RefreshCw } from "lucide-react"
import { useState, useEffect, useRef } from "react"

type StepExecutionProps = {
  running: boolean
  liveSteps: WorkerStepReport[]
  liveMessage: string | null
  report: WorkerReport | null
  error: string | null
  onReset: () => void
  onRetry: () => void
}

const PIPELINE_STEPS: Array<{ id: string; label: string; code: string }> = [
  { id: "initialize", label: "Initialisation", code: "INIT" },
  { id: "scaffold", label: "Scaffold du modèle", code: "ARCH" },
  { id: "feature", label: "Fonctionnalités", code: "FEAT" },
  { id: "validate", label: "Validation", code: "VAL" },
  { id: "delivery", label: "Livraison", code: "SHIP" },
]

const STATE_LABELS: Record<string, string> = {
  SUCCESS: "OK",
  ERROR: "Erreur",
  SKIPPED: "Ignoré",
}

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
  if (min > 0) return `${min}m ${sec}s ${String(rem).padStart(3, "0")}ms`
  if (sec > 0) return `${sec}s ${String(rem).padStart(3, "0")}ms`
  return `${rem}ms`
}

function formatClock(totalMs: number): string {
  const totalSeconds = Math.floor(totalMs / 1000)
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  const ms = totalMs % 1000
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(ms).padStart(3, "0")}`
}

type StepRowProps = {
  label: string
  code: string
  stepReport: WorkerStepReport | undefined
  isNext: boolean
  detail?: string | null
}

function StepRow({ label, code, stepReport, isNext, detail }: StepRowProps) {
  const state = stepReport?.state
  const isProcessing = !state && isNext

  return (
    <div
      className={[
        "relative px-2.5 py-1.5 border-b border-white/[0.05] last:border-0",
        isProcessing ? "bg-brand/5" : "",
      ].join(" ")}
    >
      {isProcessing && (
        <div className="progress-shimmer absolute inset-x-0 bottom-0 h-[2px]" />
      )}
      <div className="grid grid-cols-[2.25rem_auto_minmax(0,1fr)_auto_2.75rem] gap-x-2 items-center">
        <span
          className={[
            "metric text-[9px] tracking-[0.08em]",
            isProcessing
              ? "text-brand"
              : state === "SUCCESS"
                ? "text-zinc-500"
                : state === "ERROR"
                  ? "text-danger"
                  : "text-zinc-600",
          ].join(" ")}
        >
          {code}
        </span>

        <span className="flex justify-center w-2.5">
          {state === "SUCCESS" && <span className="status-dot text-success" />}
          {state === "ERROR" && <span className="status-dot text-danger" />}
          {state === "SKIPPED" && <span className="status-dot text-zinc-600" />}
          {isProcessing && (
            <span
              className="status-dot text-brand animate-glow-pulse"
              style={{
                boxShadow:
                  "0 0 8px 1px color-mix(in oklch, var(--color-arc) 50%, transparent)",
              }}
            />
          )}
          {!state && !isNext && <span className="status-dot text-zinc-700" />}
        </span>

        <span
          className={[
            "text-[12px] truncate",
            state === "SUCCESS"
              ? "text-zinc-200"
              : state === "ERROR"
                ? "text-danger"
                : isNext
                  ? "text-white font-medium"
                  : "text-zinc-500",
          ].join(" ")}
        >
          {label}
        </span>

        <span
          className={[
            "metric text-[9px] shrink-0",
            state === "SUCCESS"
              ? "text-success"
              : state === "ERROR"
                ? "text-danger"
                : isProcessing
                  ? "text-brand"
                  : "text-zinc-600",
          ].join(" ")}
        >
          {state
            ? (STATE_LABELS[state] ?? state)
            : isProcessing
              ? "En cours"
              : "Attente"}
        </span>

        <span className="metric text-[10px] tabular-nums text-right shrink-0">
          {state &&
          stepReport?.durationMs !== undefined &&
          stepReport.durationMs !== null ? (
            <span className={state === "SUCCESS" ? "text-zinc-400" : "text-danger"}>
              {formatMs(stepReport.durationMs)}
            </span>
          ) : isNext ? (
            <span className="text-brand/70 animate-pulse">…</span>
          ) : (
            <span className="text-zinc-700">—</span>
          )}
        </span>
      </div>

      {detail && (isNext || state === "ERROR") && (
        <p className="mt-1 pl-9 text-[10px] text-zinc-500 metric truncate">{detail}</p>
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
    <div className="grid grid-cols-2 gap-x-3 gap-y-2">
      <div>
        <span className="metric text-[9px] text-zinc-500">Génération</span>
        <p className="metric text-[11px] text-zinc-300 mt-0.5">{formatMsVerbose(genMs)}</p>
      </div>
      <div>
        <span className="metric text-[9px] text-zinc-500">Livraison</span>
        <p className="metric text-[11px] text-zinc-300 mt-0.5">{formatMsVerbose(delivMs)}</p>
      </div>
      <div>
        <span className="metric text-[9px] text-zinc-500">Validation</span>
        <p className="metric text-[11px] text-zinc-300 mt-0.5">{formatMsVerbose(valMs)}</p>
      </div>
      <div>
        <span className="metric text-[9px] text-zinc-500">Total</span>
        <p className="metric text-sm text-brand mt-0.5">{formatMsVerbose(totalMs)}</p>
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
  const [elapsedMs, setElapsedMs] = useState(0)
  const startRef = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (running) {
      startRef.current = Date.now()
      setElapsedMs(0)
      intervalRef.current = setInterval(() => {
        if (startRef.current !== null) {
          setElapsedMs(Date.now() - startRef.current)
        }
      }, 47)
    } else if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current)
    }
  }, [running])

  const totalMs = report?.durationMs ?? null
  const failed = Boolean(error || report?.state === "ERROR")
  const ready = Boolean(report?.state === "SUCCESS")

  const stepMap = new Map<string, WorkerStepReport>()
  const sourceSteps = report ? report.steps : liveSteps
  for (const step of sourceSteps) {
    stepMap.set(step.stepType, step)
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="metric text-[10px] text-zinc-400 mb-1">Pipeline</p>
          <h2
            className={[
              "heading text-xl leading-none",
              failed ? "text-danger" : "text-white",
            ].join(" ")}
          >
            {running ? "Génération" : ready ? "Prêt" : failed ? "Échec" : "Génération"}
          </h2>
          <div className="flex items-center gap-1.5 mt-1.5">
            {running && (
              <>
                <span className="status-dot text-brand animate-glow-pulse" />
                <span className="metric text-[10px] text-brand">En production</span>
              </>
            )}
            {ready && (
              <>
                <span className="status-dot text-success" />
                <span className="metric text-[10px] text-success">Terminé</span>
              </>
            )}
            {failed && !running && (
              <>
                <span className="status-dot text-danger" />
                <span className="metric text-[10px] text-danger">Interrompu</span>
              </>
            )}
          </div>
        </div>

        <span
          className={[
            "metric text-xl tabular-nums leading-none shrink-0",
            running ? "text-brand" : ready ? "text-zinc-300" : "text-zinc-500",
          ].join(" ")}
        >
          {totalMs !== null ? formatClock(totalMs) : formatClock(elapsedMs)}
        </span>
      </div>

      {running && <div className="h-px pipeline-energy bg-elevated" />}

      <div className="rounded-xl border border-white/[0.08] bg-surface/80 overflow-hidden">
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
              code={step.code}
              stepReport={stepReport}
              isNext={isNext}
              detail={detail}
            />
          )
        })}
      </div>

      {!running && error && (
        <div className="p-2.5 bg-danger/10 border border-danger/20 rounded-xl">
          <p className="metric text-[11px] text-danger/90 break-all">{error}</p>
        </div>
      )}

      {!running && report?.error && (
        <div className="p-2.5 bg-danger/10 border border-danger/20 rounded-xl">
          <p className="metric text-[10px] text-danger mb-0.5">Erreur pipeline</p>
          <p className="metric text-[11px] text-danger/70 break-all">{report.error}</p>
        </div>
      )}

      {!running && report?.state === "SUCCESS" && (
        <div className="rounded-xl border border-white/[0.08] bg-surface/80 p-3 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[12px] text-zinc-400 truncate">
              Projet{" "}
              <code className="metric text-zinc-100">{report.projectSlug}</code>{" "}
              généré.
            </p>
            <a
              href={`/projects/${report.projectSlug}`}
              title="Voir le projet"
              aria-label="Voir le projet"
              className="p-1.5 text-brand hover:opacity-80 transition-opacity shrink-0"
            >
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </a>
          </div>
          <StepDurationBreakdown steps={report.steps} />
        </div>
      )}

      {!running && (report ?? error) && (
        <div className="flex items-center gap-2 pt-0.5">
          {failed && (
            <button
              type="button"
              onClick={onRetry}
              title="Redéployer"
              aria-label="Redéployer"
              className="slab !p-2"
            >
              <RefreshCw className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          )}
          <button
            type="button"
            onClick={onReset}
            className="text-[12px] text-zinc-400 hover:text-zinc-200 transition-colors duration-140"
          >
            ← Nouveau projet
          </button>
        </div>
      )}
    </div>
  )
}
