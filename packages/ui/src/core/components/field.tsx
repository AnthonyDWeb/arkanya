import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

export type FieldProps = {
  label: ReactNode;
  children: ReactNode;
  className?: string;
  description?: ReactNode;
  error?: ReactNode;
};

export const Field = ({ children, className, description, error, label }: FieldProps) => (
  <label className={cn('ark-field', className)}>
    <span>{label}</span>
    {children}
    {description ? <span className="ark-field__description">{description}</span> : null}
    {error ? <span className="ark-field__error">{error}</span> : null}
  </label>
);
