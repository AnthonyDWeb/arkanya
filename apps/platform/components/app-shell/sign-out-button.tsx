"use client"

import { authClient } from "@/lib/auth-client"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <button
      onClick={() => void handleSignOut()}
      className="p-1.5 text-zinc-500 hover:text-zinc-300 rounded transition-colors duration-[120ms] ease-out"
      title="Se déconnecter"
    >
      <LogOut size={14} />
    </button>
  )
}
