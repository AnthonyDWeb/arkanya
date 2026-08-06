'use client';

import { createCodeRedeemer } from './code-client';
import { PremiumAccessPanel } from './PremiumAccessPanel';
import type { CodeProduct } from './types';

interface PremiumAccessClientProps {
  apiUrl: string;
  product: CodeProduct;
  productName: string;
  accountUrl: string;
}

export function PremiumAccessClient(props: PremiumAccessClientProps) {
  return <PremiumAccessPanel {...props} redeemCode={createCodeRedeemer(props.apiUrl)} />;
}
