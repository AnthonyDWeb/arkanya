import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../core';

export interface NoticeProps extends HTMLAttributes<HTMLDivElement> {
  tone?: 'info' | 'success' | 'warning' | 'danger';
}

export const Notice = forwardRef<HTMLDivElement, NoticeProps>(
  ({ className, tone = 'info', ...props }, ref) => (
    <div ref={ref} data-tone={tone} className={cn('ark-notice', className)} {...props} />
  ),
);

Notice.displayName = 'Notice';
