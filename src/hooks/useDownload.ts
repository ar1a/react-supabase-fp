import { constant, flow, pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import { useSupabase } from './useSupabase';
import { storageQueryToTE } from '../utils';
import * as RD from '@devexperts/remote-data-ts';
import { useEffect, useState } from 'react';

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
      TE.chain(storageQueryToTE)
    )().then(flow(RD.fromEither, setResult));
  }, [bucket, path]);

  return result;
};
