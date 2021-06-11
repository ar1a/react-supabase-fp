import { User } from '@supabase/supabase-js';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import { useSupabase } from './useSupabase';

/**
 * Returns the current logged in user, or `None` if no one is logged in
 */
export const useUser = (): O.Option<User> => {
  const supabase = useSupabase();
  return pipe(
    supabase,
    O.chainNullableK(supabase => supabase.auth.user())
  );
};

/**
 * Returns `true` if a user is logged in
 */
export const useUserLoggedIn = (): boolean => {
  const user = useUser();
  return pipe(user, O.isSome);
};
