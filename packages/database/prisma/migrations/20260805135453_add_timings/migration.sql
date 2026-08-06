-- CreateTable
CREATE TABLE "JobTiming" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobTiming_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimingBenchmark" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "avgMs" DOUBLE PRECISION NOT NULL,
    "minMs" DOUBLE PRECISION NOT NULL,
    "maxMs" DOUBLE PRECISION NOT NULL,
    "sampleCount" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimingBenchmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TimingBenchmark_key_key" ON "TimingBenchmark"("key");

-- AddForeignKey
ALTER TABLE "JobTiming" ADD CONSTRAINT "JobTiming_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
