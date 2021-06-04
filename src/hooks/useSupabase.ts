import { useContext } from 'react';
import { SupabaseContext } from '../context';
import * as O from 'fp-ts/Option';
import { SupabaseClient } from '@supabase/supabase-js';

export const useSupabase = (): O.Option<SupabaseClient> => {
  const client = useContext(SupabaseContext);

  return O.fromNullable(client);
};
