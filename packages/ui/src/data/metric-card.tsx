import type { ReactNode } from 'react';
import { cn } from '../core';

export type MetricTone = 'blue' | 'cyan' | 'emerald' | 'amber' | 'slate';

export type MetricCardProps = {
  label: ReactNode;
  value: ReactNode;
  className?: string;
  detail?: ReactNode;
  footer?: ReactNode;
  href?: string;
  icon?: ReactNode;
  tone?: MetricTone;
};

export const MetricCard = ({
  className,
  detail,
  footer,
  href,
  icon,
  label,
  tone = 'blue',
  value,
}: MetricCardProps) => {
  const content = (
    <>
      <div className="ark-metric-card__main">
        <div className="ark-metric-card__content">
          <p className="ark-metric-card__label">{label}</p>
          {icon ? <span className="ark-metric-card__icon">{icon}</span> : null}
          {detail ? <p className="ark-metric-card__detail">{detail}</p> : null}
        </div>
        <p className="ark-metric-card__value">{value}</p>
      </div>
      {footer ? <div className="ark-metric-card__footer">{footer}</div> : null}
    </>
  );

  if (href) {
    return (
      <a className={cn('ark-metric-card', className)} data-tone={tone} href={href}>
        {content}
      </a>
    );
  }

  return (
    <article className={cn('ark-metric-card', className)} data-tone={tone}>
      {content}
    </article>
  );
};
