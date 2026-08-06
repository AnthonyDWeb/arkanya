import { getUpdateManifestUrl } from "./updateManifestUrl";
import { parseUpdateManifest } from "./parseUpdateManifest";

export async function getUpdateManifest() {
  const response = await fetch(getUpdateManifestUrl(), { cache: "no-store" });
  if (!response.ok) throw new Error("Update manifest unavailable");
  return parseUpdateManifest(await response.json());
}
