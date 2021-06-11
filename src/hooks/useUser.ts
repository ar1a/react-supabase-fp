import { User } from '@supabase/supabase-js';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import { useSupabase } from './useSupabase';

/**
 * A hook to return the current logged in user
 * @returns The logged in user, or `None` if there is none logged in
 */
export const useUser = (): O.Option<User> => {
  const supabase = useSupabase();
  return pipe(
    supabase,
    O.chainNullableK(supabase => supabase.auth.user())
  );
};

/**
 * A hook to check if a user is logged in
 * @returns true if the user is logged in
 */
export const useUserLoggedIn = (): boolean => {
  const user = useUser();
  return pipe(user, O.isSome);
};
