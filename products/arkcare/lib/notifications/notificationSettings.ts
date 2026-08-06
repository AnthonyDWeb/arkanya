import { Capacitor, registerPlugin } from "@capacitor/core";

type ArkCareSettingsPlugin = {
  openNotificationSettings(): Promise<void>;
};

const ArkCareSettings = registerPlugin<ArkCareSettingsPlugin>("ArkCareSettings");

export async function openNotificationPermissionSettings() {
  if (!Capacitor.isNativePlatform()) return false;
  await ArkCareSettings.openNotificationSettings();
  return true;
}
