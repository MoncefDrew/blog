import { useEffect, useState, useCallback } from 'react';
import { tursoDb, type Session } from '@/lib/turso';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    tursoDb.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      if (isMounted) {
        setSession(data?.session ?? null);
        setLoading(false);
      }
    });

    const { data: authData } = tursoDb.auth.onAuthStateChange(
      (_event: string, newSession: Session | null) => {
        if (isMounted) {
          setSession(newSession);
        }
      }
    );

    return () => {
      isMounted = false;
      authData?.subscription?.unsubscribe?.();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    return tursoDb.auth.signInWithPassword({ email, password });
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    return tursoDb.auth.signUp({ email, password });
  }, []);

  const signOut = useCallback(async () => {
    return tursoDb.auth.signOut();
  }, []);

  return { session, loading, signIn, signUp, signOut };
}
