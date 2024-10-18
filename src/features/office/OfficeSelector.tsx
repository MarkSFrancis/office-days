import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import Plus from 'lucide-solid/icons/plus';
import { Component, createMemo, For, Show, Suspense } from 'solid-js';
import { A, useParams } from '@solidjs/router';
import { Office } from './api';

export interface OfficeSelectorProps {
  offices: Office[];
}

export const OfficeSelector: Component<OfficeSelectorProps> = (props) => {
  const params = useParams<{ officeId?: string }>();

  const activeOffice = createMemo(() => {
    const defaultOffice = props.offices.find((o) => o.id === params.officeId);

    return defaultOffice;
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger<typeof Button> variant="ghost" as={Button}>
        <Show when={activeOffice()} fallback={<span>Select an office</span>}>
          {(office) => <span>{office().displayName}</span>}
        </Show>
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
