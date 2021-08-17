import { constant, flow, pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import { useSupabase } from './useSupabase';
import { storageQueryToEither } from '../utils';
import * as RD from '@devexperts/remote-data-ts';
import { useEffect, useState } from 'react';

/**
 * Downloads a file from a storage bucket.
 * @param bucket - Name of the bucket
 * @param path - The path to download
 * @returns A blob of the file, or an error
 * @example
 * ```ts
 * const image = useDownload('test', 'public/test.png');

 * return pipe(
 *   image,
 *   RD.fold3(
 *     constant(<div>Loading...</div>), // Loading state
 *     e => <div>Query failed: {e}</div>, // on failure
 *     // on success
 *     result => <img src={URL.createObjectURL(result)} />
 *   )
 * );
 * ```
 */
export const useDownload = (
  bucket: string,
  path: string
): RD.RemoteData<string, Blob> => {
  const supabase = useSupabase();
  const [result, setResult] = useState<RD.RemoteData<string, Blob>>(RD.pending);
  useEffect(() => {
    pipe(
      supabase,
      TE.fromOption(constant('You must use useDownload with a Provider!')),
      TE.chainTaskK(s => () => s.storage.from(bucket).download(path)),
      TE.chainEitherK(storageQueryToEither)
    )().then(flow(RD.fromEither, setResult));
  }, [bucket, path]);

  return result;
};
