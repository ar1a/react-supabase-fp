import { useSupabase } from './useSupabase';
import * as RD from '@devexperts/remote-data-ts';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/lib/function';
import { useStable } from 'fp-ts-react-stable-hooks';
import * as S from 'fp-ts/string';
import * as E from 'fp-ts/Eq';
import { queryToTE } from '../utils';

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
      TE.chainTaskK(supabase => async () =>
        await supabase.from<T>(tableName).insert(values)
      ),
      TE.chain(queryToTE)
    )().then(flow(RD.fromEither, setResult));
  };

  return [result, execute];
};
