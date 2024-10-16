import { A, createAsync, useIsRouting } from '@solidjs/router';
import { ParentComponent, Suspense } from 'solid-js';
import { NavAuth } from '../auth/NavAuth';
import { cn } from '~/lib/utils';
import { OfficeDaysLogo } from './OfficeDaysLogo';
import { officeApi } from '../office/api';
import { authApi } from '../auth/api';
import { OfficeSelector } from '../office/OfficeSelector';

export const Navbar: ParentComponent = () => {
  const navigating = useIsRouting();
  const user = createAsync(() => authApi.getUser());
  const offices = createAsync(
    async () => {
      if (user()) {
        return officeApi.getAll();
      } else {
        return [];
      }
    },
    {
      deferStream: true,
    }
  );

  return (
    <nav class="border-b relative bg-white/60">
      <div
        class={cn(
          'absolute hidden animate-opacity-pulse bg-primary/80 h-1.5 w-full',
          navigating() && 'block'
        )}
      ></div>
      <div class="p-2 flex items-baseline w-full max-w-screen-lg mx-auto gap-4">
        <A href="/" class="self-center">
          <OfficeDaysLogo class="inline-block align-bottom mr-2" />
          <span class="text-lg">Office days</span>
        </A>

        <OfficeSelector offices={offices() ?? []} />

        <div class="flex-grow"></div>

        <Suspense>
          <NavAuth user={user} />
        </Suspense>
      </div>
    </nav>
  );
};
