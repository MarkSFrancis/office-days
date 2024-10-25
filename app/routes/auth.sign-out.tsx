import { ActionFunctionArgs, redirect } from '@remix-run/cloudflare';
import { withSupabaseSsr } from '~/supabase/ssrSupabase';

export const action = async (ctx: ActionFunctionArgs) => {
  return await withSupabaseSsr(ctx, async ({ supabase }) => {
    const signedOut = await supabase.auth.signOut();

    if (signedOut.error) {
      console.error(signedOut.error);
    }

    return redirect('/');
  });
};
