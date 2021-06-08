import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

export type Filter<Data> = (
  query: PostgrestFilterBuilder<Data>
) => PostgrestFilterBuilder<Data>;
