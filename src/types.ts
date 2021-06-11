import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

/**
 * A function that takes a query and filters it
 */
export type Filter<Data> = (
  query: PostgrestFilterBuilder<Data>
) => PostgrestFilterBuilder<Data>;
