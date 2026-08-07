"use client"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const email = form.get("email") as string
    const password = form.get("password") as string

    const { error: authError } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
    })

    if (authError) {
      setError("Identifiants incorrects")
      setLoading(false)
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.webp"
              alt="Arkanya"
              width={32}
              height={32}
              className="w-8 h-8 object-contain relative z-10"
            />
            <span
              aria-hidden
              className="absolute inset-0 rounded-full blur-lg bg-gold/35 animate-logo-glow"
            />
          </div>
          <span className="metric text-[9px] tracking-[0.18em] text-gold uppercase">
            Production OS
          </span>
        </div>
        <h1 className="heading text-4xl sm:text-[2.75rem] text-white leading-[0.9] mb-2">
          arkanya
        </h1>
        <p className="text-xs text-zinc-500 max-w-xs">
          Cockpit privé. Configure. Génère. Déploie.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        method="post"
        className="chassis trim-gold p-4 sm:p-5 space-y-3.5"
      >
        <div>
          <label htmlFor="email" className="field-label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="well w-full"
          />
        </div>

        <div>
          <label htmlFor="password" className="field-label">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="well w-full"
          />
        </div>

        {error !== null && (
          <p className="metric text-xs text-danger tracking-wide">{error}</p>
        )}

        <button type="submit" disabled={loading} className="slab w-full mt-0.5">
          {loading ? (
            <span className="metric tracking-[0.14em]">CONNECTING…</span>
          ) : (
            "Entrer"
          )}
        </button>
      </form>
    </div>
  )
}
