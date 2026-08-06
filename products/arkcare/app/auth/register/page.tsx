import { ArkanyaAuthBackLink, ArkanyaAuthPanel } from "@arkanya/auth-client";

export default function RegisterPage() {
  return (
    <main className="mx-auto w-full max-w-lg">
      <ArkanyaAuthBackLink className="mb-4 inline-flex text-sm font-semibold text-teal-700 underline" />
      <ArkanyaAuthPanel productName="ArkCare" mode="register" successHref="/" />
    </main>
  );
}
