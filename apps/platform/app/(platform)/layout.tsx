import { headers } from "next/headers"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"
import { auth } from "@/lib/auth"
import { TopHeader } from "@/components/app-shell/top-header"
import { Sidebar } from "@/components/app-shell/sidebar"
import { BottomNav } from "@/components/app-shell/bottom-nav"

type PlatformLayoutProps = {
  children: ReactNode
}

export default async function PlatformLayout({ children }: PlatformLayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-zinc-900">
      <Sidebar userName={session.user.name} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />
        <main className="flex-1 overflow-auto pb-16 lg:pb-0">{children}</main>
      </div>
      <BottomNav />
    </div>
  )
}
