import { getCurrentUserAsync } from '~/features/auth/hooks';
import { NavAvatar } from '~/features/nav/NavAvatar';
import { Component, ParentProps, splitProps } from 'solid-js';
import { A, AnchorProps, redirect, RouteDefinition } from '@solidjs/router';
import { cn } from '~/lib/utils';
import { OfficeDaysLogo } from '~/features/nav/OfficeDaysLogo';

export const route = {
  async preload({ location }) {
    const user = await getCurrentUserAsync();

    const href = `${location.pathname}?${location.search}${location.hash}`;

    if (!user) {
      throw redirect(
        `/auth/sign-in?${new URLSearchParams({ redirect: href })}`
      );
    }
  },
} satisfies RouteDefinition;

export default function DashPage(props: ParentProps) {
  return (
    // TODO: lots of navs are similar. Should probably merge a few of them together
    <div class="flex min-h-screen w-full flex-col">
      <header class="sticky z-10 top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav class="gap-6 text-sm font-medium flex flex-row items-center lg:gap-6">
          <DesktopNavLink
            href="/"
            class="flex items-center gap-2 text-lg text-foreground font-semibold"
          >
            <OfficeDaysLogo class="h-6 w-6" />
          </DesktopNavLink>
          <DesktopNavLink href="/">Fast Images</DesktopNavLink>
        </nav>
        <div class="w-full flex-1"></div>
        <NavAvatar />
      </header>
      <main class="min-h-[calc(100vh_-_theme(spacing.16))] flex-1 bg-muted/40 p-4 md:p-6">
        {props.children}
      </main>
    </div>
  );
}

const DesktopNavLink: Component<AnchorProps> = (props) => {
  const [local, other] = splitProps(props, ['class']);

  return (
    <A
      {...other}
      class={cn(
        'text-muted-foreground data-[status=active]:text-foreground transition-colors hover:text-foreground',
        local.class
      )}
    />
  );
};
