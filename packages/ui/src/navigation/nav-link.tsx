import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { cn } from '../core';

export interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ active = false, className, ...props }, ref) => (
    <a
      ref={ref}
      aria-current={active ? 'page' : undefined}
      data-active={active ? 'true' : undefined}
      className={cn('ark-nav-link', className)}
      {...props}
    />
  ),
);

NavLink.displayName = 'NavLink';
