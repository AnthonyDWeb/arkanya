import { STORAGE_SCHEMA_VERSION, storageChangeEvent, storageKeys } from "./storageSchema.js";

export { STORAGE_SCHEMA_VERSION, storageChangeEvent, storageKeys } from "./storageSchema.js";

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.localStorage.setItem(storageKeys.schemaVersion, String(STORAGE_SCHEMA_VERSION));
  window.dispatchEvent(new CustomEvent(storageChangeEvent, { detail: { key } }));
}

export function resetApplicationData() {
  if (typeof window === "undefined") return;
  const keys = Array.from({ length: window.localStorage.length }, (_, index) => {
    return window.localStorage.key(index);
  }).filter((key): key is string => Boolean(key?.startsWith("arkcare:")));
  keys.forEach((key) => window.localStorage.removeItem(key));
  window.dispatchEvent(new CustomEvent(storageChangeEvent, { detail: { key: "reset" } }));
}
