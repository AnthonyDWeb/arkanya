import { ArkanyaAccountPanel } from "@arkanya/auth-client";

export default function AccountSettingsPage() {
  return (
    <main className="arknest-page arknest-settings-page">
      <ArkanyaAccountPanel productName="ArkNest" />
    </main>
  );
}
