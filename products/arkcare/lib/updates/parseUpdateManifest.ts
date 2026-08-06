import type { UpdateManifest } from "@/types";

export function parseUpdateManifest(value: unknown): UpdateManifest {
  if (!isRecord(value)) throw new Error("Invalid update manifest");
  if (typeof value.version !== "string" || !/^\d+\.\d+\.\d+$/.test(value.version)) {
    throw new Error("Invalid update version");
  }
  if (!Number.isInteger(value.versionCode) || (value.versionCode as number) < 1) {
    throw new Error("Invalid update version code");
  }
  if (typeof value.apkUrl !== "string" || !isSafeApkUrl(value.apkUrl)) {
    throw new Error("Invalid update URL");
  }
  if (value.message !== undefined && typeof value.message !== "string") {
    throw new Error("Invalid update message");
  }
  return {
    version: value.version,
    versionCode: value.versionCode as number,
    apkUrl: value.apkUrl,
    message: value.message,
  };
}

function isSafeApkUrl(value: string) {
  if (value.startsWith("/")) return value.toLowerCase().endsWith(".apk");
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.pathname.toLowerCase().endsWith(".apk");
  } catch {
    return false;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
