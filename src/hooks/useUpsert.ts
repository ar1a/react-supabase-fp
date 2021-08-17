import { useSupabase } from './useSupabase';
import * as RD from '@devexperts/remote-data-ts';
import * as TE from 'fp-ts/TaskEither';
import { useState } from 'react';
import { constant, flow, identity, pipe } from 'fp-ts/lib/function';
import { Filter } from '../types';
import { promiseLikeToTask, queryToEither } from '../utils';

/**
 * Upserts into a supabase table.
 * @example
 * ```tsx
 * const filter = useFilter<Foo>((query) => query.eq("id", "1"));
 * const [result, execute] = useUpsert<Foo>("foo");
 *
 * pipe(
 *   result,
 *   RD.fold(
 *     () => <button onClick={() => execute({ bar: "baz" }, filter)}></button>,
 *     () => <div>Loading...</div>,
 *     (e) => <div>Error {e}</div>,
 *     (rows) => (
 *       <div>
 *         Updated
 *         {rows.map((row) => (
 *           <div key={row.id}>
 *             {row.id} - {row.bar}
 *           </div>
 *         ))}
 *       </div>
 *     )
 *   )
 * );
 * ```
 * @param tableName - The table name to upsert into
 * @returns The rows that were updated
 */
export const useUpsert = <T = unknown>(
  tableName: string
): readonly [
  RD.RemoteData<string, readonly T[]>,
  // eslint-disable-next-line functional/prefer-readonly-type
  (values: Partial<T> | Partial<T>[], filter?: Filter<T>) => Promise<void>
] => {
  const supabase = useSupabase();

  const [result, setResult] = useState<RD.RemoteData<string, readonly T[]>>(
    RD.initial
  );

  const execute = async (
    // eslint-disable-next-line functional/prefer-readonly-type
    values: Partial<T> | Partial<T>[],
    filter?: Filter<T>
  ): Promise<void> => {
    setResult(RD.pending);
    pipe(
      supabase,
      TE.fromOption(constant('You must use useUpsert from inside a Provider!')),
      TE.map(supabase => supabase.from<T>(tableName).upsert(values)),
      TE.map(filter || identity),
      TE.chainTaskK(promiseLikeToTask),
      TE.chainEitherK(queryToEither)
    )().then(flow(RD.fromEither, setResult));
  };

  return [result, execute];
};
