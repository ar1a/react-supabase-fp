import { useSupabase } from './useSupabase';
import * as RD from '@devexperts/remote-data-ts';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { Filter } from '../types';
import { useStable } from 'fp-ts-react-stable-hooks';
import * as S from 'fp-ts/string';
import * as E from 'fp-ts/Eq';

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
      TE.fromOption(() => 'You must use useUpdate from inside a Provider!'),
      TE.chainTaskK(supabase => async () =>
        await filter(supabase.from<T>(tableName).update(values))
      ),
      TE.chain(({ data, error }) => {
        if (error)
          return TE.left(`${error.message} - ${error.details} - ${error.hint}`);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        else return TE.right(data!);
      })
    )().then(result => setResult(RD.fromEither(result)));
  };

  return [result, execute];
};