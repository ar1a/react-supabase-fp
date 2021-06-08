import { useCallback } from 'react';
import { Filter } from '../types';

export const useFilter = <Data = any>(
  filter: Filter<Data>,
  deps: any[] = []
) => {
  const callback = useCallback(filter, deps);
  return callback;
};
