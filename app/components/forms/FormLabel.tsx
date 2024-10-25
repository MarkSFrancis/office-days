import { forwardRef } from 'react';
import { useFormField } from './FormField';
import { Label } from '../ui/label';
import { cn } from '~/lib/utils';

export const FormLabel = forwardRef<
  React.ElementRef<'label'>,
  React.ComponentPropsWithoutRef<'label'>
>(({ className, ...props }, ref) => {
  const { labelId, field } = useFormField();

  const error = field.error();

  return (
    <Label
      ref={ref}
      className={cn(error && 'text-destructive', className)}
      htmlFor={labelId}
      {...props}
    />
  );
});
