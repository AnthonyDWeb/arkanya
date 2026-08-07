"use client"

import { useEffect, useState } from "react"

/** Ease-out cubic — entrée snappy, fin douce. */
function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

/**
 * Progression 0 → 1 pour animer métriques / graphs depuis zéro.
 * Respecte prefers-reduced-motion (passe à 1 immédiatement).
 */
export function useRevealProgress(durationMs = 820): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (reduced) {
      setProgress(1)
      return
    }

    let frame = 0
    const start = performance.now()

    const tick = (now: number) => {
      const raw = Math.min(1, (now - start) / durationMs)
      setProgress(easeOutCubic(raw))
      if (raw < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [durationMs])

  return progress
}

export function revealInt(target: number, progress: number): number {
  return Math.round(target * progress)
}
