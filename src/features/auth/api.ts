import { zodUtils } from '~/lib/zodUtils';
import { z } from 'zod';
import { action, cache, redirect, reload } from '@solidjs/router';
import { SubmissionResult } from '@conform-to/dom';
import { withFormData } from '~/api/withFormData';
import { getOrigin } from '~/lib/apiEnv';
import { getSupabaseClient } from '~/supabase/supabase';

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
  tryGetUser: cache(async () => {
    'use server';

    const res = await getSupabaseClient().auth.getUser();
    const user = res.data.user ?? undefined;

    return user;
  }, `${apiId}/tryGetUser`),
  getUser: cache(async () => {
    'use server';

    const res = await getSupabaseClient().auth.getUser();
    const user = res.data.user;

    if (!user) {
      throw redirect('/auth/sign-in');
    }

    return user;
  }, `${apiId}/getUser`),
  signIn: action((data: FormData) => {
    'use server';

    return withFormData(SignInSchema, data, async (creds) => {
      const res = await getSupabaseClient().auth.signInWithPassword(
        SignInSchema.parse(creds)
      );

      if (res.error) {
        // @see https://supabase.com/docs/guides/auth/debugging/error-codes#auth-error-codes-table
        if (res.error.code === 'invalid_credentials') {
          return {
            error: {
              password: ['Invalid email or password'],
            },
          } satisfies SubmissionResult;
        } else {
          return {
            error: {
              password: [res.error.message],
            },
            status: 'error',
          } satisfies SubmissionResult;
        }
      } else {
        await getSupabaseClient().auth.setSession(res.data.session);
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
        const res = await getSupabaseClient().auth.signUp({
          ...creds,
          options: {
            emailRedirectTo: `${getOrigin()}/auth/sign-in`,
          },
        });

        if (res.error) {
          // @see https://supabase.com/docs/guides/auth/debugging/error-codes#auth-error-codes-table
          return {
            error: {
              password: [res.error.message],
            },
            status: 'error',
          } satisfies SubmissionResult;
        }

        return res.data;
      }
    );
  }, `${apiId}/signUp`),
  requestResetPassword: action((data: FormData) => {
    'use server';
    return withFormData(ResetPasswordSchema, data, async (creds) => {
      const res = await getSupabaseClient().auth.resetPasswordForEmail(
        creds.email,
        {
          redirectTo: `${getOrigin()}/auth/update-password`,
        }
      );

      if (res.error) {
        throw res.error;
      }
      return res.data;
    });
  }, `${apiId}/requestResetPassword`),
  updatePassword: action(async (data: FormData) => {
    'use server';

    return withFormData(
      UpdatePasswordSchema,
      data,
      async (creds: z.output<typeof UpdatePasswordSchema>) => {
        const res = await getSupabaseClient().auth.updateUser({
          password: creds.newPassword,
        });

        if (res.error) {
          throw res.error;
        }

        throw reload();
      }
    );
  }, `${apiId}/updatePassword`),
  signOut: action(async () => {
    'use server';

    const res = await getSupabaseClient().auth.signOut();

    if (res.error) {
      throw res.error;
    }

    throw redirect('/auth/sign-in');
  }, `${apiId}/signOut`),
} as const;
