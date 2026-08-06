"use client";

import { useEffect, useState } from "react";
import { APP_VERSION, APP_VERSION_CODE, UPDATE_MANIFEST_URL } from "@/data";
import {
  getUpdateManifest,
  getUpdateManifestUrl,
  isNewerVersion,
  resolveDownloadUrl,
  saveUpdateManifestUrl,
} from "@/lib/updates";
import type { UpdateManifest } from "@/types";
import { Button, Card } from "@/components/ui";

export function UpdateCheckCard() {
  const [manifest, setManifest] = useState<UpdateManifest | null>(null);
  const [manifestUrl, setManifestUrl] = useState(UPDATE_MANIFEST_URL);
  const [status, setStatus] = useState("Aucune verification lancee.");
  const hasUpdate = manifest && isNewerVersion(manifest.versionCode, APP_VERSION_CODE);

  useEffect(() => {
    const timer = window.setTimeout(() => setManifestUrl(getUpdateManifestUrl()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function checkUpdate() {
    saveUpdateManifestUrl(manifestUrl.trim() || UPDATE_MANIFEST_URL);
    setStatus("Verification en cours...");
    try {
      const nextManifest = await getUpdateManifest();
      setManifest(nextManifest);
      setStatus(
        isNewerVersion(nextManifest.versionCode, APP_VERSION_CODE)
          ? "Nouvelle version disponible."
          : "ArkCare est a jour.",
      );
    } catch {
      setStatus("Verification impossible pour le moment.");
    }
  }

  function downloadUpdate() {
    if (!manifest) return;
    window.open(resolveDownloadUrl(manifest.apkUrl, getUpdateManifestUrl()), "_blank");
  }

  return (
    <Card className="space-y-3">
      <div>
        <h2 className="text-base font-semibold text-slate-950">Mises a jour</h2>
        <p className="mt-1 text-sm text-slate-600">Version installee : {APP_VERSION}</p>
      </div>
      <p className="text-sm text-slate-700">{status}</p>
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        URL du manifeste
        <input
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal"
          onChange={(event) => setManifestUrl(event.target.value)}
          value={manifestUrl}
        />
      </label>
      <div className="grid gap-2 sm:grid-cols-2">
        <Button onClick={checkUpdate} type="button" variant="secondary">
          Verifier
        </Button>
        {hasUpdate ? (
          <Button onClick={downloadUpdate} type="button">
            Telecharger
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
