"use client";

import { useEffect, useState } from "react";
import { Button, Card } from "@/components/ui";
import { storageChangeEvent } from "@/lib/storage/localStorage";
import {
  getNativeNotificationStatus,
  getNativeReminderSyncStatus,
  getPendingNativeNotificationCount,
  isNativeNotificationsAvailable,
  openExactAlarmSettings,
  requestNativeNotificationPermission,
  sendNativeTestNotification,
} from "@/lib/notifications";

type PermissionState = NotificationPermission | "prompt" | "unsupported";
type ExactState = "granted" | "denied" | "prompt" | "unsupported";

const labels: Record<PermissionState, string> = {
  default: "A demander",
  denied: "Refusee",
  granted: "Autorisee",
  prompt: "A demander",
  unsupported: "Non disponible",
};

export function NotificationSettings() {
  const [permission, setPermission] = useState<PermissionState>("unsupported");
  const [exact, setExact] = useState<ExactState>("unsupported");
  const [pendingCount, setPendingCount] = useState(0);
  const [syncStatus, setSyncStatus] = useState("");
  const native = isNativeNotificationsAvailable();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (native) {
        getNativeNotificationStatus().then((status) => {
          setPermission(status.display as PermissionState);
          setExact(status.exact as ExactState);
        });
        getPendingNativeNotificationCount().then(setPendingCount);
        setSyncStatus(getNativeReminderSyncStatus());
        return;
      }
      setPermission("Notification" in window ? Notification.permission : "unsupported");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [native]);

  async function requestPermission() {
    if (native) {
      await requestNativeNotificationPermission();
      await refreshNativeStatus();
      window.dispatchEvent(new Event(storageChangeEvent));
      return;
    }
    setPermission(await Notification.requestPermission());
  }

  async function sendTest() {
    if (native) {
      await sendNativeTestNotification();
      return;
    }
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("ArkCare", { body: "Notification de test ArkCare." });
    }
  }

  async function refreshNativeStatus() {
    const status = await getNativeNotificationStatus();
    setPermission(status.display as PermissionState);
    setExact(status.exact as ExactState);
    setPendingCount(await getPendingNativeNotificationCount());
    setSyncStatus(getNativeReminderSyncStatus());
  }

  return (
    <Card className="space-y-3">
      <div>
        <h2 className="text-base font-semibold text-slate-950">Notifications</h2>
        <p className="mt-1 text-sm text-slate-600">
          Autorisez ArkCare a envoyer les rappels de prise.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {labels[permission]}
        </span>
        {permission !== "granted" && permission !== "unsupported" ? (
          <Button onClick={requestPermission} type="button">
            Autoriser
          </Button>
        ) : null}
        {permission === "granted" ? (
          <Button onClick={sendTest} type="button" variant="secondary">
            Tester
          </Button>
        ) : null}
      </div>
      {native ? (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">Alarmes exactes : {labels[exact]}</p>
            {exact !== "granted" ? (
              <Button onClick={openExactAlarmSettings} type="button" variant="secondary">
                Reglage Android
              </Button>
            ) : null}
          </div>
          <p className="text-sm text-slate-600">Rappels planifies : {pendingCount}</p>
          {syncStatus ? <p className="text-sm text-slate-600">{syncStatus}</p> : null}
        </>
      ) : null}
    </Card>
  );
}
