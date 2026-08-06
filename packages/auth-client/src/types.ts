export type AccountRole = 'user' | 'support' | 'admin' | 'owner';
export type AuthProduct = 'account' | 'arknest' | 'arkcare' | 'platform';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string | null;
  role: AccountRole;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface AuthResult<T = Record<string, never>> {
  ok: boolean;
  error?: AuthError;
  message?: string;
  user?: AuthUser;
  sessionToken?: string;
  data?: T;
}

export interface TokenStore {
  get(): Promise<string | null>;
  set(token: string): Promise<void>;
  clear(): Promise<void>;
}

export interface Entitlement {
  code: string;
  value: unknown;
  startsAt: string;
  endsAt: string | null;
  sourceType: string;
}
