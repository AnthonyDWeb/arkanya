import type { ReactNode } from 'react';
import { CodeRedemptionForm } from './CodeRedemptionForm';
import type { CodeProduct, RedeemCode } from './types';

interface PremiumAccessPanelProps {
  product: CodeProduct;
  productName: string;
  accountUrl: string;
  redeemCode: RedeemCode;
  children?: ReactNode;
}

export function PremiumAccessPanel({
  product,
  productName,
  accountUrl,
  redeemCode,
  children,
}: PremiumAccessPanelProps) {
  return (
    <div className="ark-premium-stack">
      <section className="ark-premium-card">
        <p className="ark-premium-eyebrow">Premium</p>
        <h1>{productName} Premium</h1>
        <p>
          Retrouvez les offres, les avantages et la gestion de vos accès depuis votre compte
          Arkanya.
        </p>
        {children}
        <a href={accountUrl}>Découvrir les offres Premium</a>
      </section>
      <CodeRedemptionForm product={product} redeemCode={redeemCode} />
    </div>
  );
}
