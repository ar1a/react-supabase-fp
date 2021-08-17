import * as TE from 'fp-ts/TaskEither';
import * as RD from '@devexperts/remote-data-ts';
import { constant, flow, pipe } from 'fp-ts/lib/function';
import { useCallback, useState } from 'react';
import { useSupabase } from './useSupabase';
import { FileOptions } from '@supabase/storage-js';
import { storageQueryToTE } from '../utils';

/**
 * Things you can upload to a storage bucket. Defined by Supabase's storage-js.
 */
export type FileBody =
  | ArrayBuffer
  | ArrayBufferView
  | Blob
  | Buffer
  | File
  | FormData
  | NodeJS.ReadableStream
  | ReadableStream<Uint8Array>
  | URLSearchParams
  | string;

/**
 * Uploads a file to a storage bucket.
 * @param bucket - Bucket to upload to
 * @returns A function that uploads a file to a bucket, and the result of the upload
 * @example
 * ```ts
 * const [result, upload] = useUpload('test');
 * const [file, setFile] = useState<File | undefined>();
 *  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = e =>
 *   setFile(e.target.files?.[0]);
 *  // eslint-disable-next-line functional/no-return-void
 * const clickHandler = (): void => {
 *   if (file) {
 *     upload('public/example.png', file, { upsert: true });
 *   }
 * };
 *  return pipe(
 *   result,
 *   RD.fold(
 *     () => (
 *       <div>
 *         <input type="file" name="file" onChange={changeHandler} />
 *         <button onClick={clickHandler}>Upload</button>
 *       </div>
 *     ),
 *     constant(<div>Loading...</div>), // Loading state
 *     e => <div>Query failed: {e}</div>, // on failure
 *     // on suceess
 *     result => <div>Key: {result}</div>
 *   )
 * );
 * ```
 */
export const useUpload = (
  bucket: string
): readonly [
  RD.RemoteData<string, string>,
  (path: string, fileBody: FileBody, fileOptions?: FileOptions) => Promise<void>
] => {
  const supabase = useSupabase();
  const [result, setResult] = useState<RD.RemoteData<string, string>>(
    RD.initial
  );

  const upload = useCallback(
    (path: string, fileBody: FileBody, fileOptions?: FileOptions) => {
      setResult(RD.pending);
      return pipe(
        supabase,
        TE.fromOption(constant('You must use useDownload with a Provider!')),
        TE.chainTaskK(s => () =>
          s.storage.from(bucket).upload(path, fileBody, fileOptions)
        ),
        TE.chain(storageQueryToTE),
        TE.map(x => x.Key)
      )().then(flow(RD.fromEither, setResult));
    },
    [bucket]
  );

  return [result, upload];
};
