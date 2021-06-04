import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, useSingle, useTable, useUpsert } from '../.';
import { createClient } from '@supabase/supabase-js';
import * as RD from '@devexperts/remote-data-ts';
import { constant, pipe } from 'fp-ts/lib/function';
import { definitions } from './types/supabase';

const App = () => {
  const client = createClient(
    'https://uxtxhzqpveqocjohidmf.supabase.co',
    process.env.SUPABASE_ANON_KEY!
  );

  return (
    <Provider value={client}>
      <Consumer />
    </Provider>
  );
};

const Consumer = () => {
  const result = useSingle<definitions['test']>('test');
  const [upsertResult, execute] = useUpsert<definitions['test']>('test');
  return pipe(
    result,
    RD.fold(
      constant(<div>Should be impossible</div>),
      constant(<div>Loading...</div>),
      e => <div>Fucken failed: {e}</div>,
      result => {
        return (
          <div>
            {<div key={result.id}>{result.text}</div>}
            <button
              onClick={() =>
                execute({
                  ...result,
                  text: result.text + ' UPDATED',
                })
              }
            >
              Update
            </button>
          </div>
        );
      }
    )
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
