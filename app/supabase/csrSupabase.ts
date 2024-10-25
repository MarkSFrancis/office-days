import { createBrowserClient } from '@supabase/ssr';
import { Database } from '~/db/supabase-types';

export const createSupabaseBrowserClient = () => {
  return createBrowserClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_KEY
  );
};
