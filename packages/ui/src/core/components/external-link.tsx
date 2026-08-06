import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

type ExternalLinkVariant = 'inline' | 'button';

export interface ExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ExternalLinkVariant;
}

export const ExternalLink = forwardRef<HTMLAnchorElement, ExternalLinkProps>(
  ({ className, rel, target = '_blank', variant = 'inline', ...props }, ref) => (
    <a
      ref={ref}
      target={target}
      rel={rel || 'noopener noreferrer'}
      data-variant={variant}
      className={cn('ark-external-link', className)}
      {...props}
    />
  ),
);

ExternalLink.displayName = 'ExternalLink';
