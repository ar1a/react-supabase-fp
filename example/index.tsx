import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as RD from '@devexperts/remote-data-ts';
import { useState, ReactEventHandler } from 'react';
import { createClient } from '@supabase/supabase-js';
import { constant, pipe } from 'fp-ts/lib/function';
import { definitions } from './types/supabase';
import { Provider, useInsert, useTable } from '../.';

const client = createClient(
  'https://uxtxhzqpveqocjohidmf.supabase.co',
  process.env.SUPABASE_ANON_KEY!
);

const App = () => {
  return (
    <Provider value={client}>
      <Consumer />
    </Provider>
  );
};

const Consumer = () => {
  const result = useTable<definitions['test']>('test');
  const [insertResult, execute] = useInsert<definitions['test']>('test');
  const [input, setInput] = useState('');

  const onSubmit: ReactEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    execute({ text: input }).then(() => setInput(''));
    // TODO: Use reexecute to rerender page
  };

  return pipe(
    result,
    RD.fold3(
      constant(<div>Loading...</div>),
      e => <div>Query failed: {e}</div>,
      result => (
        <>
          <h1>Rows</h1>
          <form onSubmit={onSubmit}>
            Create a new entry:{' '}
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={RD.isPending(insertResult)}
            />
          </form>
          <div>
            {result.map(row => (
              <div key={row.id}>
                <h3>{row.text}</h3>
                {row.optional && <p>{row.optional}</p>}
              </div>
            ))}
          </div>
        </>
      )
    )
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
