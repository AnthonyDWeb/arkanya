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
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl font-semibold tracking-tight text-white">arkanya</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand" />
        </div>
        <p className="text-sm text-zinc-500">Cockpit privé</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-zinc-400 mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-colors duration-100"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-medium text-zinc-400 mb-1.5">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-colors duration-100"
          />
        </div>

        {error !== null && <p className="text-xs text-red-400 pt-1">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-brand hover:bg-brand-light disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors duration-[120ms] ease-out mt-2"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  )
}
