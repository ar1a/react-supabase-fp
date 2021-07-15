import { useSupabase } from './useSupabase';
import * as RD from '@devexperts/remote-data-ts';
import * as TO from 'fp-ts/TaskOption';
import * as O from 'fp-ts/Option';
import { Session, UserCredentials } from '@supabase/gotrue-js';
import { useCallback, useState } from 'react';
import { pipe } from 'fp-ts/lib/function';

export type UseSignInOptions = {
  readonly redirectTo?: string;
  readonly scopes?: string;
};

/**
 * Signs in a user.
 * @returns The result of the signing in, and a function to sign a user in.
 * @example
 * ```ts
 *   const [result, execute] = useSignIn();

 *   return (
 *     <div>
 *       <button
 *         onClick={e => {
 *           e.preventDefault();
 *           execute({ provider: 'google' });
 *         }}
 *       >
 *         Log in
 *       </button>
 *     </div>
 *   );
 * ```
 */
export const useSignIn = (): readonly [
  RD.RemoteData<Error, Session>,
  (credentials: UserCredentials, options?: UseSignInOptions) => Promise<void>
] => {
  const supabase = useSupabase();
  const [result, setResult] = useState<RD.RemoteData<Error, Session>>(
    RD.initial
  );

  const execute = useCallback(
    async (credentials: UserCredentials, options?: UseSignInOptions) => {
      setResult(RD.pending);
      await pipe(
        supabase,
        TO.fromOption,
        TO.chainTaskK(s => () => s.auth.signIn(credentials, options)),
        TO.match(
          () => {
            setResult(RD.failure(new Error('No client found')));
          },
          x => {
            if (x.error) {
              setResult(RD.failure(x.error));
            } else {
              pipe(
                x.session,
                O.fromNullable,
                x =>
                  RD.fromOption(
                    x,
                    () => new Error('Did not return a session.')
                  ),
                setResult
              );
            }
          }
        )
      )();
    },
    [supabase]
  );

  return [result, execute];
};
