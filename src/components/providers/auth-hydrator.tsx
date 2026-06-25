'use client';

import { useEffect } from 'react';
import { fetchSession } from '@/lib/api/auth';
import { UNAUTHORIZED_EVENT } from '@/lib/api/http';
import { toReduxUser } from '@/lib/auth/credentials';
import { useAppDispatch } from '@/lib/hooks/redux';
import { setUser, logout, setLoading } from '@/store/slices/authSlice';

export function AuthHydrator() {
  const dispatch = useAppDispatch();

  // Hydrate on mount
  useEffect(() => {
    let cancelled = false;

    fetchSession()
      .then(({ user }) => {
        if (cancelled) return;
        if (user) dispatch(setUser(toReduxUser(user)));
        else dispatch(logout());
      })
      .catch(() => { if (!cancelled) dispatch(logout()); })
      .finally(() => { if (!cancelled) dispatch(setLoading(false)); });

    return () => { cancelled = true; };
  }, [dispatch]);

  // Global 401 listener — any API call that returns 401 triggers logout
  useEffect(() => {
    const handle = () => {
      dispatch(logout());
    };
    window.addEventListener(UNAUTHORIZED_EVENT, handle);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handle);
  }, [dispatch]);

  return null;
}
