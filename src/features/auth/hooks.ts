import { authApi } from './api';
import { supabaseBrowserClient } from '~/supabase/supabaseClient';
import { User } from '@supabase/supabase-js';
import { createStore } from 'solid-js/store';

export type AuthState =
  | {
      user?: undefined;
      isPending: true;
    }
  | {
      user: User | undefined;
      isPending: false;
    };

const [store, setStore] = createStore<AuthState>({
  isPending: true,
});

export const useUserState = store;

supabaseBrowserClient.auth.onAuthStateChange((_event, session) => {
  setStore({
    isPending: false,
    user: session?.user,
  });
});

/**
 * Gets the currently logged in user, or `undefined` if they're not logged in
 */
export const getCurrentUserAsync = authApi.getUser;

export const useUser = () => store.user;
