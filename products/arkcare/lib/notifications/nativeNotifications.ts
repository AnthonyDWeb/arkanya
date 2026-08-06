import {
  cancelLocalNotifications,
  changeExactNotificationSetting,
  checkLocalNotificationStatus,
  createLocalNotificationChannel,
  deleteLocalNotificationChannel,
  getPendingLocalNotificationCount,
  getPendingLocalNotificationIds,
  isNativePlatform,
  requestLocalNotificationPermission,
  scheduleLocalNotifications,
} from "@arkanya/capacitor";

type Reminder = {
  id: string;
  scheduledAt: string;
  treatmentName: string;
  dosage?: string;
};

const channelId = "arkcare-reminders";
const signatureKey = "arkcare:nativeReminderSignature";
const idsKey = "arkcare:nativeReminderIds";
const statusKey = "arkcare:nativeReminderStatus";

export function isNativeNotificationsAvailable() {
  return isNativePlatform();
}

export async function getNativeNotificationStatus() {
  if (!isNativeNotificationsAvailable()) return { display: "unsupported", exact: "unsupported" };
  return checkLocalNotificationStatus();
}

export async function getPendingNativeNotificationCount() {
  if (!isNativeNotificationsAvailable()) return 0;
  return getPendingLocalNotificationCount();
}

export function getNativeReminderSyncStatus() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(statusKey) || "";
}

export async function requestNativeNotificationPermission() {
  if (!isNativeNotificationsAvailable()) return false;
  const result = await requestLocalNotificationPermission();
  await ensureReminderChannel();
  return result.display === "granted";
}

export async function openExactAlarmSettings() {
  if (!isNativeNotificationsAvailable()) return;
  await changeExactNotificationSetting();
}

export async function sendNativeTestNotification() {
  if (!isNativeNotificationsAvailable()) return;
  const permission = await checkLocalNotificationStatus();
  if (permission.display !== "granted") return;
  await ensureReminderChannel();
  await scheduleLocalNotifications({
    notifications: [
      {
        id: 2147483646,
        title: "ArkCare",
        body: "Notification de test ArkCare.",
        channelId,
        schedule: { at: new Date(Date.now() + 2000), allowWhileIdle: true },
        autoCancel: true,
      },
    ],
  });
}

export async function clearNativeReminders() {
  if (!isNativeNotificationsAvailable()) return;
  const ids = [...new Set([...readStoredIds(), ...(await readNativeIds())])];
  if (ids.length > 0) await cancelLocalNotifications(ids);
}

export async function resetNativeNotificationState() {
  if (!isNativeNotificationsAvailable()) return;
  await clearNativeReminders();
  await deleteLocalNotificationChannel(channelId);
}

export async function scheduleNativeReminders(reminders: Reminder[]) {
  try {
    await scheduleNativeRemindersUnsafe(reminders);
  } catch (error) {
    window.localStorage.setItem(statusKey, `Erreur rappel: ${String(error).slice(0, 80)}`);
    throw error;
  }
}

async function scheduleNativeRemindersUnsafe(reminders: Reminder[]) {
  if (!isNativeNotificationsAvailable()) return;
  const permission = await checkLocalNotificationStatus();
  if (permission.display !== "granted") {
    window.localStorage.setItem(statusKey, "Notifications non autorisees.");
    return;
  }
  await ensureReminderChannel();
  const pending = reminders.filter(
    (reminder) => new Date(reminder.scheduledAt).getTime() > Date.now(),
  );
  const signature = pending.map((reminder) => `${reminder.id}:${reminder.scheduledAt}`).join("|");
  const nextIds = pending.map((reminder) => toNativeId(reminder.id));
  const nativeIds = await readNativeIds();
  if (isAlreadyScheduled(signature, nextIds, nativeIds)) return;
  const cancelIds = [...new Set([...readStoredIds(), ...nativeIds])];
  if (cancelIds.length > 0) await cancelLocalNotifications(cancelIds);
  if (pending.length === 0) {
    window.localStorage.setItem(signatureKey, signature);
    window.localStorage.setItem(idsKey, JSON.stringify(nextIds));
    window.localStorage.setItem(statusKey, "Aucun rappel futur a planifier.");
    return;
  }
  await scheduleLocalNotifications({ notifications: pending.map(toNotification) });
  window.localStorage.setItem(signatureKey, signature);
  window.localStorage.setItem(idsKey, JSON.stringify(nextIds));
  window.localStorage.setItem(statusKey, `${pending.length} rappel(s) planifie(s).`);
}

function toNotification(reminder: Reminder) {
  return {
    id: toNativeId(reminder.id),
    title: "ArkCare",
    body: `Il est temps de prendre : ${reminder.treatmentName}${reminder.dosage ? ` (${reminder.dosage})` : ""}`,
    channelId,
    schedule: { at: new Date(reminder.scheduledAt), allowWhileIdle: true },
    autoCancel: true,
    extra: { doseId: reminder.id },
  };
}

async function ensureReminderChannel() {
  await createLocalNotificationChannel({
    id: channelId,
    name: "Rappels de prise",
    description: "Notifications pour les traitements planifies.",
    importance: 5,
    visibility: 1,
    vibration: true,
  });
}

function toNativeId(value: string) {
  const hash = value
    .split("")
    .reduce((total, char) => (total << 5) - total + char.charCodeAt(0), 0);
  return (Math.abs(hash) % 2147483645) + 1;
}

async function readNativeIds() {
  return getPendingLocalNotificationIds();
}

function isAlreadyScheduled(signature: string, nextIds: number[], nativeIds: number[]) {
  if (window.localStorage.getItem(signatureKey) !== signature) return false;
  if (nextIds.length === 0) return nativeIds.length === 0;
  return nextIds.every((id) => nativeIds.includes(id));
}

function readStoredIds() {
  try {
    const ids = JSON.parse(window.localStorage.getItem(idsKey) || "[]");
    return Array.isArray(ids) ? ids.filter((id) => typeof id === "number") : [];
  } catch {
    return [];
  }
}
