"use client";

import { ApkDownloadCard } from "./ApkDownloadCard";
import { DataBackupCard } from "./DataBackupCard";
import { NotificationSettings } from "./NotificationSettings";
import { ResetApplicationCard } from "./ResetApplicationCard";
import { UpdateCheckCard } from "./UpdateCheckCard";

export function SettingsPageClient() {
  return (
    <div className="grid gap-4">
      <NotificationSettings />
      <DataBackupCard />
      <UpdateCheckCard />
      <ApkDownloadCard />
      <ResetApplicationCard />
    </div>
  );
}
