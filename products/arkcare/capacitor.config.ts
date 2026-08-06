import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.arkcare.app",
  appName: "ArkCare",
  webDir: "out",
  plugins: {
    LocalNotifications: {
      iconColor: "#0f766e",
    },
  },
};

export default config;
