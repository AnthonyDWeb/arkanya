"use client";

import { useEffect, useRef } from "react";
import { isNativeNotificationsAvailable, scheduleNativeReminders } from "@/lib/notifications";
import { getDoses, getTreatments } from "@/lib/storage";
import { storageChangeEvent } from "@/lib/storage/localStorage";

const horizonMs = 30 * 24 * 60 * 60 * 1000;
const dueWindowMs = 30000;

export function NotificationScheduler() {
  const notified = useRef<Set<string>>(new Set());

  useEffect(() => {
    const native = isNativeNotificationsAvailable();
    if (!native && !("Notification" in window)) return;

    function tick() {
      if (!native && Notification.permission !== "granted") return;
      const now = Date.now();
      const treatments = getTreatments();
      const pending = getDoses().filter((dose) => dose.status === "pending");
      const reminders = pending.map((dose) => {
        const treatment = treatments.find((item) => item.id === dose.treatmentId);
        return {
          id: dose.id,
          scheduledAt: dose.scheduledAt,
          treatmentName: treatment?.name || "votre traitement",
          dosage: dose.dosage || treatment?.dosage,
        };
      });

      const upcoming = reminders.filter((reminder) => isSoon(reminder.scheduledAt, now));
      if (native) scheduleNativeReminders(upcoming).catch(() => undefined);
      else scheduleInServiceWorker(upcoming);
      reminders.forEach((reminder) => {
        if (!isDue(reminder.scheduledAt, now) || notified.current.has(reminder.id)) return;
        if (!native) showReminder(reminder.id, reminder.treatmentName);
        notified.current.add(reminder.id);
      });
    }

    tick();
    window.addEventListener(storageChangeEvent, tick);
    window.addEventListener("focus", tick);
    document.addEventListener("visibilitychange", tick);
    const timer = window.setInterval(tick, 60000);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener(storageChangeEvent, tick);
      window.removeEventListener("focus", tick);
      document.removeEventListener("visibilitychange", tick);
    };
  }, []);

  return null;
}

function isSoon(value: string, now: number) {
  const time = new Date(value).getTime();
  return time > now && time < now + horizonMs;
}

function isDue(value: string, now: number) {
  return Math.abs(new Date(value).getTime() - now) < dueWindowMs;
}

function scheduleInServiceWorker(reminders: unknown[]) {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.ready
    .then((registration) => {
      registration.active?.postMessage({ type: "MEDTRACK_SCHEDULE", reminders });
    })
    .catch(() => undefined);
}

function showReminder(id: string, treatmentName: string) {
  const title = `Il est temps de prendre : ${treatmentName}`;
  if (!("serviceWorker" in navigator)) {
    new Notification(title);
    return;
  }

  const fallback = window.setTimeout(() => new Notification(title), 800);
  navigator.serviceWorker.ready
    .then((registration) => {
      window.clearTimeout(fallback);
      registration.showNotification(title, {
        body: "Ouvrez ArkCare pour valider la prise.",
        icon: "/icons/icon-192.png",
        tag: `arkcare-${id}`,
        data: { url: "/doses" },
      });
    })
    .catch(() => {
      window.clearTimeout(fallback);
      new Notification(title);
    });
}
