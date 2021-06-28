import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import { useEffect, useState } from 'react';
import { useSupabase } from './useSupabase';

const useAuthStateChange = (
  callback: (event: AuthChangeEvent, session: Session | null) => void
) => {
  const supabase = useSupabase();

  useEffect(() => {
    const listener = pipe(
      supabase,
      O.map(s => s.auth.onAuthStateChange(callback))
    );
    return () => {
      pipe(
        listener,
        O.map(x => x.data?.unsubscribe())
      );
    };
  }, [supabase]);
};

/**
 * Returns the current logged in user, or `None` if no one is logged in
 */
export const useUser = (): O.Option<User> => {
  const supabase = useSupabase();
  const [user, setUser] = useState<O.Option<User>>(O.none);
  useEffect(
    () =>
      pipe(
        supabase,
        O.chainNullableK(s => s.auth.session()),
        O.chainNullableK(x => x.user),
        setUser
      ),
    []
  );
  useAuthStateChange((_, session) =>
    pipe(session?.user, O.fromNullable, setUser)
  );
  return user;
};

/**
 * Returns `true` if a user is logged in
 */
export const useUserLoggedIn = (): boolean => {
  const user = useUser();
  return pipe(user, O.isSome);
};
