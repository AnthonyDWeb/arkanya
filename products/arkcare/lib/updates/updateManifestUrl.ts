import { UPDATE_MANIFEST_URL } from "@/data";

const key = "arkcare:updateManifestUrl";
const legacyHost = "www.arkcare.arkanya.fr";

function normalizeManifestUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.hostname === legacyHost) {
      url.hostname = "arkcare.arkanya.fr";
    }
    return url.toString();
  } catch {
    return value;
  }
}

export function getUpdateManifestUrl() {
  if (typeof window === "undefined") return UPDATE_MANIFEST_URL;
  const saved = window.localStorage.getItem(key);
  if (!saved || saved.startsWith("/")) return UPDATE_MANIFEST_URL;
  const normalized = normalizeManifestUrl(saved);
  if (normalized !== saved) {
    window.localStorage.setItem(key, normalized);
  }
  return normalized;
}

export function saveUpdateManifestUrl(value: string) {
  window.localStorage.setItem(key, normalizeManifestUrl(value));
}
