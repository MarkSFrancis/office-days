import { zodUtils } from '~/lib/zodUtils';
import { z } from 'zod';
import { authApi } from '../auth/api';
import { action, cache, reload } from '@solidjs/router';
import { withFormData } from '~/api/withFormData';
import { getSsrUser } from '~/api/ssrUser';
import { getSupabaseClient } from '~/supabase/supabase';
import { Duration, waitFor } from '~/lib/utils';

export const ProfileSchema = z.object({
  firstName: zodUtils.optional(zodUtils.string()),
  lastName: zodUtils.optional(zodUtils.string()),
  avatarUrl: zodUtils.optional(zodUtils.string().url()),
});

export type Profile = {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
};

const rootKey = 'profile';

export const profileApi = {
  rootKey,
  getProfile: cache(async (): Promise<Profile | undefined> => {
    'use server';
    await waitFor(Duration.milliseconds(1_000));
    const user = await authApi.tryGetUser();
    if (!user) {
      return undefined;
    }

    const { data, error } = await getSupabaseClient()
      .from('profiles')
      .select('first_name, last_name, avatar_url')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return {};
    }

    return {
      firstName: data.first_name ?? undefined,
      lastName: data.last_name ?? undefined,
      avatarUrl: data.avatar_url ?? undefined,
    };
  }, `${rootKey}/getProfile`),
  updateProfile: action(async (data: FormData) => {
    'use server';
    const user = await getSsrUser();
    return await withFormData(ProfileSchema, data, async (data) => {
      await getSupabaseClient()
        .from('profiles')
        .upsert(
          {
            avatar_url: data.avatarUrl ?? null,
            first_name: data.firstName ?? null,
            last_name: data.lastName ?? null,
            user_id: user.id,
          },
          {
            onConflict: 'user_id',
          }
        );

      throw reload();
    });
  }, `${rootKey}/updateProfile`),
};
