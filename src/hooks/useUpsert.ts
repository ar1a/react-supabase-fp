import { useSupabase } from './useSupabase';
import * as RD from '@devexperts/remote-data-ts';
import * as TE from 'fp-ts/TaskEither';
import { useState } from 'react';
import { constant, flow, identity, pipe } from 'fp-ts/lib/function';
import { Filter } from '../types';
import { promiseLikeToTask, queryToTE } from '../utils';

export const useUpsert = <T = unknown>(
  tableName: string
): [
  RD.RemoteData<string, T | T[]>,
  (values: Partial<T> | Partial<T>[], filter?: Filter<T>) => Promise<void>
] => {
  const supabase = useSupabase();

  // TODO: Figure out a way to do useStable/Eq for T | T[]
  const [result, setResult] = useState<RD.RemoteData<string, T | T[]>>(
    RD.initial
  );

  const execute = async (
    values: Partial<T> | Partial<T>[],
    filter?: Filter<T>
  ) => {
    setResult(RD.pending);
    pipe(
      supabase,
      TE.fromOption(constant('You must use useUpsert from inside a Provider!')),
      TE.map(supabase => supabase.from<T>(tableName).upsert(values)),
      TE.map(filter || identity),
      TE.chainTaskK(promiseLikeToTask),
      TE.chain(queryToTE)
    )().then(flow(RD.fromEither, setResult));
  };

  return [result, execute];
};
