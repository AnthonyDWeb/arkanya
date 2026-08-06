import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../core';

export interface FormSectionProps extends HTMLAttributes<HTMLDivElement> {
  gap?: 'sm' | 'md' | 'lg';
}

export const FormSection = forwardRef<HTMLDivElement, FormSectionProps>(
  ({ className, gap = 'md', ...props }, ref) => (
    <div ref={ref} data-gap={gap} className={cn('ark-form-section', className)} {...props} />
  ),
);

FormSection.displayName = 'FormSection';
