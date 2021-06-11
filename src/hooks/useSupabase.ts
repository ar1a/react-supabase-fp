import { useContext } from 'react';
import { SupabaseContext } from '../context';
import * as O from 'fp-ts/Option';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * A hook to get the current supabase client
 * @returns A `SupabaseClient`, if it exists
 */
export const useSupabase = (): O.Option<SupabaseClient> => {
  const client = useContext(SupabaseContext);

  return O.fromNullable(client);
};
