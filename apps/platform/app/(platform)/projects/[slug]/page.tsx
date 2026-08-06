import { prisma } from "@arkanya/database/client"
import { notFound } from "next/navigation"
import { ProjectDetail } from "@/components/project-detail"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

type ProjectPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await prisma.project.findUnique({ where: { slug } })
  return { title: project?.name ?? "Projet" }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      client: true,
      jobs: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          events: { orderBy: { startedAt: "asc" } },
          timings: { orderBy: { createdAt: "asc" } },
        },
      },
    },
  })

  if (!project) notFound()

  // Les Date Prisma ne sont pas sérialisables entre Server → Client Component.
  // JSON.parse/stringify les convertit en ISO strings.
  const serialized = JSON.parse(JSON.stringify(project)) as typeof project

  return <ProjectDetail project={serialized} />
}
