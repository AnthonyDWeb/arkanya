import type { AuthProduct, AuthResult, AuthUser, Entitlement, TokenStore } from './types';

export interface AuthClientOptions {
  apiUrl: string;
  product: AuthProduct;
  tokenStore?: TokenStore;
}

export class ArkanyaAuthClient {
  private readonly apiUrl: string;
  private readonly product: AuthProduct;
  private readonly tokenStore?: TokenStore;

  constructor({ apiUrl, product, tokenStore }: AuthClientOptions) {
    this.apiUrl = apiUrl.replace(/\/$/, '');
    this.product = product;
    this.tokenStore = tokenStore;
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<AuthResult<T>> {
    try {
      const token = await this.tokenStore?.get();
      const response = await fetch(`${this.apiUrl}${path}`, {
        ...init,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Arkanya-Product': this.product,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...init.headers,
        },
      });
      const result = (await response.json().catch(() => ({}))) as AuthResult<T>;
      if (!response.ok) {
        return {
          ok: false,
          error: result.error ?? { code: 'REQUEST_FAILED', message: 'La demande a échoué.' },
        };
      }
      return { ...result, ok: true };
    } catch {
      return {
        ok: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Le service Arkanya est momentanément inaccessible.',
        },
      };
    }
  }

  async register(email: string, password: string, displayName?: string) {
    const result = await this.request('/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        displayName,
        sessionMode: this.tokenStore ? 'token' : 'cookie',
      }),
    });
    if (result.ok && result.sessionToken && this.tokenStore) {
      await this.tokenStore.set(result.sessionToken);
      delete result.sessionToken;
    }
    return result;
  }

  async login(email: string, password: string) {
    const result = await this.request('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        sessionMode: this.tokenStore ? 'token' : 'cookie',
      }),
    });
    if (result.ok && result.sessionToken && this.tokenStore) {
      await this.tokenStore.set(result.sessionToken);
      delete result.sessionToken;
    }
    return result;
  }

  me() {
    return this.request<{ user: AuthUser }>('/auth/me', { method: 'GET' });
  }

  async logout() {
    const result = await this.request('/v1/auth/logout', { method: 'POST', body: '{}' });
    await this.tokenStore?.clear();
    return result;
  }

  entitlements(product?: 'arknest' | 'arkcare') {
    const query = product ? `?product=${encodeURIComponent(product)}` : '';
    return this.request<{ entitlements: Entitlement[] }>(`/v1/entitlements${query}`);
  }

  forgotPassword(email: string) {
    return this.request('/v1/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  updateProfile(displayName: string) {
    return this.request<{ user: AuthUser }>('/v1/account/profile', {
      method: 'PATCH',
      body: JSON.stringify({ displayName }),
    });
  }
}
