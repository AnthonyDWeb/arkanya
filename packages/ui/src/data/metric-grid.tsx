import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../core';

export interface MetricGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4 | 5 | 6 | 7;
}

export const MetricGrid = forwardRef<HTMLDivElement, MetricGridProps>(
  ({ className, columns, ...props }, ref) => (
    <div ref={ref} data-columns={columns} className={cn('ark-metric-grid', className)} {...props} />
  ),
);

MetricGrid.displayName = 'MetricGrid';
