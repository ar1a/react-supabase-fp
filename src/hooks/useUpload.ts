import * as TE from 'fp-ts/TaskEither';
import * as RD from '@devexperts/remote-data-ts';
import { constant, flow, pipe } from 'fp-ts/lib/function';
import { useCallback, useState } from 'react';
import { useSupabase } from './useSupabase';
import { FileOptions } from '@supabase/storage-js';
import { storageQueryToTE } from '../utils';

type FileBody =
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
