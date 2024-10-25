import { cn } from '~/lib/utils';
import { ComponentProps, ComponentPropsWithRef, forwardRef } from 'react';

export const NavbarContent = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      className={cn(
        'p-2 flex items-baseline w-full max-w-screen-lg mx-auto gap-4',
        className
      )}
      {...props}
      ref={ref}
    >
      {props.children}
    </div>
  )
);

export const Navbar = forwardRef<HTMLElement, ComponentPropsWithRef<'nav'>>(
  ({ className, ...props }, ref) => {
    return (
      <nav
        className={cn('border-b relative bg-white/60', className)}
        {...props}
        ref={ref}
      ></nav>
    );
  }
);
