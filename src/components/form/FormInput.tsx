import {
  Component,
  ComponentProps,
  For,
  JSX,
  Show,
  splitProps,
} from 'solid-js';
import { useFormContext } from './Form';
import { TextFieldInput } from '../ui/text-field';
import { TextFieldInputProps } from '@kobalte/core/text-field';

export type FormInputProps = ComponentProps<'input'> & {
  name: string;
  hideErrors?: boolean;
  validation?: (value: string[]) => JSX.Element | undefined;
};

export const FormInput: Component<FormInputProps> = (props) => {
  const [customProps, passedProps] = splitProps(props, [
    'name',
    'validation',
    'hideErrors',
  ]);
  const { field, fieldErrors, createFieldProps } = useFormContext();
  const fieldProps = createFieldProps(customProps.name, passedProps);

  return (
    <>
      <TextFieldInput {...(fieldProps() as TextFieldInputProps)} ref={field} />
      <Show when={!customProps.hideErrors && passedProps.type !== 'hidden'}>
        <Show when={fieldErrors()[customProps.name]}>
          {(errors) => (
            <FieldErrors
              errors={errors()}
              validation={customProps.validation}
            />
          )}
        </Show>
      </Show>
    </>
  );
};

const FieldErrors = (props: {
  errors: string[];
  validation?: FormInputProps['validation'];
}) => {
  if (props.validation) {
    return props.validation(props.errors);
  }

  return (
    // TODO: add support for `TextFieldErrorMessage` via the `validationState` prop on the `TextField` component
    // https://kobalte.dev/docs/core/components/text-field/#error-message
    <ul class="text-destructive">
      <For each={props.errors}>{(err) => <li>{err}</li>}</For>
    </ul>
  );
};
