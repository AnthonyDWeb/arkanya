import { UPDATE_MANIFEST_URL } from "@/data/appInfo";

export type UpdateManifest = {
  version: string;
  versionCode: number;
  apkUrl: string;
  message?: string;
};

export async function getUpdateManifest() {
  const response = await fetch(UPDATE_MANIFEST_URL, { cache: "no-store" });
  if (!response.ok) throw new Error("Le manifeste de mise à jour est indisponible.");
  return parseUpdateManifest(await response.json());
}

export function resolveDownloadUrl(apkUrl: string) {
  if (apkUrl.startsWith("https://")) return apkUrl;
  return new URL(apkUrl, new URL(UPDATE_MANIFEST_URL, window.location.href)).toString();
}

export function isNewerVersion(versionCode: number, currentVersionCode: number) {
  return versionCode > currentVersionCode;
}

function parseUpdateManifest(value: unknown): UpdateManifest {
  if (!isRecord(value)) throw new Error("Le manifeste de mise à jour est invalide.");
  if (typeof value.version !== "string" || !/^\d+\.\d+\.\d+$/.test(value.version)) {
    throw new Error("La version de mise à jour est invalide.");
  }
  if (!Number.isInteger(value.versionCode) || Number(value.versionCode) < 1) {
    throw new Error("Le code de version est invalide.");
  }
  if (typeof value.apkUrl !== "string" || !isSafeApkUrl(value.apkUrl)) {
    throw new Error("L’adresse de téléchargement est invalide.");
  }
  if (value.message !== undefined && typeof value.message !== "string") {
    throw new Error("Le message de mise à jour est invalide.");
  }
  return {
    version: value.version,
    versionCode: Number(value.versionCode),
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
