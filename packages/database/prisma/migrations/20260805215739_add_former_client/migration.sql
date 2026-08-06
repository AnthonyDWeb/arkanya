-- CreateTable
CREATE TABLE "FormerClient" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientCompany" TEXT NOT NULL,
    "clientContact" TEXT NOT NULL,
    "clientStatus" TEXT NOT NULL,
    "projectSlug" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "projectType" TEXT NOT NULL,
    "projectTechnologies" TEXT[],
    "projectUrl" TEXT,
    "projectDestination" TEXT NOT NULL,
    "projectDescription" TEXT NOT NULL,
    "projectCreatedAt" TIMESTAMP(3) NOT NULL,
    "githubRepo" TEXT,
    "vercelProject" TEXT,
    "archivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormerClient_pkey" PRIMARY KEY ("id")
);
