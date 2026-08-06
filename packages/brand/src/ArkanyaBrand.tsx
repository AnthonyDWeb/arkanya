import type { CSSProperties } from 'react';
import { arkanyaBrandAssets } from './assets';
import { arkanyaBrandContexts, type ArkanyaBrandContext } from './constants';

export interface ArkanyaBrandProps {
  context?: ArkanyaBrandContext;
  compact?: boolean;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

export function ArkanyaBrand({
  context = 'arkanya',
  compact = false,
  className = '',
  imageClassName = '',
  priority = false,
}: ArkanyaBrandProps) {
  const identity = arkanyaBrandContexts[context];

  return (
    <span
      className={`arkanya-brand ${compact ? 'is-compact' : ''} ${className}`.trim()}
      style={{ '--arkanya-brand-accent': identity.accent } as CSSProperties}
    >
      <img
        src={arkanyaBrandAssets.symbol.webp.src}
        alt=""
        width={64}
        height={64}
        className={`arkanya-brand__symbol ${imageClassName}`.trim()}
        fetchPriority={priority ? 'high' : 'auto'}
      />
      <span className="arkanya-brand__wordmark">
        <strong>{identity.label}</strong>
        {identity.qualifier ? <small>{identity.qualifier}</small> : null}
      </span>
    </span>
  );
}
