import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/cloudflare';
import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

export const withSupabaseSsr = async <TResponse extends Response | undefined>(
  { request, context }: LoaderFunctionArgs | ActionFunctionArgs,
  next: (params: { supabase: SupabaseClient }) => Promise<TResponse>
) => {
  const cookie = parseCookieHeader(request.headers.get('Cookie') ?? '');
  const headers = new Headers();

  const supabase = createServerClient(
    import.meta.env.VITE_SUPABASE_URL,
    context.cloudflare.env.SUPABASE_SERVICE_KEY,
    {
      cookies: {
        getAll: () => cookie,
        setAll: (newCookies) =>
          newCookies.forEach(({ name, value, options }) => {
            headers.append(
              'Set-Cookie',
              serializeCookieHeader(name, value, options)
            );
          }),
      },
    }
  );

  const res = await next({ supabase });
  if (res === undefined) return res;

  headers.forEach((value, key) => res.headers.append(key, value));

  return res;
};
