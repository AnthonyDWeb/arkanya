import { execFile } from "node:child_process"
import { promisify } from "node:util"
import type { WorkerStepReport, TimingEntry } from "@arkanya/contracts/worker"

const execFileAsync = promisify(execFile)

function cleanEnv(): NodeJS.ProcessEnv {
  const clean: NodeJS.ProcessEnv = {}
  for (const [key, val] of Object.entries(process.env)) {
    if (key.startsWith("npm_") || key.startsWith("PNPM_")) continue
    clean[key] = val
  }
  clean["NEXT_TELEMETRY_DISABLED"] = "1"
  return clean
}

async function runCommand(
  cmd: string,
  args: string[],
  cwd: string,
  timeoutMs = 180_000,
): Promise<{ stdout: string; stderr: string }> {
  return execFileAsync(cmd, args, {
    cwd,
    timeout: timeoutMs,
    shell: true,
    env: cleanEnv(),
  })
}

export async function runValidate(projectDir: string): Promise<WorkerStepReport> {
  const startedAt = new Date().toISOString()
  const start = Date.now()

  const timings: TimingEntry[] = []

  try {
    const tInstall = Date.now()
    await runCommand("npm", ["install"], projectDir)
    timings.push({
      key: "validate:npm-install",
      label: "npm install",
      category: "validate",
      durationMs: Date.now() - tInstall,
    })

    const tBuild = Date.now()
    await runCommand("npm", ["run", "build"], projectDir, 300_000)
    timings.push({
      key: "validate:next-build",
      label: "next build",
      category: "validate",
      durationMs: Date.now() - tBuild,
    })

    return {
      stepId: crypto.randomUUID(),
      stepType: "validate",
      state: "SUCCESS",
      message: "npm install ✓ · next build ✓",
      startedAt,
      finishedAt: new Date().toISOString(),
      durationMs: Date.now() - start,
      timings,
    }
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message.slice(0, 500)
        : String(err).slice(0, 500)

    return {
      stepId: crypto.randomUUID(),
      stepType: "validate",
      state: "ERROR",
      message,
      startedAt,
      finishedAt: new Date().toISOString(),
      durationMs: Date.now() - start,
      timings,
    }
  }
}
