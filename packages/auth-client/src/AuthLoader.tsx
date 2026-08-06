export function AuthLoader({ label = 'Vérification de la connexion…' }: { label?: string }) {
  return (
    <div className="ark-auth-loader" role="status" aria-live="polite">
      <span className="ark-auth-loader__spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
