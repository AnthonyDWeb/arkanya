import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', ...props }, ref) => (
    <div ref={ref} data-size={size} className={cn('ark-container', className)} {...props} />
  ),
);

Container.displayName = 'Container';
