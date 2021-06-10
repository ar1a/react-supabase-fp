import * as TE from 'fp-ts/TaskEither';

// ! This is from Postgrest-js but they don't export it????
type PostgrestError = {
  message: string;
  details: string;
  hint: string;
  code: string;
};

export const queryToTE = <T>({
  data,
  error,
}: {
  data: T | null;
  error: PostgrestError | null;
}): TE.TaskEither<string, T> =>
  error
    ? TE.left(`${error.message} - ${error.details} - ${error.hint}`)
    : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      TE.right(data!);
