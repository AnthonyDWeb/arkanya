"use client";

import { useState } from "react";
import { Button } from "@arkanya/ui/core";
import { Panel, Stack } from "@arkanya/ui/layout";
import { APP_VERSION, APP_VERSION_CODE } from "@/data/appInfo";
import { getUpdateManifest, isNewerVersion, resolveDownloadUrl } from "@/lib/updates";

export default function ApplicationSettings() {
  const [status, setStatus] = useState("Aucune vérification lancée.");
  const [updateUrl, setUpdateUrl] = useState("");
  const [checking, setChecking] = useState(false);

  async function checkUpdate() {
    setChecking(true);
    setUpdateUrl("");
    setStatus("Vérification en cours…");
    try {
      const manifest = await getUpdateManifest();
      if (isNewerVersion(manifest.versionCode, APP_VERSION_CODE)) {
        setUpdateUrl(resolveDownloadUrl(manifest.apkUrl));
        setStatus(manifest.message || `La version ${manifest.version} est disponible.`);
      } else {
        setStatus("ArkNest est à jour.");
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Vérification impossible pour le moment.");
    } finally {
      setChecking(false);
    }
  }

  function openApk(url = "/downloads/arknest.apk") {
    window.open(resolveDownloadUrl(url), "_blank", "noopener,noreferrer");
  }

  return (
    <Stack gap="md">
      <Panel padding="md">
        <Stack gap="sm">
          <div>
            <h2 className="text-xl font-semibold">Mises à jour</h2>
            <p className="text-sm arknest-muted">Version installée : {APP_VERSION}</p>
          </div>
          <p className="text-sm arknest-muted" role="status">{status}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button onClick={() => void checkUpdate()} disabled={checking} variant="secondary">
              {checking ? "Vérification…" : "Vérifier les mises à jour"}
            </Button>
            {updateUrl ? <Button onClick={() => openApk(updateUrl)}>Télécharger la mise à jour</Button> : null}
          </div>
        </Stack>
      </Panel>
      <Panel padding="md">
        <Stack gap="sm">
          <div>
            <h2 className="text-xl font-semibold">Application Android</h2>
            <p className="text-sm arknest-muted">Télécharge ArkNest pour l’installer sur Android.</p>
          </div>
          <Button onClick={() => openApk()}>Télécharger l’APK</Button>
        </Stack>
      </Panel>
    </Stack>
  );
}
