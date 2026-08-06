import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@arkanya/database/client"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const keys = searchParams.get("keys")

  if (!keys) {
    return NextResponse.json({ error: "Paramètre `keys` requis" }, { status: 400 })
  }

  const keyList = keys.split(",").filter(Boolean)

  const benchmarks = await prisma.timingBenchmark.findMany({
    where: { key: { in: keyList } },
    select: { key: true, label: true, category: true, avgMs: true, minMs: true, maxMs: true, sampleCount: true },
  })

  return NextResponse.json(benchmarks)
}
