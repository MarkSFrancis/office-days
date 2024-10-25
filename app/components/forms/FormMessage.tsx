import { forwardRef } from 'react';
import { useFormField } from './FormField';
import { cn } from '~/lib/utils';

export const FormMessage = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { field, errorId } = useFormField();
  const error = field.error();
  const body = error ? String(error) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={errorId}
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {body}
    </p>
  );
});
