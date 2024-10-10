import { useUser } from '../auth/hooks';
import { UserAvatar } from './UserAvatar';
import { profileApi } from './api';
import { createAsync } from '@solidjs/router';
import { Component, Suspense } from 'solid-js';

export const MeAvatar: Component = () => {
  const profile = createAsync(() => profileApi.getProfile());
  const user = useUser();

  return (
    <Suspense>
      <UserAvatar
        email={user?.email}
        avatarUrl={profile()?.avatarUrl ?? undefined}
        firstName={profile()?.firstName ?? undefined}
        lastName={profile()?.lastName ?? undefined}
      />
    </Suspense>
  );
};
