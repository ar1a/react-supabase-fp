import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';

// ! This is from Postgrest-js but they don't export it????
type PostgrestError = {
  readonly message: string;
  readonly details: string;
  readonly hint: string;
  readonly code: string;
};

export const queryToEither = <T>({
  data,
  error,
}: {
  readonly data: T | null;
  readonly error: PostgrestError | null;
}): E.Either<string, T> =>
  error
    ? E.left(`${error.message} - ${error.details} - ${error.hint}`)
    : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      E.right(data!);

export const storageQueryToEither = <T>({
  data,
  error,
}: {
  readonly data: T | null;
  readonly error: Error | null;
}): E.Either<string, T> =>
  error
    ? E.left(`${error.name} - ${error.message} - ${error.stack}`)
    : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      E.right(data!);

export const promiseLikeToPromise = <T>(
  promiseLike: PromiseLike<T>
): Promise<T> => Promise.resolve(promiseLike);

export const promiseLikeToTask = <A>(
  promiseLike: PromiseLike<A>
): T.Task<A> => () => promiseLikeToPromise(promiseLike);
