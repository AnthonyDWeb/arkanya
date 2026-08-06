import type { AuthProduct, AuthUser, Entitlement } from './types';

export const AUTH_CACHE_TTL = 5 * 60 * 1000;

export interface AuthSnapshot {
  user: AuthUser | null;
  entitlements: Entitlement[];
  checkedAt: number;
}

function cacheKey(product: AuthProduct) {
  return `arkanya:auth:${product}`;
}

export function readAuthSnapshot(product: AuthProduct): AuthSnapshot | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = JSON.parse(window.sessionStorage.getItem(cacheKey(product)) ?? 'null');
    if (!value || typeof value.checkedAt !== 'number') return null;
    return {
      user: value.user ?? null,
      entitlements: Array.isArray(value.entitlements)
        ? value.entitlements.filter((right: Entitlement) => !isExpired(right))
        : [],
      checkedAt: value.checkedAt,
    };
  } catch {
    return null;
  }
}

export function writeAuthSnapshot(product: AuthProduct, snapshot: AuthSnapshot) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(cacheKey(product), JSON.stringify(snapshot));
}

export function clearAuthSnapshot(product: AuthProduct) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(cacheKey(product));
}

export function isSnapshotFresh(snapshot: AuthSnapshot | null) {
  return Boolean(snapshot && Date.now() - snapshot.checkedAt < AUTH_CACHE_TTL);
}

function isExpired(entitlement: Entitlement) {
  return entitlement.endsAt !== null && new Date(entitlement.endsAt).getTime() <= Date.now();
}
