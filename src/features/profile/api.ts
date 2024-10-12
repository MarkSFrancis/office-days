import { zodUtils } from '~/lib/zodUtils';
import { z } from 'zod';
import { supabaseBrowserClient } from '~/supabase/supabaseClient';
import { useUser } from '../auth/hooks';
import { authApi } from '../auth/api';
import { createEffect, createResource } from 'solid-js';
import { action, cache, reload } from '@solidjs/router';
import { withFormData } from '~/api/withFormData';
import { getSsrUser } from '~/api/ssrUser';
import { getSupabaseClient } from '~/supabase/supabase';

export const ProfileSchema = z.object({
  firstName: zodUtils.optional(zodUtils.string()),
  lastName: zodUtils.optional(zodUtils.string()),
  avatarUrl: zodUtils.optional(zodUtils.string().url()),
});

const rootKey = 'profile';

export const profileApi = {
  rootKey,
  getProfile: cache(async () => {
    'use server';
    const user = await authApi.getUser();
    if (!user) {
      throw new Error('User is not logged in');
    }

    const { data, error } = await supabaseBrowserClient
      .from('profile')
      .select('first_name, last_name, avatar_url')
      .eq('id', user.id)
      .single();

    if (error) {
      throw error;
    }

    return data as z.output<typeof ProfileSchema>;
  }, `${rootKey}/getProfile`),
  updateProfile: action(async (data: FormData) => {
    'use server';
    const user = await getSsrUser();
    return withFormData(ProfileSchema, data, async (data) => {
      const { error } = await getSupabaseClient()
        .from('profile')
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

export const useProfile = () => {
  const [profile, { mutate }] = createResource(() => profileApi.getProfile());
  const user = useUser();

  createEffect(() => {
    if (!user) {
      return undefined;
    }

    const subscription = supabaseBrowserClient.channel('table-').on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'profile',
        filter: `id=eq.${user.id}`,
      },
      (payload) =>
        mutate(() => {
          switch (payload.eventType) {
            case 'INSERT':
              return payload.new;
            case 'UPDATE':
              return payload.new;
            case 'DELETE':
              return undefined;
          }
        })
    );

    return () => void subscription.unsubscribe();
  });

  return profile;
};
