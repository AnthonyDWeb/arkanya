import { Card, type CardProps, cn } from '../../core';

export type ArkanyaCardProps = CardProps;

export function ArkanyaCard({ className, variant = 'glass', ...props }: ArkanyaCardProps) {
  return (
    <Card
      variant={variant}
      className={cn('rounded-[24px] border-white/10 bg-white/6 text-white', className)}
      {...props}
    />
  );
}
