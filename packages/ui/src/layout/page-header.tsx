import type { ReactNode } from 'react';
import { cn } from '../core';

export type PageHeaderProps = {
  title: ReactNode;
  action?: ReactNode;
  className?: string;
  description?: ReactNode;
  eyebrow?: ReactNode;
};

export const PageHeader = ({ action, className, description, eyebrow, title }: PageHeaderProps) => (
  <header className={cn('ark-page-header', className)}>
    {eyebrow ? <p className="ark-page-header__eyebrow">{eyebrow}</p> : null}
    <div>
      <h1 className="ark-page-header__title">{title}</h1>
      {description ? <p className="ark-page-header__description">{description}</p> : null}
    </div>
    {action}
  </header>
);
