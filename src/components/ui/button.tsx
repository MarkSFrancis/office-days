import type { JSX, ValidComponent } from 'solid-js';
import { createMemo, Show, splitProps } from 'solid-js';

import * as ButtonPrimitive from '@kobalte/core/button';
import type { PolymorphicProps } from '@kobalte/core/polymorphic';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

import { cn } from '~/lib/utils';
import { Loading } from '../Loading';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'size-10',
      },
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline px-0 py-0 inline',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ButtonProps<T extends ValidComponent = 'button'> =
  ButtonPrimitive.ButtonRootProps<T> &
    VariantProps<typeof buttonVariants> & {
      class?: string | undefined;
      children?: JSX.Element;
      isPending?: boolean;
    };

const Button = <T extends ValidComponent = 'button'>(
  props: PolymorphicProps<T, ButtonProps<T>>
) => {
  const [local, others] = splitProps(props as ButtonProps, [
    'variant',
    'size',
    'class',
    'isPending',
    'children',
  ]);

  return (
    <ButtonPrimitive.Root
      class={cn(
        buttonVariants({ size: local.size, variant: local.variant }),
        local.class
      )}
      {...others}
    >
      <Show when={local.isPending}>
        <Loading class="mr-2" />
      </Show>
      {local.children}
    </ButtonPrimitive.Root>
  );
};

export type { ButtonProps };
export { Button, buttonVariants };
