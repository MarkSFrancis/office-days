import { supabaseBrowserClient } from '~/supabase/supabaseClient';
import {
  RealtimePostgresDeletePayload,
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
} from '@supabase/supabase-js';
import { createEffect, createMemo, createSignal, onCleanup } from 'solid-js';
import { Profile, profileApi } from './api';
import { createAsync } from '@solidjs/router';
import { authApi } from '../auth/api';
import { profiles } from '~/db/schema';
import { RawSqlTable } from '~/supabase/RawSqlTable';

export const createProfileSubscription = (options?: {
  deferStream?: boolean;
}) => {
  const apiProfile = createAsync(() => profileApi.getProfile(), options);
  const user = createAsync(() => authApi.getUser(), options);
  const [subscriptionProfile, setSubscriptionProfile] = createSignal<{
    isFetched: boolean;
    profile: Profile | undefined;
  }>({
    isFetched: false,
    profile: undefined,
  });

  createEffect(() => {
    const userId = user()?.id;
    if (!userId) return;

    const subscription = supabaseBrowserClient
      .channel('table-')
      .on<ProfileTable>(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${userId}`,
        },
        (payload) =>
          setSubscriptionProfile({
            isFetched: true,
            profile: getProfileFromPayload(payload),
          })
      );

    onCleanup(() => subscription.unsubscribe());
  });

  return createMemo(() => {
    const profile = subscriptionProfile().isFetched
      ? subscriptionProfile().profile
      : apiProfile();

    return profile;
  });
};

type ProfileTable = RawSqlTable<typeof profiles>;

const getProfileFromPayload = (
  payload:
    | RealtimePostgresDeletePayload<ProfileTable>
    | RealtimePostgresInsertPayload<ProfileTable>
    | RealtimePostgresUpdatePayload<ProfileTable>
): Profile => {
  switch (payload.eventType) {
    case 'INSERT':
      return {
        avatarUrl: payload.new.avatar_url ?? undefined,
        firstName: payload.new.first_name ?? undefined,
        lastName: payload.new.last_name ?? undefined,
      };
    case 'UPDATE':
      return {
        avatarUrl: payload.new.avatar_url ?? undefined,
        firstName: payload.new.first_name ?? undefined,
        lastName: payload.new.last_name ?? undefined,
      };
    case 'DELETE':
      return {
        avatarUrl: undefined,
        firstName: undefined,
        lastName: undefined,
      };
  }
};
