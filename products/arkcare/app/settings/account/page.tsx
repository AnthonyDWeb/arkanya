import { ArkanyaAccountPanel } from "@arkanya/auth-client";

export default function AccountSettingsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <ArkanyaAccountPanel productName="ArkCare" />
    </div>
  );
}
