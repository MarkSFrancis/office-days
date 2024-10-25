import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~/lib/utils';
import { Loading } from '../Loading';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:opacity-50',
  {
    variants: {
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
      variant: {
        default:
          'bg-primary text-primary-foreground text-sm hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground text-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background text-sm hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80',
        ghost: 'text-sm hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline px-0 py-0 inline',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface BaseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export type ButtonProps = BaseButtonProps &
  (
    | {
        asChild?: false;
        isPending?: boolean;
      }
    | {
        asChild?: true;
        isPending?: false;
      }
  );

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, isPending = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const children = isPending ? (
      <>
        <Loading className="mr-2" />
        {props.children}
      </>
    ) : (
      props.children
    );

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isPending}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };