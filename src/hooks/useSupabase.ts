import { useContext } from 'react';
import { SupabaseContext } from '../context';
import * as O from 'fp-ts/Option';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Gets the current supabase client.
 * @returns A `SupabaseClient`, if it exists
 */
export const useSupabase = (): O.Option<SupabaseClient> => {
  const client = useContext(SupabaseContext);

  return O.fromNullable(client);
};
