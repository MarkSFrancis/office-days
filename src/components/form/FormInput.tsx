import { Component, ComponentProps, For, JSX, splitProps } from 'solid-js';
import { useFormContext } from './Form';
import { TextFieldErrorMessage, TextFieldInput } from '../ui/text-field';
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
  const { field, fieldErrors, fieldProps } = useFormContext();

  const renderValidation = () => {
    if (customProps.hideErrors || passedProps.type === 'hidden') {
      return null;
    }

    const errs = fieldErrors()[customProps.name];
    if (!errs) {
      return null;
    }

    if (customProps.validation) {
      return customProps.validation(errs);
    } else {
      return (
        <TextFieldErrorMessage>
          <ul class="text-destructive">
            <For each={errs}>{(err) => <li>{err}</li>}</For>
          </ul>
        </TextFieldErrorMessage>
      );
    }
  };

  return (
    <>
      <TextFieldInput
        type="text"
        {...(fieldProps(customProps.name, passedProps) as TextFieldInputProps)}
        ref={field}
      />
      {renderValidation()}
    </>
  );
};
