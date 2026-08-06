import { LoginForm } from "@/components/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Connexion" }

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <LoginForm />
    </main>
  )
}
