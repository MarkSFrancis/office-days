import { supabaseBrowserClient } from '~/supabase/supabaseClient';
import { Subscription, User } from '@supabase/supabase-js';
import { createMemo, createSignal, onCleanup, onMount } from 'solid-js';
import { authApi } from './api';
import { createAsync } from '@solidjs/router';

export const createUserSubscription = (options?: { deferStream?: boolean }) => {
  const apiUser = createAsync(() => authApi.getUser(), options);
  const [subscriptionUser, setSubscriptionUser] = createSignal<{
    isFetched: boolean;
    user: User | undefined;
  }>({
    isFetched: false,
    user: undefined,
  });

  let subscription: Subscription | undefined;
  onMount(() => {
    const handler = supabaseBrowserClient.auth.onAuthStateChange(
      (_event, session) => {
        console.log('Auth state changed');
        setSubscriptionUser({
          isFetched: true,
          user: session?.user ?? undefined,
        });
      }
    );

    subscription = handler.data.subscription;
  });

  onCleanup(() => {
    subscription?.unsubscribe();
  });

  return createMemo(() => {
    const user = subscriptionUser().isFetched
      ? subscriptionUser().user
      : apiUser();

    return user;
  });
};
