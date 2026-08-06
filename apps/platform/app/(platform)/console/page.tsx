import { prisma } from "@arkanya/database/client"
import type { Metadata } from "next"
import { ConsoleTabs } from "@/components/console-tabs"

export const metadata: Metadata = { title: "Console" }
export const dynamic = "force-dynamic"

export default async function ConsolePage() {
  const jobs = await prisma.job.findMany({
    include: { project: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return (
    <div>
      <div className="px-4 lg:px-6 h-16 flex flex-col justify-center border-b border-zinc-800">
        <h1 className="text-xl font-semibold text-zinc-100">Console</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Jobs · Maintenance</p>
      </div>
      <ConsoleTabs jobs={jobs} />
    </div>
  )
}
