'use server';
import {
  createSupabaseServerClient,
  SupabaseServerClient,
} from '~/supabase/supabaseServer';
import { setSsrContext, tryGetSsrContext } from './middlewareFactory';

const MIDDLEWARE_KEY = 'supabase';
export const getSsrSupabase = () => {
  const ssrContext = tryGetSsrContext<SupabaseServerClient>(MIDDLEWARE_KEY);

  const client = createSupabaseServerClient();
  if (!ssrContext) {
    setSsrContext(MIDDLEWARE_KEY, client);
  }

  return client;
};
