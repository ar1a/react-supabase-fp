import { useCallback } from 'react';
import { Filter } from '../types';

export const useFilter = <Data = unknown>(
  filter: Filter<Data>,
  deps: unknown[] = []
): Filter<Data> => {
  const callback = useCallback(filter, deps);
  return callback;
};
