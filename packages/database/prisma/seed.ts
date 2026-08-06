import { PrismaClient } from "../src/generated/client"

const prisma = new PrismaClient()

async function main() {
  const mathilde = await prisma.client.upsert({
    where: { id: "client_mathilde" },
    update: {},
    create: {
      id: "client_mathilde",
      name: "Mathilde Dupont",
      company: "Les Services de Mathilde",
      status: "active",
      contact: "mathilde@lesservicesdemathilde.fr",
    },
  })

  const anthony = await prisma.client.upsert({
    where: { id: "client_anthony" },
    update: {},
    create: {
      id: "client_anthony",
      name: "Anthony Delforge",
      company: "Arkanya (interne)",
      status: "active",
      contact: "anthony@arkanya.fr",
    },
  })

  await prisma.project.upsert({
    where: { slug: "arkanya-platform" },
    update: {},
    create: {
      slug: "arkanya-platform",
      name: "Arkanya Platform",
      owner: "Anthony Delforge",
      type: "product",
      status: "IN_PROGRESS",
      destination: "products/arkanya-platform",
      description: "Cockpit privé Arkanya — usine logicielle pilotée par IA",
      technologies: ["Next.js", "TypeScript", "Prisma", "Better Auth"],
      clientId: anthony.id,
    },
  })

  await prisma.project.upsert({
    where: { slug: "arkanya-website" },
    update: {},
    create: {
      slug: "arkanya-website",
      name: "arkanya.fr",
      owner: "Anthony Delforge",
      type: "product",
      status: "TO_QUALIFY",
      destination: "apps/website",
      description: "Site vitrine Arkanya",
      technologies: ["Next.js", "TypeScript", "Tailwind"],
      clientId: anthony.id,
    },
  })

  await prisma.project.upsert({
    where: { slug: "portfolio" },
    update: {},
    create: {
      slug: "portfolio",
      name: "anthony-delforge.fr",
      owner: "Anthony Delforge",
      type: "product",
      status: "TO_QUALIFY",
      destination: "apps/portfolio",
      description: "Portfolio personnel",
      technologies: ["Next.js", "TypeScript", "Tailwind"],
      clientId: anthony.id,
    },
  })

  await prisma.project.upsert({
    where: { slug: "les-services-de-mathilde" },
    update: {},
    create: {
      slug: "les-services-de-mathilde",
      name: "Les Services de Mathilde",
      owner: "Anthony Delforge",
      type: "client",
      status: "IN_REVIEW",
      destination: "clients/lesservicesdemathilde",
      description: "Site vitrine pour les services de Mathilde",
      technologies: ["Next.js", "TypeScript", "Tailwind", "EmailJS"],
      clientId: mathilde.id,
    },
  })

  await prisma.project.upsert({
    where: { slug: "arkcare" },
    update: {},
    create: {
      slug: "arkcare",
      name: "ArkCare",
      owner: "Anthony Delforge",
      type: "product",
      status: "TO_QUALIFY",
      destination: "products/arkcare",
      description: "Application de suivi de traitements médicaux",
      technologies: ["Next.js", "TypeScript", "Prisma"],
      clientId: anthony.id,
    },
  })

  await prisma.project.upsert({
    where: { slug: "arknest" },
    update: {},
    create: {
      slug: "arknest",
      name: "ArkNest",
      owner: "Anthony Delforge",
      type: "product",
      status: "TO_QUALIFY",
      destination: "products/arknest",
      description: "Application de gestion du budget foyer",
      technologies: ["Next.js", "TypeScript", "Prisma"],
      clientId: anthony.id,
    },
  })

  console.log("Seed terminé ✓")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
