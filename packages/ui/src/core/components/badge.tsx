import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

type BadgeTone = 'slate' | 'teal' | 'rose' | 'amber' | 'sky' | 'cyan' | 'emerald' | 'blue';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, tone = 'slate', ...props }, ref) => (
    <span ref={ref} data-tone={tone} className={cn('ark-badge', className)} {...props} />
  ),
);

Badge.displayName = 'Badge';
