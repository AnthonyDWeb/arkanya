'use client';

import Link from 'next/link';
import { useAuthNavigation } from './useAuthNavigation';

export function ArkanyaAuthBackLink({ className = 'ark-auth__link' }: { className?: string }) {
  const { returnTo } = useAuthNavigation();
  return (
    <Link className={className} href={returnTo === '/' ? '/auth' : returnTo}>
      ← Retour
    </Link>
  );
}
