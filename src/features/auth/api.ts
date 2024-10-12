import { zodUtils } from '~/lib/zodUtils';
import { supabaseClient } from '~/supabase/supabaseClient';
import { z } from 'zod';
import { action, cache, redirect, reload } from '@solidjs/router';
import { SubmissionResult } from '@conform-to/dom';
import { withSsrSupabase } from '~/api/withSupabase';
import { withFormData } from '~/api/withFormData';
import { withAuth } from '~/api/withAuth';

export const SignInSchema = z.object({
  email: zodUtils.string().email(),
  password: zodUtils.string(),
});

export const SignUpSchema = z.object({
  email: zodUtils.string().email(),
  password: zodUtils.string(),
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
    return withSsrSupabase((supabase) =>
      withFormData(SignInSchema, data, async (creds) => {
        const res = await supabase.auth.signInWithPassword(
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
          await supabase.auth.setSession(res.data.session);
        }

        throw redirect('/');
      })
    );
  }, `${apiId}/signIn`),
  signUp: action((data: FormData) => {
    'use server';
    return withSsrSupabase((supabase) =>
      withFormData(
        SignUpSchema,
        data,
        async (creds: z.output<typeof SignInSchema>) => {
          const res = await supabase.auth.signUp(creds);

          if (res.error) {
            throw res.error;
          }
          return res.data;
        }
      )
    );
  }, `${apiId}/signUp`),
  requestResetPassword: action((data: FormData) => {
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
    return withAuth(({ supabase }) =>
      withFormData(
        UpdatePasswordSchema,
        data,
        async (creds: z.output<typeof UpdatePasswordSchema>) => {
          const res = await supabase.auth.updateUser({
            password: creds.newPassword,
          });

          if (res.error) {
            throw res.error;
          }

          throw reload();
        }
      )
    );
  }, `${apiId}/updatePassword`),
  signOut: action(() => {
    'use server';
    return withAuth(async ({ supabase }) => {
      const res = await supabase.auth.signOut();

      if (res.error) {
        throw res.error;
      }

      throw redirect('/auth/sign-in');
    });
  }, `${apiId}/signOut`),
} as const;
