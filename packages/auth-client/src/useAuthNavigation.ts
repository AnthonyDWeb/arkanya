'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const RETURN_KEY = 'arkanya:auth:returnTo';

export function useAuthNavigation() {
  const pathname = usePathname();
  const [returnTo, setReturnTo] = useState('/');

  useEffect(() => {
    const search = window.location.search;
    const currentPath = `${pathname}${search}`;
    if (!pathname.startsWith('/auth')) {
      const isTopLevel = pathname.split('/').filter(Boolean).length <= 1;
      if (isTopLevel) {
        window.sessionStorage.removeItem(RETURN_KEY);
        setReturnTo('/');
        return;
      }
      window.sessionStorage.setItem(RETURN_KEY, currentPath);
      setReturnTo(currentPath);
      return;
    }
    const requested = safeInternalPath(new URLSearchParams(search).get('returnTo'));
    if (requested) {
      window.sessionStorage.setItem(RETURN_KEY, requested);
      setReturnTo(requested);
      return;
    }
    window.sessionStorage.removeItem(RETURN_KEY);
    setReturnTo('/');
  }, [pathname]);

  function authHref(destination: '/auth' | '/auth/register') {
    return `${destination}?returnTo=${encodeURIComponent(returnTo)}`;
  }

  return { authHref, returnTo };
}

function safeInternalPath(value: string | null) {
  return value?.startsWith('/') && !value.startsWith('//') && !value.startsWith('/auth')
    ? value
    : null;
}
