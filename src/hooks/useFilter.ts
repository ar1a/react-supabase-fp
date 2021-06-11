import { useCallback } from 'react';
import { Filter } from '../types';

/**
 *  A hook to create a filter for use in other hooks
 * @param filter - A function that filters your query
 * @param deps - An array of deps to regenerate your `filter`
 * @returns
 */
export const useFilter = <Data = unknown>(
  filter: Filter<Data>,
  deps: unknown[] = []
): Filter<Data> => {
  const callback = useCallback(filter, deps);
  return callback;
};
