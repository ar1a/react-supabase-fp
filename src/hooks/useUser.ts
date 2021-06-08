import { User } from '@supabase/supabase-js';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import { useSupabase } from './useSupabase';

export const useUser = (): O.Option<User> => {
  const supabase = useSupabase();
  return pipe(
    supabase,
    O.chainNullableK(supabase => supabase.auth.user())
  );
};

// returns true if the user is logged in
export const useUserLoggedIn = (): boolean => {
  const user = useUser();
  return pipe(user, O.isSome);
};
