"use client";

import { useEffect, useState } from "react";
import { APP_VERSION_CODE } from "@/data";
import {
  getUpdateManifest,
  getUpdateManifestUrl,
  isNewerVersion,
  resolveDownloadUrl,
} from "@/lib/updates";
import type { UpdateManifest } from "@/types";
import { Button, Card } from "@/components/ui";

export function AppUpdateWatcher() {
  const [manifest, setManifest] = useState<UpdateManifest | null>(null);
  const hasUpdate = manifest && isNewerVersion(manifest.versionCode, APP_VERSION_CODE);

  useEffect(() => {
    getUpdateManifest()
      .then((nextManifest) => setManifest(nextManifest))
      .catch(() => undefined);
  }, []);

  if (!hasUpdate) return null;

  function downloadUpdate() {
    if (!manifest) return;
    window.open(resolveDownloadUrl(manifest.apkUrl, getUpdateManifestUrl()), "_blank");
  }

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md">
      <Card className="space-y-3 border-teal-200 bg-white shadow-lg">
        <div>
          <h2 className="text-base font-semibold text-slate-950">Mise a jour disponible</h2>
          <p className="mt-1 text-sm text-slate-600">
            {manifest.message || "Une nouvelle version de ArkCare est disponible."}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => setManifest(null)} type="button" variant="secondary">
            Plus tard
          </Button>
          <Button onClick={downloadUpdate} type="button">
            Telecharger
          </Button>
        </div>
      </Card>
    </div>
  );
}
