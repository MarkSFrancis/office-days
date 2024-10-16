import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Loading } from '~/components/Loading';
import Plus from 'lucide-solid/icons/plus';
import {
  Component,
  createEffect,
  createSignal,
  For,
  Show,
  Suspense,
} from 'solid-js';
import { A } from '@solidjs/router';
import { Office } from './api';
import { cn } from '~/lib/utils';

export interface OfficeSelectorProps {
  offices: Office[];
}

// TODO: convert from Dropdown to Navigation Menu

export const OfficeSelector: Component<OfficeSelectorProps> = (props) => {
  // TODO: get active office from URL
  // TODO: get last active office from API
  const [activeOffice, setActiveOffice] = createSignal<Office | undefined>(
    props.offices[0]
  );

  createEffect(() => {
    const selectedOffice = activeOffice();
    const defaultOffice = props.offices[0];

    if (!selectedOffice && defaultOffice) {
      setActiveOffice(defaultOffice);
    }
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger<typeof Button>
        variant="ghost"
        as={(props) => <Button {...props} class={cn(props.class, '')} />}
      >
        <Suspense fallback={<Loading class="inline-block" />}>
          <Show when={activeOffice()} fallback="Select an office">
            {(office) => office().displayName}
          </Show>
        </Suspense>
        <DropdownMenuIcon />
        <span class="sr-only">Toggle offices menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Suspense>
          <For each={props.offices}>
            {(t) => (
              <DropdownMenuItem
                class="cursor-pointer"
                href={`/office/${t.id}`}
                as={A}
              >
                {t.displayName}
              </DropdownMenuItem>
            )}
          </For>
        </Suspense>
        <DropdownMenuItem
          class="cursor-pointer flex justify-between items-center"
          href="/office/new"
          as={A}
        >
          New office
          <Plus class="w-6 py-0 ml-2" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
