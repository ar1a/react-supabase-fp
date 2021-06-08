TODO LIST:

- figure out filtering. how does react-supabase do it?

```ts
export type Filter<Data> = (
  query: PostgrestFilterBuilder<Data>
) => PostgrestFilterBuilder<Data>;
```

```ts
export function useFilter<Data = any>(filter: Filter<Data>, deps: any[] = []) {
  /* eslint-disable react-hooks/exhaustive-deps */
  const callback = useCallback(filter, deps);
  /* eslint-enable react-hooks/exhaustive-deps */
  return callback;
}
```

- useDelete
- useInsert
- useUpdate
- useTable rename to useSelect?

- useUser
- some other auth related things?

- storage stuff

- realtime data hooks monka
