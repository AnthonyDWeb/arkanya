import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import type {
  Channel,
  LocalNotificationSchema,
  ScheduleOptions,
} from '@capacitor/local-notifications';

export type LocalNotification = LocalNotificationSchema;
export type LocalNotificationChannel = Channel;

export function isNativePlatform() {
  return Capacitor.isNativePlatform();
}

export async function checkLocalNotificationStatus() {
  const permission = await LocalNotifications.checkPermissions();
  const exact = await LocalNotifications.checkExactNotificationSetting().catch(() => ({
    exact_alarm: 'prompt' as const,
  }));

  return { display: permission.display, exact: exact.exact_alarm };
}

export async function requestLocalNotificationPermission() {
  return LocalNotifications.requestPermissions();
}

export async function changeExactNotificationSetting() {
  await LocalNotifications.changeExactNotificationSetting();
}

export async function getPendingLocalNotificationCount() {
  const pending = await LocalNotifications.getPending();
  return pending.notifications.length;
}

export async function getPendingLocalNotificationIds() {
  const pending = await LocalNotifications.getPending().catch(() => ({ notifications: [] }));
  return pending.notifications.map((notification) => notification.id);
}

export async function createLocalNotificationChannel(channel: LocalNotificationChannel) {
  await LocalNotifications.createChannel(channel).catch(() => undefined);
}

export async function deleteLocalNotificationChannel(id: string) {
  await LocalNotifications.deleteChannel({ id }).catch(() => undefined);
}

export async function scheduleLocalNotifications(options: ScheduleOptions) {
  await LocalNotifications.schedule(options);
}

export async function cancelLocalNotifications(ids: number[]) {
  if (ids.length === 0) {
    return;
  }

  await LocalNotifications.cancel({ notifications: ids.map((id) => ({ id })) });
}
