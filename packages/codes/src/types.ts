export type CodeProduct = 'arknest' | 'arkcare' | 'arkanya';

export type CodeEffect = 'temporary_access' | 'permanent_access';

export interface CodeRedemptionSuccess {
  ok: true;
  code: string;
  title: string;
  message: string;
  effect: CodeEffect;
  validUntil?: string;
}

export interface CodeRedemptionFailure {
  ok: false;
  code:
    'INVALID_CODE' | 'INELIGIBLE' | 'EXPIRED' | 'LIMIT_REACHED' | 'UNAUTHENTICATED' | 'UNAVAILABLE';
  message: string;
}

export type CodeRedemptionResult = CodeRedemptionSuccess | CodeRedemptionFailure;
export type RedeemCode = (code: string, product: CodeProduct) => Promise<CodeRedemptionResult>;
