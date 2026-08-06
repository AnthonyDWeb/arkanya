import { Button, type ButtonProps, cn } from '../../core';

export type ArkanyaButtonProps = ButtonProps;

export function ArkanyaButton({ className, variant = 'primary', ...props }: ArkanyaButtonProps) {
  return (
    <Button
      variant={variant}
      className={cn(
        'rounded-2xl border-white/10 bg-white/8 text-white hover:bg-white/12 focus-visible:outline-cyan-300',
        className,
      )}
      {...props}
    />
  );
}
