'use client';

import { useState, type FormEvent } from 'react';
import { isCodeFormatValid, normalizeCode } from './normalize-code.mjs';
import type { CodeProduct, CodeRedemptionResult, RedeemCode } from './types';

interface CodeRedemptionFormProps {
  product: CodeProduct;
  redeemCode: RedeemCode;
  title?: string;
  description?: string;
}

export function CodeRedemptionForm({
  product,
  redeemCode,
  title = 'Vous avez un code ?',
  description = 'Saisissez votre code pour appliquer automatiquement l’avantage associé.',
}: CodeRedemptionFormProps) {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<CodeRedemptionResult | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = normalizeCode(code);
    if (!isCodeFormatValid(normalized)) {
      setResult({ ok: false, code: 'INVALID_CODE', message: 'Saisissez un code valide.' });
      return;
    }
    setPending(true);
    setResult(await redeemCode(normalized, product));
    setPending(false);
  }

  return (
    <section className="ark-code-card" aria-labelledby={`code-title-${product}`}>
      <div>
        <h2 id={`code-title-${product}`}>{title}</h2>
        <p>{description}</p>
      </div>
      <form className="ark-code-form" onSubmit={handleSubmit}>
        <label htmlFor={`ark-code-${product}`}>Code</label>
        <div className="ark-code-row">
          <input
            id={`ark-code-${product}`}
            value={code}
            onChange={(event) => {
              setCode(event.target.value);
              setResult(null);
            }}
            autoComplete="off"
            inputMode="text"
            maxLength={64}
            placeholder="VOTRE-CODE"
            required
          />
          <button type="submit" disabled={pending}>
            {pending ? 'Vérification…' : 'Appliquer'}
          </button>
        </div>
      </form>
      {result ? (
        <p className={result.ok ? 'ark-code-result is-success' : 'ark-code-result is-error'}>
          {result.message}
        </p>
      ) : null}
    </section>
  );
}
