"use client";

import { UPDATE_MANIFEST_URL } from "@/data";
import { resolveDownloadUrl } from "@/lib/updates";
import { Button, Card } from "@/components/ui";

export function ApkDownloadCard() {
  function downloadApk() {
    window.open(resolveDownloadUrl("/downloads/arkcare.apk", UPDATE_MANIFEST_URL), "_blank");
  }

  return (
    <Card className="space-y-3">
      <div>
        <h2 className="text-base font-semibold text-slate-950">Application Android</h2>
        <p className="mt-1 text-sm text-slate-600">
          Telechargez la version Android installee hors navigateur.
        </p>
      </div>
      <Button onClick={downloadApk} type="button">
        Telecharger l&apos;APK
      </Button>
    </Card>
  );
}
