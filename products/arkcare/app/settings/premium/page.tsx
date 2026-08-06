import { PremiumAccessClient } from "@arkanya/codes";
import { PageHeader } from "@/components/layout";

const apiUrl = process.env.NEXT_PUBLIC_ARKANYA_API_URL ?? "https://api.arkanya.fr";

export default function PremiumSettingsPage() {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6">
      <PageHeader
        title="Premium et codes"
        description="Consultez les offres ArkCare ou utilisez un code Arkanya."
      />
      <PremiumAccessClient
        apiUrl={apiUrl}
        product="arkcare"
        productName="ArkCare"
        accountUrl="https://account.arkanya.fr/premium?product=arkcare"
      />
    </div>
  );
}
