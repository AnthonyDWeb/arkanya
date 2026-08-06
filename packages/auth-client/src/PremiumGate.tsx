'use client';

import { useArkanyaAuth } from './AuthProvider';
import Link from 'next/link';
import { AuthLoader } from './AuthLoader';
import { useAuthNavigation } from './useAuthNavigation';

export function ArkanyaPremiumGate({
  children,
  feature,
  productName,
}: {
  children: React.ReactNode;
  feature: string;
  productName: string;
}) {
  const { user, entitlements, loading } = useArkanyaAuth();
  const { authHref } = useAuthNavigation();

  if (loading) return <AuthLoader label="Vérification de votre accès…" />;
  if (user?.role === 'admin' || user?.role === 'owner') return children;
  if (user && entitlements.some((entitlement) => entitlement.code === feature)) return children;

  return (
    <section className="ark-auth ark-premium-gate">
      <h2>Fonctionnalité Premium</h2>
      <p>
        Cette fonctionnalité {productName} est accessible uniquement avec un abonnement Premium.
      </p>
      <div className="ark-premium-gate__actions">
        <Link href={authHref('/auth')}>Se connecter ou créer un compte</Link>
        <Link href="/settings/premium">Découvrir Premium</Link>
      </div>
    </section>
  );
}
