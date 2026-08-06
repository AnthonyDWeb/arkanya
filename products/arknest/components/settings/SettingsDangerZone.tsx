"use client";

import { useRouter } from "next/navigation";
import { Button } from "@arkanya/ui/core";
import { Notice } from "@arkanya/ui/feedback";
import { Stack } from "@arkanya/ui/layout";
import { resetStorage } from "@/lib/storage";

export default function SettingsDangerZone() {
  const router = useRouter();

  const clearCache = () => {
    if (!window.confirm("Supprimer définitivement toutes les données ArkNest de cet appareil ?")) {
      return;
    }
    resetStorage();
    router.push("/setup");
  };

  return (
    <Notice tone="danger">
      <Stack gap="sm">
        <div>
          <h2 className="font-semibold">Réinitialiser l&apos;application</h2>
          <p className="mt-1 text-sm">
            Supprime définitivement le budget enregistré sur cet appareil.
          </p>
        </div>
        <Button variant="danger" onClick={clearCache} className="arknest-mobile-full-button">
          Supprimer toutes les données
        </Button>
      </Stack>
    </Notice>
  );
}
