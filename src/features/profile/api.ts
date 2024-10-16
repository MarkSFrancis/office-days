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
    const user = await authApi.getUser();
    if (!user) {
      return undefined;
    }

    console.log('Getting profile for user', user.id);
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
      firstName:
        typeof data.first_name === 'string'
          ? String(data.first_name)
          : undefined,
      lastName:
        typeof data.last_name === 'string' ? String(data.last_name) : undefined,
      avatarUrl:
        typeof data.avatar_url === 'string'
          ? String(data.avatar_url)
          : undefined,
    };
  }, `${rootKey}/getProfile`),
  updateProfile: action(async (data: FormData) => {
    'use server';
    const user = await getSsrUser();
    return withFormData(ProfileSchema, data, async (data) => {
      const { error } = await getSupabaseClient()
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...data,
        });

      if (error) {
        throw error;
      }

      throw reload({
        revalidate: profileApi.getProfile.key,
      });
    });
  }, `${rootKey}/updateProfile`),
};
