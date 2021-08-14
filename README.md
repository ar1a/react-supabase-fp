# react-supabase-fp

![](https://img.shields.io/bundlephobia/min/react-supabase-fp?label=bundle%20size)
![](https://img.shields.io/npm/dw/react-supabase-fp)
![](https://img.shields.io/npm/l/react-supabase-fp)
[![](https://img.shields.io/npm/v/react-supabase-fp)][npm]

react-supabase-fp is a Typescript library for using
[supabase](https://supabase.io) with React and
[fp-ts](https://gcanti.github.io/fp-ts/).

[Docs](https://ar1a.github.io/react-supabase-fp/)
[Github](https://www.github.com/ar1a/react-supabase-fp)

## Installation

Install react-supabase-fp with `yarn` or `npm`:

```bash
yarn add react-supabase-fp fp-ts @devexperts/remote-data-ts @supabase/supabase-js
```

See also: [fp-ts](https://gcanti.github.io/fp-ts/) and [remote-data-ts](https://github.com/devexperts/remote-data-ts)

## Features

- [x] Auth
- [x] Data
- [x] Filters
- [x] Code examples for all functions
- [ ] Realtime
- [ ] Storage

## Usage

```ts
const filter = useFilter<definitions['example']>(query =>
  query.contains('type', 'published')
);
const [result, reexecute] = useTable<definitions['example']>(
  'example',
  '*',
  filter
);

return pipe(
  result,
  RD.fold3(
    // constant = x => () => x
    constant(<div>Loading...</div>), // used when in loading state
    e => <div>Query failed: {e}</div>, // used when in an error state
    // used on success
    result => (
      <>
        <h1>Published posts</h1>
        <div>
          {result.map(row => (
            <div key={row.id}>
              <h2>{row.text}</h2>
              {row.optional && <p>{row.optional}</p>}
            </div>
          ))}
        </div>
      </>
    )
  )
);
```

See the example folder for more.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[ISC](https://choosealicense.com/licenses/isc/)

[npm]: https://www.npmjs.com/package/react-supabase-fp
