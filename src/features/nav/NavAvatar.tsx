import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { MeAvatar } from '../profile/MeAvatar';
import { Loading } from '~/components/Loading';
import Plus from 'lucide-solid/icons/plus';
import LogOut from 'lucide-solid/icons/log-out';
import { Component, For } from 'solid-js';
import { A, createAsync, useSubmission } from '@solidjs/router';
import { authApi } from '../auth/api';
import { organizationsApi } from '../organization/api';

export const NavAvatar: Component = () => {
  const signingOut = useSubmission(authApi.signOut);
  const tenants = createAsync(() => organizationsApi.getAll());

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        variant="secondary"
        size="icon"
        class="rounded-full ring-primary ring-1 ring-offset-2"
        as={Button}
      >
        <MeAvatar />
        <span class="sr-only">Toggle user menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          class="font-bold cursor-pointer"
          href="/dash/profile"
          as={A}
        >
          My profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <For each={tenants()}>
          {(t) => (
            <DropdownMenuItem
              class="cursor-pointer"
              href={`/dash/${t.id}`}
              as={A}
            >
              {t.displayName}
            </DropdownMenuItem>
          )}
        </For>
        <DropdownMenuItem
          class="cursor-pointer flex justify-between items-center"
          href="/dash/new"
          as={A}
        >
          New workspace
          <Plus class="w-6 py-0 ml-2" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={authApi.signOut}>
          <DropdownMenuItem
            class="cursor-pointer flex justify-between items-center"
            as="button"
            type="submit"
          >
            Sign out
            {signingOut.pending ? (
              <Loading class="ml-2 w-6 py-0 inline-block" />
            ) : (
              <LogOut class="ml-2 w-6 py-0 inline-block" />
            )}
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
