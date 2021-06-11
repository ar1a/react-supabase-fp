import { useSupabase } from './useSupabase';
import * as RD from '@devexperts/remote-data-ts';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/lib/function';
import { Filter } from '../types';
import { useStable } from 'fp-ts-react-stable-hooks';
import * as S from 'fp-ts/string';
import * as E from 'fp-ts/Eq';
import { promiseLikeToTask, queryToTE } from '../utils';

/**
 * A hook to delete some rows from a supabase table
 * @param tableName - The table name to update inside of
 * @param eq - An Eq for your data type
 * @returns A list of rows that were deleted, and the function to delete them
 */
export const useUpdate = <T = unknown>(
  tableName: string,
  eq: E.Eq<T[]> = E.eqStrict
): [
  RD.RemoteData<string, T[]>,
  (values: Partial<T>, filter: Filter<T>) => Promise<void>
] => {
  const supabase = useSupabase();

  const [result, setResult] = useStable<RD.RemoteData<string, T[]>>(
    RD.initial,
    RD.getEq(S.Eq, eq)
  );

  const execute = async (values: Partial<T>, filter: Filter<T>) => {
    setResult(RD.pending);
    pipe(
      supabase,
      TE.fromOption(constant('You must use useUpdate from inside a Provider!')),
      TE.map(supabase => supabase.from<T>(tableName).update(values)),
      TE.map(filter),
      TE.chainTaskK(promiseLikeToTask),
      TE.chain(queryToTE)
    )().then(flow(RD.fromEither, setResult));
  };

  return [result, execute];
};
