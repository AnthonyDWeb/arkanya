import { ArkanyaAuthBackLink, ArkanyaAuthPanel } from "@arkanya/auth-client";

export default function RegisterPage() {
  return (
    <main className="arknest-page">
      <ArkanyaAuthBackLink className="arknest-back-link mb-4 inline-flex" />
      <ArkanyaAuthPanel productName="ArkNest" mode="register" successHref="/" />
    </main>
  );
}
