import { SupabaseClient } from '@supabase/supabase-js';
import { createContext } from 'react';

/**
 * The context that contains the Supabase Client
 * @see {@link Provider} for usage
 */
export const SupabaseContext = createContext<SupabaseClient | null>(null);

/**
 * A provider for {@link SupabaseContext}. Everything must be wrapped in this.
 * @example
 * ```ts
 * import { createClient } from '@supabase/supabase-js';
 *
 * const client = createClient('url', 'anonKey');
 *
 * return (
 *   <Provider value={client}>
 *     <Consumer />
 *   </Provider>
 * );
 * ```
 */
export const Provider = SupabaseContext.Provider;
