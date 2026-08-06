import { ArkanyaAuthPanel } from "@arkanya/auth-client";

export default function LoginPage() {
  return (
    <main className="arknest-page">
      <ArkanyaAuthPanel productName="ArkNest" successHref="/" />
    </main>
  );
}
