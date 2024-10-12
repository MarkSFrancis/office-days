import { isServer } from 'solid-js/web';
import { supabaseBrowserClient } from './supabaseClient';
import { getSsrSupabase } from '~/api/ssrSupabase';

export const getSupabaseClient = () =>
  isServer ? getSsrSupabase() : supabaseBrowserClient;
