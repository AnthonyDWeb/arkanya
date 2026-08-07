"use client"

import { Loader2, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ConfirmActionModal } from "./confirm-action-modal"

type ProjectRedeployButtonProps = {
  slug: string
}

export function ProjectRedeployButton({ slug }: ProjectRedeployButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState(false)

  async function redeploy() {
    setLoading(true)
    setError(null)
    setOk(false)
    try {
      const res = await fetch(`/api/projects/${slug}/redeploy`, { method: "POST" })
      const data = (await res.json()) as { error?: string; state?: string }
      if (!res.ok) {
        setError(data.error ?? "Échec du redéploiement")
        return
      }
      setOk(data.state === "SUCCESS")
      if (data.state !== "SUCCESS" && data.error) setError(data.error)
      setOpen(false)
      router.refresh()
    } catch {
      setError("Erreur réseau")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        disabled={loading}
        onClick={() => setOpen(true)}
        title="Redéployer"
        aria-label="Redéployer"
        className="slab !p-2.5"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
        ) : (
          <RefreshCw className="w-4 h-4" strokeWidth={2} />
        )}
      </button>
      {ok && (
        <p className="metric text-xs text-success">Génération terminée avec succès</p>
      )}
      {error && !open && (
        <p className="metric text-xs text-danger max-w-md break-all">{error}</p>
      )}

      <ConfirmActionModal
        open={open}
        onClose={() => !loading && setOpen(false)}
        onConfirm={() => void redeploy()}
        tone="warning"
        title="Redéployer le projet"
        description="Reconstruit le projet depuis le template (toutes les pages seront réactivées) et relance le worker. La sélection de pages personnalisée sera perdue."
        confirmLabel="Redéployer"
        confirmingLabel="Redéploiement…"
        pending={loading}
        error={error}
      />
    </div>
  )
}
