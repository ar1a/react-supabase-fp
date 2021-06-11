import { SupabaseClient } from '@supabase/supabase-js';
import { createContext } from 'react';

/**
 * The context that contains the Supabase Client
 */
export const SupabaseContext = createContext<SupabaseClient | null>(null);

/**
 * A provider for {@link SupabaseContext}
 */
export const Provider = SupabaseContext.Provider;
