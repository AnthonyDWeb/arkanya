import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

export type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export const EmptyState = ({ action, className, description, title }: EmptyStateProps) => (
  <div className={cn('ark-empty-state', className)}>
    <h2 className="ark-empty-state__title">{title}</h2>
    <p className="ark-empty-state__description">{description}</p>
    {action ? <div className="ark-empty-state__action">{action}</div> : null}
  </div>
);
