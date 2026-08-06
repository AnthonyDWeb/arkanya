import { Badge, type BadgeProps, cn } from '../../core';

export type ArkanyaBadgeProps = BadgeProps;

export function ArkanyaBadge({ className, ...props }: ArkanyaBadgeProps) {
  return (
    <Badge
      className={cn('border border-cyan-200/20 bg-cyan-200/10 text-cyan-100', className)}
      {...props}
    />
  );
}
