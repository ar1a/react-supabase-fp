import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, useTable } from '../.';
import { createClient } from '@supabase/supabase-js';
import * as RD from '@devexperts/remote-data-ts';
import { constant, pipe } from 'fp-ts/lib/function';
import { definitions } from './types/supabase';

const App = () => {
  const client = createClient(
    'https://sxireyujtzcnyjcuranb.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMjgyMDIzNCwiZXhwIjoxOTM4Mzk2MjM0fQ.CVA2Vywb7NzbuMS73Sl4uEeTQppfk0MOmAUfL2FOEDQ'
  );

  return (
    <Provider value={client}>
      <Consumer />
    </Provider>
  );
};

const Consumer = () => {
  const result = useTable<definitions['test']>('test');
  return pipe(
    result,
    RD.fold(
      constant(<div>Should be impossible</div>),
      constant(<div>Loading...</div>),
      e => <div>Fucken failed: {e}</div>,
      result => (
        <div>
          {result.map(row => (
            <div key={row.id}>{row.text}</div>
          ))}
        </div>
      )
    )
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
