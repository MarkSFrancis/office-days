import { isServer } from 'solid-js/web';
import { getCsrSupabase } from './csrSupabase';
import { getSsrSupabase } from '~/api/ssrSupabase';

export const getSupabaseClient = () =>
  isServer ? getSsrSupabase() : getCsrSupabase();
