import { zodUtils } from '~/lib/zodUtils';
import { supabaseClient } from '~/supabase/supabaseClient';
import { z } from 'zod';
import { authenticatedPost, publicPost, withFormData } from '../../api';
import { cache, redirect } from '@solidjs/router';

export const SignInSchema = z.object({
  email: zodUtils.string().email(),
  password: zodUtils.string(),
});

export const SignUpSchema = z.object({
  email: zodUtils.string().email(),
  password: zodUtils.string(),
  tenantDisplayName: zodUtils.string(),
});

export const ResetPasswordSchema = z.object({
  email: zodUtils.string().email(),
});

export const UpdatePasswordSchema = z.object({
  newPassword: zodUtils.string(),
});

const apiId = 'auth';

export const authApi = {
  apiId,
  getUser: cache(
    async () =>
      await supabaseClient.auth
        .getSession()
        .then((u) => u.data.session?.user ?? false),
    `${apiId}/getUser`
  ),
  signIn: publicPost(
    withFormData(SignInSchema, async (creds) => {
      const res = await supabaseClient.auth.signInWithPassword(
        SignInSchema.parse(creds)
      );

      if (res.error) {
        throw res.error;
      } else {
        await supabaseClient.auth.setSession(res.data.session);
      }

      throw redirect('/');
    }),
    `${apiId}/signIn`
  ),
  signUp: publicPost(
    withFormData(SignUpSchema, async (creds: z.output<typeof SignInSchema>) => {
      const res = await supabaseClient.auth.signUp(creds);

      if (res.error) {
        throw res.error;
      }
      return res.data;
    }),
    `${apiId}/signUp`
  ),
  requestResetPassword: publicPost(
    withFormData(ResetPasswordSchema, async (creds) => {
      const res = await supabaseClient.auth.resetPasswordForEmail(creds.email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (res.error) {
        throw res.error;
      }
      return res.data;
    }),
    `${apiId}/requestResetPassword`
  ),
  updatePassword: authenticatedPost(
    withFormData(
      UpdatePasswordSchema,
      async (creds: z.output<typeof UpdatePasswordSchema>) => {
        const res = await supabaseClient.auth.updateUser({
          password: creds.newPassword,
        });

        if (res.error) {
          throw res.error;
        }
        return res.data;
      }
    ),
    `${apiId}/updatePassword`
  ),
  signOut: authenticatedPost(async () => {
    const res = await supabaseClient.auth.signOut();

    if (res.error) {
      throw res.error;
    }

    throw redirect('/auth/sign-in');
  }, `${apiId}/signOut`),
} as const;
