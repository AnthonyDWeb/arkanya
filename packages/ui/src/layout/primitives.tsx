import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../core';

type Gap = 'sm' | 'md' | 'lg' | 'xl';
type Padding = 'none' | 'sm' | 'md' | 'lg';
type GridColumns = 1 | 2 | 3 | 4;

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: Gap;
}

export interface InlineProps extends HTMLAttributes<HTMLDivElement> {
  gap?: Gap;
}

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: GridColumns;
  gap?: Gap;
}

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  padding?: Padding;
}

export type AppShellProps = HTMLAttributes<HTMLDivElement>;

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ className, gap = 'md', ...props }, ref) => (
    <div ref={ref} data-gap={gap} className={cn('ark-stack', className)} {...props} />
  ),
);

Stack.displayName = 'Stack';

export const Inline = forwardRef<HTMLDivElement, InlineProps>(
  ({ className, gap = 'md', ...props }, ref) => (
    <div ref={ref} data-gap={gap} className={cn('ark-inline', className)} {...props} />
  ),
);

Inline.displayName = 'Inline';

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ className, columns = 1, gap = 'md', ...props }, ref) => (
    <div
      ref={ref}
      data-columns={columns}
      data-gap={gap}
      className={cn('ark-grid', className)}
      {...props}
    />
  ),
);

Grid.displayName = 'Grid';

export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ className, padding = 'md', ...props }, ref) => (
    <div ref={ref} data-padding={padding} className={cn('ark-panel', className)} {...props} />
  ),
);

Panel.displayName = 'Panel';

export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('ark-app-shell', className)} {...props} />
  ),
);

AppShell.displayName = 'AppShell';
