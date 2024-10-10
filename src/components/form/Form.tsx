import {
  ComponentProps,
  createContext,
  splitProps,
  useContext,
} from 'solid-js';
import { FormSchema, createForm } from '~/lib/createForm';

export type FormContext<TSchema extends FormSchema = FormSchema> = ReturnType<
  typeof createForm<TSchema>
>;

const formContext = createContext<FormContext>();

export const useFormContext = () => {
  const ctx = useContext(formContext);

  if (!ctx) {
    throw new Error('useFormContext must be used within a Form component');
  }

  return ctx;
};

export type FormProps<TSchema extends FormSchema = FormSchema> = Parameters<
  typeof createForm<TSchema>
>[0] &
  Omit<
    ComponentProps<'form'>,
    keyof ReturnType<FormContext<TSchema>['formProps']> | 'ref'
  >;

/**
 * Display a form with complex validation and submission handling. Should not be used in conjunction with an action that uses `.with`, due to compiler limitations
 */
export function Form<TSchema extends FormSchema = FormSchema>(
  props: FormProps<TSchema>
) {
  const [useFormParams, customProps] = splitProps(props, [
    // Should match the useForm function signature
    'action',
    'schema',
    'allowParallelSubmit',
    'initialValues',
    'submissionsFilter',
  ]);
  const { formProps, ...others } = createForm(useFormParams);

  return (
    <formContext.Provider value={{ formProps, ...others }}>
      <form {...formProps()} {...customProps} />
    </formContext.Provider>
  );
}
