"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { deleteProject } from "@/lib/actions/projects"
import { ConfirmActionModal } from "./confirm-action-modal"

type DeleteProjectButtonProps = {
  slug: string
  name: string
  variant?: "icon" | "full" | "label"
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
      const result = await deleteProject(slug)
      if (!result.ok) {
        setError(result.error)
        setDeleting(false)
        return
      }

      if (result.data.warnings?.length) setWarnings(result.data.warnings)
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
      ) : variant === "label" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2.5 min-h-11 text-[12px] font-medium text-danger cursor-pointer touch-manipulation transition-[background-color,border-color,box-shadow,color] duration-140 ease-out hover:bg-danger/30 hover:border-danger hover:text-red-200 hover:shadow-[0_0_24px_rgba(239,68,68,0.28)]"
        >
          <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
          Supprimer le projet
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
