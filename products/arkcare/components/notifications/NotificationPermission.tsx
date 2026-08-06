"use client";

import { useEffect, useState } from "react";
import { Button, Card } from "@/components/ui";
import {
  isNativeNotificationsAvailable,
  requestNativeNotificationPermission,
} from "@/lib/notifications";

export function NotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(
    "unsupported",
  );
  const native = isNativeNotificationsAvailable();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (native) setPermission("default");
      else setPermission("Notification" in window ? Notification.permission : "unsupported");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [native]);

  if (permission === "unsupported" || permission === "granted") return null;

  async function requestPermission() {
    if (native) {
      setPermission((await requestNativeNotificationPermission()) ? "granted" : "denied");
      return;
    }
    setPermission(await Notification.requestPermission());
  }

  return (
    <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-700">
        Activez les notifications pour recevoir vos rappels de prise.
      </p>
      <Button onClick={requestPermission} type="button">
        Autoriser
      </Button>
    </Card>
  );
}
