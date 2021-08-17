import { useSupabase } from './useSupabase';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, identity, pipe } from 'fp-ts/lib/function';
import { useCallback, useEffect } from 'react';
import { useStable } from 'fp-ts-react-stable-hooks';
import * as RD from '@devexperts/remote-data-ts';
import * as S from 'fp-ts/string';
import * as E from 'fp-ts/Eq';
import { Filter } from '../types';
import { promiseLikeToTask, queryToEither } from '../utils';

export type UseSingleResponse<T> = readonly [
  RD.RemoteData<string, T>,
  () => Promise<void>
];

/**
 * Gets a single row from a supabase table.
 *
 * @example
 * ```ts
 * const filter = useFilter<Foo>((query) => query.gt("id", "5"));
 * const [result, execute] = useSingle<Foo>("foo", "*", filter);
 *
 * pipe(
 *   result,
 *   RD.fold3(
 *     () => <div>Loading...</div>,
 *     (e) => <div>Error {e}</div>,
 *     (row) => <div>{row.bar}</div>
 *   )
 * );
 * ```
 *
 * @param tableName - The table name to get a row from
 * @param selectArgs - Arguments for a select query
 * @param filter - A filter for your query
 * @param eq - An Eq for your data type
 * @returns A single row, and a function to reexecute the query
 */
export const useSingle = <T = unknown>(
  tableName: string,
  selectArgs = '*',
  filter?: Filter<T>,
  eq: E.Eq<T> = E.eqStrict
): UseSingleResponse<T> => {
  const supabase = useSupabase();

  const [result, setResult] = useStable<RD.RemoteData<string, T>>(
    RD.pending,
    RD.getEq(S.Eq, eq)
  );

  const execute = useCallback(
    () =>
      pipe(
        supabase,
        TE.fromOption(constant('You must use useSingle with a Provider!')),
        TE.map(supabase =>
          supabase
            .from<T>(tableName)
            .select(selectArgs)
            .limit(1)
        ),
        TE.map(filter || identity),
        TE.map(x => x.single()),
        TE.chainTaskK(promiseLikeToTask),
        TE.chainEitherK(queryToEither)
      )().then(flow(RD.fromEither, setResult)),
    [supabase, tableName, selectArgs, filter]
  );

  useEffect(() => {
    execute();
  }, []);

  return [result, execute];
};
