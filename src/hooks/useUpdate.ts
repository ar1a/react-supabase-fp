import { useSupabase } from './useSupabase';
import * as RD from '@devexperts/remote-data-ts';
import * as TE from 'fp-ts/TaskEither';
import { useState } from 'react';
import { pipe } from 'fp-ts/lib/function';
import { Filter } from '../types';

export const useUpdate = <T = any>(
  tableName: string
): [
  RD.RemoteData<string, T | T[]>,
  (values: Partial<T>, filter: Filter<T>) => Promise<void>
] => {
  const supabase = useSupabase();

  // TODO: Figure out a way to do useStable/Eq for T | T[]
  const [result, setResult] = useState<RD.RemoteData<string, T | T[]>>(
    RD.initial
  );

  const execute = async (values: Partial<T>, filter: Filter<T>) => {
    setResult(RD.pending);
    pipe(
      supabase,
      TE.fromOption(() => 'You must use useUpsert from inside a Provider!'),
      TE.chainTaskK(supabase => async () =>
        await filter(supabase.from<T>(tableName).update(values))
      ),
      TE.chain(({ data, error }) => {
        if (error)
          return TE.left(`${error.message} - ${error.details} - ${error.hint}`);
        else return TE.right(data!);
      })
    )().then(result => setResult(RD.fromEither(result)));
  };

  return [result, execute];
};
