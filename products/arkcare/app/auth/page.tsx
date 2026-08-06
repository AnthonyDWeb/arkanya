import { ArkanyaAuthPanel } from "@arkanya/auth-client";

export default function LoginPage() {
  return (
    <main className="mx-auto w-full max-w-lg">
      <ArkanyaAuthPanel productName="ArkCare" successHref="/" />
    </main>
  );
}
