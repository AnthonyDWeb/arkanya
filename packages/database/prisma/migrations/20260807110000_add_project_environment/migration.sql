-- CreateEnum
CREATE TYPE "ProjectEnvironment" AS ENUM ('LOCAL', 'ONLINE', 'PRODUCTION');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN "environment" "ProjectEnvironment" NOT NULL DEFAULT 'LOCAL';
