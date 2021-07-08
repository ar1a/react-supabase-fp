import * as React from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { useSupabase, Provider } from '../src';
import { renderHook } from '@testing-library/react-hooks';
import { none, some } from 'fp-ts/lib/Option';

const client = {} as SupabaseClient;
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
