import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';

// ! This is from Postgrest-js but they don't export it????
type PostgrestError = {
  readonly message: string;
  readonly details: string;
  readonly hint: string;
  readonly code: string;
};

export const queryToTE = <T>({
  data,
  error,
}: {
  readonly data: T | null;
  readonly error: PostgrestError | null;
}): TE.TaskEither<string, T> =>
  error
    ? TE.left(`${error.message} - ${error.details} - ${error.hint}`)
    : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      TE.right(data!);

export const storageQueryToTE = <T>({
  data,
  error,
}: {
  readonly data: T | null;
  readonly error: Error | null;
}): TE.TaskEither<string, T> =>
  error
    ? TE.left(`${error.name} - ${error.message} - ${error.stack}`)
    : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      TE.right(data!);

export const promiseLikeToPromise = <T>(
  promiseLike: PromiseLike<T>
): Promise<T> => Promise.resolve(promiseLike);

export const promiseLikeToTask = <A>(
  promiseLike: PromiseLike<A>
): T.Task<A> => () => promiseLikeToPromise(promiseLike);
