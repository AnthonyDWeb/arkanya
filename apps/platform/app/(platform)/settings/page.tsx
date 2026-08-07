import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { SettingsView } from "@/components/settings/settings-view"
import { auth } from "@/lib/auth"
import { buildSettingsEnvEntries } from "@/lib/settings/env-keys"

export const metadata: Metadata = { title: "Paramètres" }
export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) redirect("/login")

  const entries = buildSettingsEnvEntries()

  return (
    <SettingsView
      userName={session.user.name}
      userEmail={session.user.email}
      entries={entries}
    />
  )
}
