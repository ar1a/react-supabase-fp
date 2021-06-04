import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, useSupabase } from '../.';
import { createClient } from '@supabase/supabase-js';
import * as O from 'fp-ts/Option';

const App = () => {
  const client = createClient(
    'https://sxireyujtzcnyjcuranb.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMjgyMDIzNCwiZXhwIjoxOTM4Mzk2MjM0fQ.CVA2Vywb7NzbuMS73Sl4uEeTQppfk0MOmAUfL2FOEDQ'
  );

  return (
    <Provider value={client}>
      <div>Hello world!</div>
      <Consumer />
    </Provider>
  );
};

const Consumer = () => {
  const client = useSupabase();
  return <div>{O.isSome(client)}</div>;
};

ReactDOM.render(<App />, document.getElementById('root'));
