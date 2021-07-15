import { useCallback } from 'react';
import { Filter } from '../types';

/**
 *  Creates a react-safe filter for use in other hooks.
 *
 * @example
 * ```ts
 * const filter = useFilter<Foo>(query => query.eq('id', 1));
 * ```
 *
 * @param filter - A function that filters your query
 * @param deps - An array of deps to regenerate your `filter`
 * @returns A filter
 */
export const useFilter = <Data = unknown>(
  filter: Filter<Data>,
  deps: readonly unknown[] = []
): Filter<Data> => {
  const callback = useCallback(filter, deps);
  return callback;
};
