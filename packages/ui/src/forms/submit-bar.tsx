import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../core';

export type SubmitBarProps = HTMLAttributes<HTMLDivElement>;

export const SubmitBar = forwardRef<HTMLDivElement, SubmitBarProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('ark-submit-bar', className)} {...props} />
  ),
);

SubmitBar.displayName = 'SubmitBar';
