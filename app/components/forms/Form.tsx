import { Form as RemixForm } from '@remix-run/react';
import type { RemixFormProps } from '@remix-run/react/dist/components';
import { FieldValues, FormApi, FormProvider } from '@rvf/remix';

export interface FormProps<T = FieldValues> extends RemixFormProps {
  form: FormApi<T>;
}

export const Form = <T,>({ form, ...formProps }: FormProps<T>) => {
  return (
    <FormProvider scope={form.scope()}>
      <RemixForm {...form.getFormProps(formProps)} />
    </FormProvider>
  );
};
