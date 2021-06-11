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
 * Deletes data from a supabase table.
 * @example
 * ```tsx
 * const filter = useFilter<Foo>((query) => query.gt("id", "5"));
 * const [result, execute] = useDelete<Foo>("foo");
 *
 * pipe(
 *   result,
 *   RD.fold(
 *     () => <button onClick={() => execute(filter)}>Click me</button>,
 *     () => <div>Loading...</div>,
 *     (e) => <div>Error {e}</div>,
 *     (rows) => (
 *       <div>
 *         Deleted
 *         {rows.map((row) => (
 *           <div key={row.id}>{row.bar}</div>
 *         ))}
 *       </div>
 *     )
 *   )
 * );
 * ```
 * @param tableName - Name of the table you want to delete from
 * @param eq - Eq to compare your type
 * @returns A list of rows that were deleted, and the function to delete them
 */
export const useDelete = <T = unknown>(
  tableName: string,
  eq: E.Eq<T[]> = E.eqStrict
): [RD.RemoteData<string, T[]>, (filter: Filter<T>) => Promise<void>] => {
  const supabase = useSupabase();

  const [result, setResult] = useStable<RD.RemoteData<string, T[]>>(
    RD.initial,
    RD.getEq(S.Eq, eq)
  );

  const execute = async (filter: Filter<T>) => {
    setResult(RD.pending);
    pipe(
      supabase,
      TE.fromOption(constant('You must use useDelete from inside a Provider!')),
      TE.map(supabase => supabase.from<T>(tableName).delete()),
      TE.map(filter),
      TE.chainTaskK(promiseLikeToTask),
      TE.chain(queryToTE)
    )().then(flow(RD.fromEither, setResult));
  };

  return [result, execute];
};
