import { FieldApi, FormScope, useField } from '@rvf/remix';
import React from 'react';
import { ComponentPropsWithRef, createContext, useContext, useId } from 'react';

export interface FormFieldProps<T> {
  scope: FormScope<T>;
  render: (params: {
    field: ComponentPropsWithRef<'input'>;
  }) => React.JSX.Element;
}

export function FormField<T = unknown>({ scope, render }: FormFieldProps<T>) {
  const field = useField(scope);
  const labelId = useId();
  const errorId = useId();
  const descriptionId = useId();

  const hasError = !!field.error();

  return (
    <FormFieldProvider
      value={{
        field: field as FieldApi<unknown>,
        labelId,
        errorId,
        descriptionId,
      }}
    >
      {render({
        field: {
          'aria-labelledby': labelId,
          'aria-describedby': !hasError
            ? descriptionId
            : `${descriptionId} ${errorId}`,
          'aria-invalid': field.error() ? true : undefined,
          ...field.getInputProps(),
        },
      })}
    </FormFieldProvider>
  );
}

interface FormFieldContext<T> {
  field: FieldApi<T>;
  labelId: string;
  errorId: string;
  descriptionId: string;
}

const formFieldContext = createContext<FormFieldContext<unknown> | null>(null);
const FormFieldProvider = formFieldContext.Provider;

export function useFormField<T = unknown>() {
  const context = useContext(formFieldContext) as FormFieldContext<T> | null;
  if (!context) {
    throw new Error('useFormField must be used within a FormFieldProvider');
  }

  return context;
}
