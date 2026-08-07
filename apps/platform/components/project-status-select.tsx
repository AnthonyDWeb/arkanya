"use client"

import type { ProjectStatus } from "@arkanya/database"
import { useRouter } from "next/navigation"
import { useState } from "react"

type ProjectStatusSelectProps = {
  slug: string
  value: ProjectStatus
}

const STATUSES: Array<{ id: ProjectStatus; label: string }> = [
  { id: "TO_QUALIFY", label: "À qualifier" },
  { id: "IN_PROGRESS", label: "En cours" },
  { id: "IN_REVIEW", label: "En validation" },
]

export function ProjectStatusSelect({ slug, value }: ProjectStatusSelectProps) {
  const router = useRouter()
  const [status, setStatus] = useState<ProjectStatus>(value)
  const [saving, setSaving] = useState(false)

  async function changeStatus(next: ProjectStatus) {
    if (next === status) return
    const prev = status
    setStatus(next)
    setSaving(true)
    try {
      const res = await fetch(`/api/projects/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) setStatus(prev)
      else router.refresh()
    } catch {
      setStatus(prev)
    } finally {
      setSaving(false)
    }
  }

  return (
    <select
      value={status}
      disabled={saving}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => void changeStatus(e.target.value as ProjectStatus)}
      className="status-chip"
      aria-label="Statut du projet"
    >
      {STATUSES.map((s) => (
        <option key={s.id} value={s.id}>
          {s.label}
        </option>
      ))}
    </select>
  )
}
