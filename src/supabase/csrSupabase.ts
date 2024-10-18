import { createBrowserClient } from '@supabase/ssr';
import { Database } from '~/db/supabase-types';

let lazyClient: ReturnType<typeof createSupabaseClient> | undefined;

const createSupabaseClient = () => {
  return createBrowserClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_KEY
  );
};

export const getCsrSupabase = () => {
  if (!lazyClient) {
    lazyClient = createSupabaseClient();
  }

  return lazyClient;
};
