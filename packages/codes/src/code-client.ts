import type { CodeProduct, CodeRedemptionResult, RedeemCode } from './types';

export function createCodeRedeemer(apiUrl: string): RedeemCode {
  return async (code: string, product: CodeProduct) => {
    try {
      const response = await fetch(`${apiUrl.replace(/\/$/, '')}/v1/codes/redeem`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, product }),
      });
      const result = (await response.json()) as CodeRedemptionResult;
      return result;
    } catch {
      return {
        ok: false,
        code: 'UNAVAILABLE',
        message: 'Le service des codes est momentanément indisponible.',
      };
    }
  };
}
