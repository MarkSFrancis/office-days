import { useLoaderData } from '@remix-run/react';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { loader } from '~/root';
import { createSupabaseBrowserClient } from '~/supabase/csrSupabase';
import { User } from '@supabase/supabase-js';

const useSubscribeUserState = () => {
  const ssrUserData = useLoaderData<typeof loader>();
  const [subscribedUser, setSubscribedUser] = useState<User | null | undefined>(
    undefined
  );

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    const sub = supabase.auth.onAuthStateChange((event, session) => {
      setSubscribedUser(session?.user ?? null);
    });

    return () => sub.data.subscription.unsubscribe();
  });

  return useMemo(() => {
    if (subscribedUser !== undefined) {
      return subscribedUser;
    } else {
      return ssrUserData?.user ?? null;
    }
  }, [ssrUserData, subscribedUser]);
};

const userContext = createContext<User | null>(null);

export const useUser = () => useContext(userContext);
export const UserProvider: FC<PropsWithChildren> = (props) => {
  const user = useSubscribeUserState();

  return (
    <userContext.Provider value={user}>{props.children}</userContext.Provider>
  );
};
