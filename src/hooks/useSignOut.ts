import * as RD from '@devexperts/remote-data-ts';
import { pipe } from 'fp-ts/lib/function';
import * as TO from 'fp-ts/TaskOption';
import { useCallback, useState } from 'react';
import { useSupabase } from './useSupabase';

/**
 * Signs out a user.
 * @returns The result of the signing out, and a function to sign a user out.
 * @example
 * ```ts
 * const [result, signOut] = useSignOut();
 *
 * return (
 *   <button
 *     onClick={(e) => {
 *       e.preventDefault();
 *       signOut();
 *     }}
 *   >
 *     Sign out
 *   </button>
 * );
 *
 * ```
 */
export const useSignOut = (): readonly [
  RD.RemoteData<Error, void>,
  () => Promise<void>
] => {
  const supabase = useSupabase();
  const [result, setResult] = useState<RD.RemoteData<Error, void>>(RD.initial);
  const execute = useCallback(
    () =>
      pipe(
        supabase,
        TO.fromOption,
        TO.chainTaskK(s => s.auth.signOut),
        TO.match(
          () => setResult(RD.failure(new Error('Supabase client not found'))),
          ({ error }) => {
            if (error) {
              setResult(RD.failure(Error(error.message)));
            } else {
              setResult(RD.success(undefined));
            }
          }
        )
      )(),
    [supabase]
  );
  return [result, execute];
};
