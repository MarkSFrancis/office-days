import { A, createAsync, RouteDefinition } from '@solidjs/router';
import ChevronRight from 'lucide-solid/icons/chevron-right';
import { For, Show, Suspense } from 'solid-js';
import { AppBackground } from '~/components/Layout/AppBackground';
import { SectionLoading } from '~/components/Loading';
import { authApi } from '~/features/auth/api';
import { officeApi } from '~/features/office/api';

export const route = {
  preload: async () => {
    await Promise.all([authApi.getUser(), officeApi.getAll()]);
  },
} satisfies RouteDefinition;

export default function Home() {
  const user = createAsync(() => authApi.getUser(), {
    deferStream: true,
  });
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
    <div class="mx-auto py-4 px-2 max-w-screen-lg w-full">
      <Suspense fallback={<SectionLoading />}>
        <Show when={offices()}>
          {(offices) => (
            <ul class="flex flex-wrap gap-4 w-full">
              <For each={offices()}>
                {(office) => (
                  <li class="list-none flex-grow overflow-hidden border-2">
                    <AppBackground colorsSeed={office.id}>
                      <A
                        class="relative inline-block max-w-screen w-full min-w-48 group overflow-hidden rounded-md"
                        href={`/office/${office.id}`}
                      >
                        <div class="w-full h-full">
                          <div class="w-full px-6 pt-4 pb-[50%] bg-gradient-to-b from-white/90 to-transparent">
                            <div class="flex flex-row items-center justify-between space-y-0">
                              <h3 class="text-4xl font-normal">
                                {office.displayName}
                              </h3>
                              <ChevronRight class="group-hover:translate-x-2 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </A>
                    </AppBackground>
                  </li>
                )}
              </For>
            </ul>
          )}
        </Show>
      </Suspense>
    </div>
  );
}
