import { PremiumAccessClient } from "@arkanya/codes";
import { PageHeader } from "@arkanya/ui/layout";

const apiUrl = process.env.NEXT_PUBLIC_ARKANYA_API_URL ?? "https://api.arkanya.fr";

export default function PremiumSettingsPage() {
  return (
    <main className="arknest-page arknest-settings-page">
      <PageHeader
        title="Premium et codes"
        description="Consultez les offres ArkNest ou utilisez un code Arkanya."
        className="mb-6"
      />
      <PremiumAccessClient
        apiUrl={apiUrl}
        product="arknest"
        productName="ArkNest"
        accountUrl="https://account.arkanya.fr/premium?product=arknest"
      />
    </main>
  );
}
