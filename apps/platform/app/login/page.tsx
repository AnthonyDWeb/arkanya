import { LoginForm } from "@/components/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Connexion" }

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 sm:p-10 animate-page-in">
      <LoginForm />
    </main>
  )
}
