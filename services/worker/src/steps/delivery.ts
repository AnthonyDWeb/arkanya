import { exec } from "node:child_process"
import { promisify } from "node:util"
import fs from "node:fs"
import path from "node:path"
import type { WorkerProjectPayload, WorkerStepReport, TimingEntry } from "@arkanya/contracts/worker"
import { config } from "../config.js"

const execAsync = promisify(exec)

type DeliveryProgress = (message: string) => void

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
}

function buildRepoName(payload: WorkerProjectPayload): string {
  if (payload.projectKind === "client") {
    // `ac` = arkanya-client — ne pas rajouter le segment "client"
    const company = slugify(payload.clientCompany ?? "")
    if (company && company !== "client") {
      return `ac-${company}-${payload.projectSlug}`
    }
    return `ac-${payload.projectSlug}`
  }
  return `ap-${payload.projectSlug}`
}

async function runGit(args: string[], cwd: string): Promise<void> {
  const quoted = args.map((a) =>
    a.includes(" ") ? `"${a.replace(/"/g, '\\"')}"` : a,
  )
  await execAsync(`git ${quoted.join(" ")}`, {
    cwd,
    maxBuffer: 20 * 1024 * 1024,
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: "Arkanya Worker",
      GIT_AUTHOR_EMAIL: "worker@arkanya.fr",
      GIT_COMMITTER_NAME: "Arkanya Worker",
      GIT_COMMITTER_EMAIL: "worker@arkanya.fr",
    },
  })
}

async function createGithubRepo(repoName: string): Promise<void> {
  const res = await fetch(`https://api.github.com/user/repos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.github.token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      name: repoName,
      private: true,
      auto_init: false,
    }),
  })

  if (!res.ok && res.status !== 422) {
    const body = await res.text()
    throw new Error(`GitHub repo creation failed (${res.status}): ${body}`)
  }
}

async function createVercelProject(
  repoName: string,
  gitOwner: string,
): Promise<string> {
  const res = await fetch(
    `https://api.vercel.com/v10/projects?teamId=${config.vercel.orgId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.vercel.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: repoName,
        framework: "nextjs",
        gitRepository: {
          type: "github",
          repo: `${gitOwner}/${repoName}`,
        },
      }),
    },
  )

  const data = (await res.json()) as { id?: string; error?: { message?: string } }

  if (!res.ok && res.status !== 409) {
    throw new Error(
      `Vercel project creation failed (${res.status}): ${data.error?.message ?? JSON.stringify(data)}`,
    )
  }

  return repoName
}

async function triggerVercelDeployment(
  repoName: string,
  gitOwner: string,
  onProgress: DeliveryProgress = () => undefined,
): Promise<string> {
  const res = await fetch(
    `https://api.vercel.com/v13/deployments?teamId=${config.vercel.orgId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.vercel.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: repoName,
        gitSource: {
          type: "github",
          org: gitOwner,
          repo: repoName,
          ref: "main",
        },
        projectSettings: { framework: "nextjs" },
      }),
    },
  )

  const data = (await res.json()) as { id?: string; url?: string; error?: { message?: string } }

  if (!res.ok) {
    throw new Error(
      `Vercel deployment trigger failed (${res.status}): ${data.error?.message ?? JSON.stringify(data)}`,
    )
  }

  const deploymentId = data.id
  if (!deploymentId) {
    return data.url ? `https://${data.url}` : `https://${repoName}.vercel.app`
  }

  // Polling jusqu'à READY ou ERROR (max 10 min)
  const MAX_WAIT_MS = 10 * 60 * 1000
  const POLL_INTERVAL_MS = 5_000
  const deadline = Date.now() + MAX_WAIT_MS

  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))

    const pollRes = await fetch(
      `https://api.vercel.com/v13/deployments/${deploymentId}?teamId=${config.vercel.orgId}`,
      { headers: { Authorization: `Bearer ${config.vercel.token}` } },
    )

    const poll = (await pollRes.json()) as {
      readyState?: string
      url?: string
      error?: { message?: string }
    }

    if (poll.readyState === "READY") {
      onProgress("Vercel — déploiement prêt")
      return poll.url ? `https://${poll.url}` : `https://${repoName}.vercel.app`
    }

    if (poll.readyState === "ERROR" || poll.readyState === "CANCELED") {
      throw new Error(`Vercel build failed (state: ${poll.readyState}): ${poll.error?.message ?? "unknown"}`)
    }

    onProgress(`Vercel — build (${poll.readyState ?? "pending"})`)
  }

  throw new Error("Vercel deployment timed out after 10 minutes")
}

export async function runDelivery(
  payload: WorkerProjectPayload,
  projectDir: string,
  onProgress: DeliveryProgress = () => undefined,
): Promise<WorkerStepReport> {
  const startedAt = new Date().toISOString()
  const start = Date.now()
  const targets = payload.delivery.targets
  const timings: TimingEntry[] = []

  const wantsGithub = targets.includes("github")
  const wantsVercel = targets.includes("vercel")
  const wantsDatabase = targets.includes("database")

  if (wantsDatabase) {
    onProgress("Base de données — projet enregistré")
  }

  if (!wantsGithub && !wantsVercel) {
    return {
      stepId: crypto.randomUUID(),
      stepType: "delivery",
      state: "SUCCESS",
      message: targets.length === 0
        ? "Aucune livraison configurée"
        : wantsDatabase
          ? "Base de données — projet enregistré"
          : `Livraison locale — dossier : ${projectDir}`,
      startedAt,
      finishedAt: new Date().toISOString(),
      durationMs: Date.now() - start,
    }
  }

  if (!config.github.token || !config.github.owner) {
    return {
      stepId: crypto.randomUUID(),
      stepType: "delivery",
      state: "ERROR",
      message: "GITHUB_TOKEN et GITHUB_OWNER requis pour la livraison GitHub",
      startedAt,
      finishedAt: new Date().toISOString(),
      durationMs: Date.now() - start,
    }
  }

  try {
    const repoName = buildRepoName(payload)

    if (wantsGithub) {
      const tGit = Date.now()

      onProgress("GitHub — initialisation du dépôt")
      const gitignorePath = path.join(projectDir, ".gitignore")
      if (!fs.existsSync(gitignorePath)) {
        fs.writeFileSync(
          gitignorePath,
          "/node_modules\n/.next/\n/out/\n/build\n.DS_Store\n*.pem\nnpm-debug.log*\n.env*.local\n.vercel\n*.tsbuildinfo\nnext-env.d.ts\n",
          "utf-8",
        )
      }

      const gitDir = path.join(projectDir, ".git")
      if (fs.existsSync(gitDir)) {
        fs.rmSync(gitDir, { recursive: true, force: true })
      }

      await runGit(["init", "-b", "main"], projectDir)
      await runGit(["add", "."], projectDir)
      await runGit(["commit", "-m", "Initial commit - generated by Arkanya"], projectDir)

      onProgress("GitHub — création du repo")
      await createGithubRepo(repoName)

      onProgress("GitHub — push vers origin/main")
      const remoteUrl = `https://${config.github.token}@github.com/${config.github.owner}/${repoName}.git`
      await runGit(["remote", "add", "origin", remoteUrl], projectDir)
      // --force : redéploiement après échec / correction (repo généré déjà présent)
      await runGit(["push", "-u", "origin", "main", "--force"], projectDir)

      timings.push({
        key: "delivery:github-push",
        label: "Push GitHub",
        category: "delivery",
        durationMs: Date.now() - tGit,
      })
    }

    let deployUrl: string | undefined

    if (wantsVercel) {
      if (!config.vercel.token || !config.vercel.orgId) {
        return {
          stepId: crypto.randomUUID(),
          stepType: "delivery",
          state: "ERROR",
          message: "VERCEL_TOKEN et VERCEL_ORG_ID requis pour le déploiement Vercel",
          startedAt,
          finishedAt: new Date().toISOString(),
          durationMs: Date.now() - start,
          timings,
        }
      }

      const tVercel = Date.now()

      onProgress("Vercel — création du projet")
      await createVercelProject(repoName, config.github.owner)
      onProgress("Vercel — déploiement en cours")
      deployUrl = await triggerVercelDeployment(repoName, config.github.owner, onProgress)

      timings.push({
        key: "delivery:vercel-deploy",
        label: "Déploiement Vercel",
        category: "delivery",
        durationMs: Date.now() - tVercel,
      })
    }

    const parts: string[] = []
    if (wantsGithub) parts.push(`GitHub : github.com/${config.github.owner}/${repoName}`)
    if (deployUrl) parts.push(`Vercel : ${deployUrl}`)

    return {
      stepId: crypto.randomUUID(),
      stepType: "delivery",
      state: "SUCCESS",
      message: parts.join(" · "),
      url: deployUrl,
      startedAt,
      finishedAt: new Date().toISOString(),
      durationMs: Date.now() - start,
      timings,
    }
  } catch (err) {
    return {
      stepId: crypto.randomUUID(),
      stepType: "delivery",
      state: "ERROR",
      message: err instanceof Error ? err.message.slice(0, 600) : String(err),
      startedAt,
      finishedAt: new Date().toISOString(),
      durationMs: Date.now() - start,
      timings,
    }
  }
}
