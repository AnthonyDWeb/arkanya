import { arkanyaBrandAssets } from './assets';

export interface ProductAttributionProps {
  className?: string;
}

export function ProductAttribution({ className = '' }: ProductAttributionProps) {
  return (
    <span className={`arkanya-product-attribution ${className}`.trim()}>
      <span>par</span>
      <img src={arkanyaBrandAssets.symbol.webp.src} alt="" width={20} height={20} />
      <strong>Arkanya</strong>
    </span>
  );
}
