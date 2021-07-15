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
 * Updates some rows from a supabase table.
 * @example
 * ```tsx
 * const filter = useFilter<Foo>((query) => query.eq("id", "1"));
 * const [result, execute] = useUpdate<Foo>("foo");
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
 * @param tableName - The table name to update inside of
 * @param eq - An Eq for your data type
 * @returns The rows that were updated, and a function to execute the update.
 */
export const useUpdate = <T = unknown>(
  tableName: string,
  eq: E.Eq<readonly T[]> = E.eqStrict
): readonly [
  RD.RemoteData<string, readonly T[]>,
  (values: Partial<T>, filter: Filter<T>) => Promise<void>
] => {
  const supabase = useSupabase();

  const [result, setResult] = useStable<RD.RemoteData<string, readonly T[]>>(
    RD.initial,
    RD.getEq(S.Eq, eq)
  );

  const execute = async (
    values: Partial<T>,
    filter: Filter<T>
  ): Promise<void> => {
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
