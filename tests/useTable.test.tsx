import * as React from 'react';
import { useSupabase, Provider } from '../src';
import { renderHook } from '@testing-library/react-hooks';
import { none, some } from 'fp-ts/lib/Option';
import { createClient } from '@supabase/supabase-js';
jest.mock('@supabase/supabase-js');

const client = createClient('localhost:3000', 'empty');
console.log(client); //! returns undefined

const wrapper: React.FC = ({ children }) => (
  <Provider value={client}>{children}</Provider>
);

it('gets supabase out of the context', () => {
  const { result } = renderHook(() => useSupabase(), { wrapper });
  expect(result.current).toEqual(some(client));
});

it('returns none when there is no context', () => {
  const { result } = renderHook(() => useSupabase());
  expect(result.current).toEqual(none);
});
