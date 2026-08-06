'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ArkanyaAuthClient, type AuthClientOptions } from './client';
import {
  AUTH_CACHE_TTL,
  clearAuthSnapshot,
  isSnapshotFresh,
  readAuthSnapshot,
  writeAuthSnapshot,
} from './authCache';
import type { AuthProduct, AuthUser, Entitlement } from './types';

interface AuthContextValue {
  client: ArkanyaAuthClient;
  user: AuthUser | null;
  entitlements: Entitlement[];
  loading: boolean;
  refresh(): Promise<void>;
  logout(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function ArkanyaAuthProvider({
  children,
  ...options
}: AuthClientOptions & { children: React.ReactNode }) {
  const client = useMemo(() => new ArkanyaAuthClient(options), [options.apiUrl, options.product]);
  const snapshotRef = useRef<ReturnType<typeof readAuthSnapshot>>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [loading, setLoading] = useState(true);

  const revalidate = useCallback(async () => {
    const result = await client.me();
    if (!result.ok) {
      if (result.error?.code === 'UNAUTHORIZED') {
        setUser(null);
        setEntitlements([]);
        snapshotRef.current = { user: null, entitlements: [], checkedAt: Date.now() };
        writeAuthSnapshot(options.product, snapshotRef.current);
      }
      setLoading(false);
      return;
    }
    const nextUser = result.data?.user ?? result.user ?? null;
    let nextRights = snapshotRef.current?.entitlements ?? [];
    if (nextUser && isProductWithEntitlements(options.product)) {
      const rights = await client.entitlements(options.product);
      if (rights.ok) nextRights = rights.data?.entitlements ?? [];
    } else {
      nextRights = [];
    }
    setUser(nextUser);
    setEntitlements(nextRights);
    snapshotRef.current = {
      user: nextUser,
      entitlements: nextRights,
      checkedAt: Date.now(),
    };
    writeAuthSnapshot(options.product, snapshotRef.current);
    setLoading(false);
  }, [client, options.product]);

  const logout = useCallback(async () => {
    await client.logout();
    setUser(null);
    setEntitlements([]);
    snapshotRef.current = null;
    clearAuthSnapshot(options.product);
  }, [client, options.product]);

  useEffect(() => {
    const cached = readAuthSnapshot(options.product);
    snapshotRef.current = cached;
    if (cached) {
      setUser(cached.user);
      setEntitlements(cached.entitlements);
      setLoading(false);
    }
    const fresh = isSnapshotFresh(cached);
    if (!fresh) void revalidate();
    const remaining =
      fresh && cached
        ? Math.max(1000, AUTH_CACHE_TTL - (Date.now() - cached.checkedAt))
        : AUTH_CACHE_TTL;
    if (!cached?.user) return;
    const timer = window.setTimeout(() => void revalidate(), remaining);
    return () => window.clearTimeout(timer);
  }, [options.product, revalidate]);

  return (
    <AuthContext.Provider
      value={{ client, user, entitlements, loading, refresh: revalidate, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function isProductWithEntitlements(
  product: AuthProduct,
): product is Extract<AuthProduct, 'arknest' | 'arkcare'> {
  return product === 'arknest' || product === 'arkcare';
}

export function useArkanyaAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useArkanyaAuth doit être utilisé dans ArkanyaAuthProvider.');
  return value;
}
