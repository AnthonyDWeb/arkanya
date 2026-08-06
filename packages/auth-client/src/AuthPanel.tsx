'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLoader } from './AuthLoader';
import { useArkanyaAuth } from './AuthProvider';
import { useAuthNavigation } from './useAuthNavigation';

export function ArkanyaAuthPanel({
  productName,
  mode = 'login',
  successHref,
  allowRegistration = true,
}: {
  productName: string;
  mode?: 'login' | 'register';
  successHref?: string;
  allowRegistration?: boolean;
}) {
  const router = useRouter();
  const { client, user, loading, refresh, logout } = useArkanyaAuth();
  const { authHref, returnTo } = useAuthNavigation();
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);
  const [verificationNotice, setVerificationNotice] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setMessage('');
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const email = String(values.email ?? '');
    const password = String(values.password ?? '');
    const result =
      mode === 'register'
        ? await client.register(email, password, String(values.displayName ?? ''))
        : await client.login(email, password);
    if (result.ok) {
      await refresh();
      if (mode === 'register') {
        setPending(false);
        setVerificationNotice(true);
        return;
      }
      if (successHref) {
        router.replace(successHref);
        return;
      }
    }
    setPending(false);
    setMessage(result.message ?? result.error?.message ?? (result.ok ? 'Opération réussie.' : ''));
  }

  if (loading) return <AuthLoader />;
  if (verificationNotice) {
    return (
      <div className="ark-auth-dialog-backdrop">
        <section
          className="ark-auth ark-auth-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ark-auth-verification-title"
        >
          <p className="ark-auth__eyebrow">Compte créé</p>
          <h2 id="ark-auth-verification-title">Vérifiez votre adresse email</h2>
          <p>
            Un email de validation vient de vous être envoyé. Vous êtes connecté pour cette session,
            mais vous ne pourrez pas vous reconnecter plus tard tant que votre adresse email ne sera
            pas validée.
          </p>
          <button
            autoFocus
            type="button"
            onClick={() => {
              if (successHref) router.replace(successHref);
              else setVerificationNotice(false);
            }}
          >
            Continuer
          </button>
        </section>
      </div>
    );
  }
  if (user) {
    return (
      <section className="ark-auth">
        <p className="ark-auth__message">
          Vous êtes déjà connecté à {productName}. <Link href={returnTo}>Retour</Link>
        </p>
        <button className="ark-auth__link" type="button" onClick={() => void logout()}>
          Se déconnecter
        </button>
      </section>
    );
  }

  return (
    <section className="ark-auth">
      <p className="ark-auth__eyebrow">Compte Arkanya</p>
      <h1>{mode === 'register' ? 'Créer un compte' : `Se connecter à ${productName}`}</h1>
      <form onSubmit={submit}>
        {mode === 'register' && (
          <input name="displayName" placeholder="Nom affiché" maxLength={80} />
        )}
        <input name="email" type="email" placeholder="Adresse email" required />
        <input name="password" type="password" placeholder="Mot de passe" minLength={12} required />
        <button type="submit" disabled={pending}>
          {mode === 'register' ? 'Créer mon compte' : 'Se connecter'}
        </button>
      </form>
      {pending && (
        <AuthLoader
          label={mode === 'register' ? 'Création de votre compte…' : 'Connexion en cours…'}
        />
      )}
      {(mode === 'register' || allowRegistration) && (
        <Link
          className="ark-auth__link"
          href={authHref(mode === 'register' ? '/auth' : '/auth/register')}
        >
          {mode === 'register' ? 'J’ai déjà un compte' : 'Créer un compte'}
        </Link>
      )}
      {message && <p className="ark-auth__message">{message}</p>}
    </section>
  );
}
