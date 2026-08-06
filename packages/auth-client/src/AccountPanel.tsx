'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { AuthLoader } from './AuthLoader';
import { useArkanyaAuth } from './AuthProvider';
import { useAuthNavigation } from './useAuthNavigation';

export function ArkanyaAccountPanel({ productName }: { productName: string }) {
  const { client, user, entitlements, loading, refresh, logout } = useArkanyaAuth();
  const { authHref } = useAuthNavigation();
  const [message, setMessage] = useState('');

  if (loading) return <AuthLoader />;
  if (!user) {
    return (
      <section className="ark-auth">
        <h1>Mon compte {productName}</h1>
        <p>Connectez-vous pour consulter les informations liées à cette fonctionnalité.</p>
        <div className="ark-premium-gate__actions">
          <Link href={authHref('/auth')}>Se connecter</Link>
          <Link href={authHref('/auth/register')}>Créer un compte</Link>
        </div>
      </section>
    );
  }

  async function update(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const displayName = String(new FormData(event.currentTarget).get('displayName') ?? '');
    const result = await client.updateProfile(displayName);
    if (result.ok) await refresh();
    setMessage(result.message ?? result.error?.message ?? '');
  }

  return (
    <section className="ark-auth">
      <p className="ark-auth__eyebrow">Compte {productName}</p>
      <p>{user.email}</p>
      {productName === 'Platform' ? (
        <p>Rôle : {user.role}</p>
      ) : (
        <p>{entitlements.length ? 'Premium actif' : 'Accès gratuit'}</p>
      )}
      <form onSubmit={update}>
        <label>
          Nom affiché
          <input name="displayName" defaultValue={user.displayName ?? ''} maxLength={80} />
        </label>
        <button type="submit">Enregistrer</button>
      </form>
      <div className="ark-account__actions">
        <a className="ark-account__link" href="https://account.arkanya.fr/dashboard">
          Gérer le compte Arkanya complet
        </a>
        <button
          className="ark-account__link ark-account__link--danger"
          type="button"
          onClick={() => void logout()}
        >
          Se déconnecter
        </button>
      </div>
      {message && <p className="ark-auth__message">{message}</p>}
    </section>
  );
}
