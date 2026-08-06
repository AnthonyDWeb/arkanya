import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

type CardVariant = 'default' | 'outlined' | 'glass';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  variant?: CardVariant;
  padding?: CardPadding;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, padding = 'md', variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      data-interactive={interactive ? 'true' : undefined}
      data-padding={padding}
      data-variant={variant}
      className={cn('ark-card', className)}
      {...props}
    />
  ),
);

Card.displayName = 'Card';
