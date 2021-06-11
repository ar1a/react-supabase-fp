import { useSupabase } from './useSupabase';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, identity, pipe } from 'fp-ts/lib/function';
import { useEffect } from 'react';
import { useStable } from 'fp-ts-react-stable-hooks';
import * as RD from '@devexperts/remote-data-ts';
import * as S from 'fp-ts/string';
import * as E from 'fp-ts/Eq';
import { Filter } from '../types';
import { promiseLikeToTask, queryToTE } from '../utils';

/**
 * Gets a single row from a supabase table.
 *
 * @example
 * ```ts
 * const filter = useFilter<Foo>(query => query.eq('id', 2));
 * const result = useSingle<Foo>("foo", "id, bar", filter);
 * ```
 *
 * @param tableName - The table name to get a row from
 * @param selectArgs - Arguments for a select query
 * @param filter - A filter for your query
 * @param eq - An Eq for your data type
 * @returns A single row
 */
export const useSingle = <T = unknown>(
  tableName: string,
  selectArgs = '*',
  filter?: Filter<T>,
  eq: E.Eq<T> = E.eqStrict
): RD.RemoteData<string, T> => {
  const supabase = useSupabase();

  const [result, setResult] = useStable<RD.RemoteData<string, T>>(
    RD.pending,
    RD.getEq(S.Eq, eq)
  );

  useEffect(() => {
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
      TE.chain(queryToTE)
    )().then(flow(RD.fromEither, setResult));
  }, []);

  return result;
};
