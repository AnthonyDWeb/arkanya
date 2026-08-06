"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";
import {
  openNotificationPermissionSettings,
  resetNativeNotificationState,
} from "@/lib/notifications";
import { resetApplicationData } from "@/lib/storage";

export function ResetApplicationCard() {
  const [error, setError] = useState("");

  async function reset() {
    const confirmed = window.confirm(
      "Supprimer definitivement tous les traitements, prises, notes et reglages ArkCare de cet appareil ? Cette action est irreversible.",
    );
    if (!confirmed) return;

    try {
      await resetNativeNotificationState();
      resetApplicationData();
      const openedSettings = await openNotificationPermissionSettings();
      if (!openedSettings && "Notification" in window && Notification.permission !== "default") {
        window.alert(
          "Les donnees ArkCare sont effacees. Pour reinitialiser aussi l'autorisation des notifications, retirez l'autorisation de ce site dans les reglages de votre navigateur.",
        );
      }
      window.location.replace("/");
    } catch {
      setError("La reinitialisation a echoue. Vos donnees n'ont pas ete supprimees.");
    }
  }

  return (
    <Card className="border-rose-200 bg-rose-50/40">
      <h2 className="text-base font-semibold text-rose-900">Reinitialiser l’application</h2>
      <p className="mt-1 text-sm text-rose-800">
        Supprime tous les traitements, prises, notes et reglages enregistres sur cet appareil.
        Les rappels seront annules. Android ouvrira ensuite le reglage systeme permettant de retirer
        l’autorisation des notifications. Exportez une sauvegarde avant de continuer si necessaire.
      </p>
      <div className="mt-4">
        <Button onClick={() => void reset()} type="button" variant="danger">
          Reinitialiser les donnees
        </Button>
      </div>
      {error ? (
        <p className="mt-3 text-sm font-medium text-rose-700" role="alert">
          {error}
        </p>
      ) : null}
    </Card>
  );
}
