"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type DeleteProjectButtonProps = {
  slug: string
  name: string
  variant?: "icon" | "full"
}

export function DeleteProjectButton({ slug, name, variant = "icon" }: DeleteProjectButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [warnings, setWarnings] = useState<string[]>([])

  async function handleDelete() {
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch(`/api/projects/${slug}`, { method: "DELETE" })
      const data = (await res.json()) as { ok?: boolean; error?: string; warnings?: string[] }

      if (!res.ok) {
        setError(data.error ?? "Erreur lors de la suppression")
        setDeleting(false)
        return
      }

      if (data.warnings?.length) setWarnings(data.warnings)
      setOpen(false)
      router.push("/")
      router.refresh()
    } catch {
      setError("Erreur réseau")
      setDeleting(false)
    }
  }

  return (
    <>
      {variant === "icon" ? (
        <button
          onClick={() => setOpen(true)}
          title={`Supprimer ${name}`}
          className="p-1.5 text-red-400 cursor-pointer rounded"
        >
          <svg viewBox="0 0 16 16" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 4h12M5 4V2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5V4M6 7v5M10 7v5M3 4l.8 9.2a.8.8 0 0 0 .8.8h6.8a.8.8 0 0 0 .8-.8L13 4" />
          </svg>
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 border border-red-900/40 rounded-lg cursor-pointer"
        >
          <svg viewBox="0 0 16 16" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 4h12M5 4V2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5V4M6 7v5M10 7v5M3 4l.8 9.2a.8.8 0 0 0 .8.8h6.8a.8.8 0 0 0 .8-.8L13 4" />
          </svg>
          Supprimer le projet
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={(e) => { if (e.target === e.currentTarget && !deleting) setOpen(false) }}
        >
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl w-full max-w-md p-6 space-y-5">
            <div>
              <h2 className="text-base font-semibold text-zinc-100">Supprimer le projet</h2>
              <p className="text-sm text-zinc-400 mt-1">
                Cette action est irréversible. Le projet sera supprimé de&nbsp;:
              </p>
            </div>

            <ul className="space-y-1.5 text-sm text-zinc-400">
              {[
                "Vercel (projet + déploiements)",
                "GitHub (repository)",
                "Base de données",
                "Filesystem local",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500/60 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="bg-zinc-800/60 border border-zinc-700/40 rounded-lg px-3 py-2">
              <p className="text-xs text-zinc-500">Projet concerné</p>
              <p className="text-sm font-medium text-zinc-200 mt-0.5 font-mono">{name}</p>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/40 rounded px-3 py-2">
                {error}
              </p>
            )}

            {warnings.length > 0 && (
              <div className="text-xs text-amber-400 bg-amber-950/20 border border-amber-900/30 rounded px-3 py-2 space-y-0.5">
                <p className="font-medium">Avertissements :</p>
                {warnings.map((w) => <p key={w}>{w}</p>)}
              </div>
            )}

            <div className="flex gap-3 justify-end pt-1">
              <button
                onClick={() => setOpen(false)}
                disabled={deleting}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors duration-[120ms] ease-out disabled:opacity-40"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-[120ms] ease-out disabled:opacity-50 flex items-center gap-2"
              >
                {deleting && (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {deleting ? "Suppression…" : "Supprimer définitivement"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
