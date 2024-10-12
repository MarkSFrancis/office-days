import { createSupabaseServerClient } from '~/supabase/supabaseServer';
import { createMiddleware } from './middlewareFactory';

const supabaseMiddleware = createMiddleware(
  () => createSupabaseServerClient(),
  'Supabase'
);
export const withSsrSupabase = supabaseMiddleware.withMiddleware;
export const tryGetSsrSupabase = supabaseMiddleware.tryGetSsrContext;
export const getSsrSupabase = supabaseMiddleware.getSsrContext;
