import { PrismaClient } from "@prisma/client"

type GlobalWithPrisma = typeof globalThis & {
  _prisma?: PrismaClient
}

const g = globalThis as GlobalWithPrisma

export const prisma = g._prisma ?? new PrismaClient()

if (process.env["NODE_ENV"] !== "production") {
  g._prisma = prisma
}

export { PrismaClient }
export type {
  Client,
  Job,
  JobEvent,
  JobTiming,
  Project,
  ProjectEnvironment,
  ProjectStatus,
  Prisma,
} from "@prisma/client"
