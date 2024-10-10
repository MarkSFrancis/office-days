import { zodUtils } from '~/lib/zodUtils';
import { supabaseClient } from '~/supabase/supabaseClient';
import { z } from 'zod';
import { withAuth, withFormData } from '../../api';
import { action, cache, redirect } from '@solidjs/router';
import { SubmissionResult } from '@conform-to/dom';

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
  signIn: action((data: FormData) => {
    'use server';
    return withFormData(SignInSchema, data, async (creds) => {
      const res = await supabaseClient.auth.signInWithPassword(
        SignInSchema.parse(creds)
      );

      if (res.error) {
        return {
          error: {
            password: ['Invalid email or password'],
          },
          status: 'error',
        } satisfies SubmissionResult;
      } else {
        await supabaseClient.auth.setSession(res.data.session);
      }

      throw redirect('/');
    });
  }, `${apiId}/signIn`),
  signUp: action((data: FormData) => {
    'use server';
    return withFormData(
      SignUpSchema,
      data,
      async (creds: z.output<typeof SignInSchema>) => {
        const res = await supabaseClient.auth.signUp(creds);

        if (res.error) {
          throw res.error;
        }
        return res.data;
      }
    );
  }, `${apiId}/signUp`),
  requestResetPassword: action((data: FormData) => {
    'use server';
    return withFormData(ResetPasswordSchema, data, async (creds) => {
      const res = await supabaseClient.auth.resetPasswordForEmail(creds.email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (res.error) {
        throw res.error;
      }
      return res.data;
    });
  }, `${apiId}/requestResetPassword`),
  updatePassword: action((data: FormData) => {
    'use server';
    return withAuth(() =>
      withFormData(
        UpdatePasswordSchema,
        data,
        async (creds: z.output<typeof UpdatePasswordSchema>) => {
          const res = await supabaseClient.auth.updateUser({
            password: creds.newPassword,
          });

          if (res.error) {
            throw res.error;
          }
          return res.data;
        }
      )
    );
  }, `${apiId}/updatePassword`),
  signOut: action(() => {
    'use server';
    return withAuth(async () => {
      const res = await supabaseClient.auth.signOut();

      if (res.error) {
        throw res.error;
      }

      throw redirect('/auth/sign-in');
    });
  }, `${apiId}/signOut`),
} as const;
