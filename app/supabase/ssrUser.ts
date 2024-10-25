import { redirect } from '@remix-run/cloudflare';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '~/db/supabase-types';

export const tryGetSsrUser = async (supabase: SupabaseClient<Database>) => {
  const user = await supabase.auth.getUser();

  return user.data.user ?? undefined;
};

export const getSsrUser = async (supabase: SupabaseClient<Database>) => {
  const user = await tryGetSsrUser(supabase);

  if (!user) {
    throw redirect('/auth/sign-in');
  }

  return user;
};
