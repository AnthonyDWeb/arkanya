"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ConfirmActionModal } from "./confirm-action-modal"

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
          type="button"
          onClick={() => setOpen(true)}
          title={`Supprimer ${name}`}
          aria-label={`Supprimer ${name}`}
          className="p-1.5 text-danger cursor-pointer hover:bg-danger/10 transition-colors duration-140"
        >
          <Trash2 className="w-4 h-4" strokeWidth={2} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          title="Supprimer le projet"
          aria-label="Supprimer le projet"
          className="chassis inline-flex items-center justify-center p-2.5 text-danger cursor-pointer transition-colors duration-140 hover:text-danger"
        >
          <Trash2 className="w-4 h-4" strokeWidth={2} />
        </button>
      )}

      <ConfirmActionModal
        open={open}
        onClose={() => !deleting && setOpen(false)}
        onConfirm={() => void handleDelete()}
        tone="danger"
        title="Supprimer le projet"
        description="Cette action est irréversible. Le projet sera supprimé de :"
        consequences={[
          "Vercel (projet + déploiements)",
          "GitHub (repository)",
          "Base de données",
          "Filesystem local",
        ]}
        target={{ label: "Projet concerné", value: name }}
        confirmLabel="Supprimer définitivement"
        confirmingLabel="Suppression…"
        pending={deleting}
        error={error}
        warnings={warnings}
      />
    </>
  )
}
