import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../core';

export interface NavListProps extends HTMLAttributes<HTMLElement> {
  orientation?: 'horizontal' | 'vertical';
}

export const NavList = forwardRef<HTMLElement, NavListProps>(
  ({ className, orientation = 'horizontal', ...props }, ref) => (
    <nav
      ref={ref}
      data-orientation={orientation}
      className={cn('ark-nav-list', className)}
      {...props}
    />
  ),
);

NavList.displayName = 'NavList';
