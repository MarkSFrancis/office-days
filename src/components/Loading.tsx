import { cn } from '~/lib/utils';
import Loader2 from 'lucide-solid/icons/loader-2';
import type { LucideProps } from 'lucide-solid';
import { Component } from 'solid-js';
import { splitProps } from 'solid-js';

export interface LoadingProps extends Omit<LucideProps, 'ref'> {
  center?: boolean;
}

/**
 * Show a loading icon. Can optionally center it with `center`
 */
export const Loading: Component<LoadingProps> = (props) => {
  const [local, others] = splitProps(props, ['center', 'class']);

  return (
    <Loader2
      {...others}
      class={cn(
        'animate-spin',
        !!local.center &&
          'self-center place-self-center justify-self-center align-middle',
        local.class
      )}
    />
  );
};

/**
 * Show that a section of the page is loading
 */
export const SectionLoading: Component<LoadingProps> = (props) => {
  const [local, others] = splitProps(props, ['children']);

  return (
    <div class="grow flex justify-center items-center">
      {local.children}
      <Loading size={48} {...others} />
    </div>
  );
};
