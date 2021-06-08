import { useSupabase } from './useSupabase';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { useEffect } from 'react';

import * as RD from '@devexperts/remote-data-ts';
import { useStable } from 'fp-ts-react-stable-hooks';
import * as S from 'fp-ts/string';
import * as E from 'fp-ts/Eq';
import { Filter } from '../types';

export const useTable = <T = any>(
  tableName: string,
  selectArgs: string = '*',
  filter?: Filter<T>,
  eq: E.Eq<T[]> = E.eqStrict
): RD.RemoteData<string, T[]> => {
  const supabase = useSupabase();

  const [result, setResult] = useStable<RD.RemoteData<string, T[]>>(
    RD.pending,
    RD.getEq(S.Eq, eq)
  );

  useEffect(() => {
    pipe(
      supabase,
      TE.fromOption(() => 'You must use useTable with a Provider!'),
      TE.chainTaskK(supabase => async () => {
        const req = supabase.from<T>(tableName).select(selectArgs);
        return await (filter ? filter(req) : req);
      }),
      TE.chain(({ data, error }) => {
        // TODO: Only print details and hint if there are details and hint
        if (error)
          return TE.left(`${error.message} - ${error.details} - ${error.hint}`);
        else return TE.right(data!);
      })
    )().then(result => setResult(RD.fromEither(result)));
  }, []);

  return result;
};
