"use client"

import { Loader2, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

type ProjectRedeployButtonProps = {
  slug: string
}

export function ProjectRedeployButton({ slug }: ProjectRedeployButtonProps) {
  const router = useRouter()
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
        onClick={() => void redeploy()}
        title="Redéployer"
        aria-label="Redéployer"
        className="inline-flex items-center justify-center p-2.5 bg-brand text-white rounded-lg cursor-pointer transition-opacity duration-[120ms] ease-out hover:opacity-90 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
        ) : (
          <RefreshCw className="w-4 h-4" strokeWidth={2} />
        )}
      </button>
      {ok && <p className="text-xs text-emerald-400">Génération terminée avec succès</p>}
      {error && <p className="text-xs text-red-400 max-w-md break-all">{error}</p>}
    </div>
  )
}
