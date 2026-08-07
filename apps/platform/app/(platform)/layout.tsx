import { headers } from "next/headers"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"
import { prisma } from "@arkanya/database/client"
import { auth } from "@/lib/auth"
import { AppHeader } from "@/components/app-shell/app-header"
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

  const [projects, clients] = await Promise.all([
    prisma.project.findMany({
      select: { slug: true, name: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.client.findMany({
      select: { id: true, name: true, company: true },
      orderBy: { name: "asc" },
    }),
  ])

  return (
    <div className="flex flex-col h-dvh overflow-hidden bg-base">
      <AppHeader
        userName={session.user.name}
        catalog={{ projects, clients }}
      />
      <main className="flex-1 min-h-0 platform-scroll pb-16 lg:pb-0 bg-workspace">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
