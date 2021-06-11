import { useSupabase } from './useSupabase';
import * as RD from '@devexperts/remote-data-ts';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/lib/function';
import { useStable } from 'fp-ts-react-stable-hooks';
import * as S from 'fp-ts/string';
import * as E from 'fp-ts/Eq';
import { promiseLikeToTask, queryToTE } from '../utils';

/**
 * Inserts data into a supabase table.
 * @example
 * ```tsx
 * const [result, execute] = useInsert<Foo>("foo");
 *
 * pipe(
 *   result,
 *   RD.fold(
 *     () => (
 *       <button
 *         onClick={() =>
 *           execute({
 *             bar: "baz",
 *           })
 *         }
 *       >
 *         Click me
 *       </button>
 *     ),
 *     () => <div>Loading...</div>,
 *     (e) => <div>Error {e}</div>,
 *     (rows) => (
 *       <div>
 *         Inserted
 *         {rows.map((row) => (
 *           <div key={row.id}>{row.bar}</div>
 *         ))}
 *       </div>
 *     )
 *   )
 * );
 * ```
 * @param tableName - The name of the table you want to insert into
 * @param eq - An Eq for your data type
 * @returns The result of the request and a function to execute the insertion
 */
export const useInsert = <T = unknown>(
  tableName: string,
  eq: E.Eq<T[]> = E.eqStrict
): [
  RD.RemoteData<string, T[]>,
  (values: Partial<T> | Partial<T>[]) => Promise<void>
] => {
  const supabase = useSupabase();

  const [result, setResult] = useStable<RD.RemoteData<string, T[]>>(
    RD.initial,
    RD.getEq(S.Eq, eq)
  );

  const execute = async (values: Partial<T> | Partial<T>[]) => {
    setResult(RD.pending);
    pipe(
      supabase,
      TE.fromOption(constant('You must use useUpsert from inside a Provider!')),
      TE.map(supabase => supabase.from<T>(tableName).insert(values)),
      TE.chainTaskK(promiseLikeToTask),
      TE.chain(queryToTE)
    )().then(flow(RD.fromEither, setResult));
  };

  return [result, execute];
};
