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
      type="button"
      onClick={() => void handleSignOut()}
      className="p-1.5 text-zinc-500 hover:text-zinc-200 rounded-[4px] transition-colors duration-140"
      title="Se déconnecter"
      aria-label="Se déconnecter"
    >
      <LogOut size={14} />
    </button>
  )
}
