import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

export type SectionProps = {
  title?: ReactNode;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
};

export const Section = ({
  action,
  children,
  className,
  description,
  headerClassName,
  title,
}: SectionProps) => {
  const hasHeader = Boolean(title || description || action);

  return (
    <section className={cn('ark-section', className)}>
      {hasHeader ? (
        <div className={cn('ark-section__header', headerClassName)}>
          <div className="ark-section__intro">
            {title ? <h2 className="ark-section__title">{title}</h2> : null}
            {description ? <p className="ark-section__description">{description}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
};
