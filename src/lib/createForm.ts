import { parseWithZod } from '@conform-to/zod';
import { Action, useSubmission } from '@solidjs/router';
import {
  createSignal,
  createMemo,
  ComponentProps,
  mergeProps,
  Accessor,
  createEffect,
} from 'solid-js';
import { createStore } from 'solid-js/store';
import { z, ZodObject, ZodRawShape } from 'zod';
import { ButtonProps } from '~/components/ui/button';
import { cn } from './utils';
import {
  zodCanUseHtmlInputProps,
  zodToHtmlInputProps,
} from './zodToHtmlInputProps';
import { SubmissionResult } from '@conform-to/dom';
import { toastSubmission } from './toastSubmissions';

export type FormSchema = ZodObject<ZodRawShape>;

export function createForm<TSchema extends FormSchema = FormSchema>(args: {
  /**
   * The action to submit the form to
   */
  action: Action<[data: FormData], SubmissionResult>;
  /**
   * The schema to validate the form against
   */
  schema?: TSchema;
  /**
   * Whether to allow submitting the form multiple times in parallel
   */
  allowParallelSubmit?: boolean;
  /**
   * The initial values of the form
   */
  initialValues?: Partial<z.output<TSchema>>;
  /**
   * Filter the submissions to only show the ones relevant to this form
   */
  submissionsFilter?: (args: [FormData]) => boolean;
}) {
  let form!: HTMLFormElement;

  const submission = useSubmission(args.action, args.submissionsFilter);
  const [formSubmitted, setFormSubmitted] = createSignal(!!submission.result);
  const [errors, setErrors] = createSignal(submission.result?.error);
  const [fields, setFields] = createStore<
    Record<string, { ref: HTMLInputElement; dirty: () => boolean }>
  >({});

  toastSubmission(submission);

  createEffect(() => {
    setErrors(submission.result?.error);
  });

  const validate = () => {
    if (args.schema) {
      const formData = new FormData(form);
      const parseRes = parseWithZod(formData, { schema: args.schema });

      if (parseRes.status === 'error') {
        const reply = parseRes.reply();
        setErrors(reply.error);
        return reply;
      }
    }

    setErrors(undefined);
    return undefined;
  };

  const field = (ref: HTMLInputElement) => {
    const [dirty, setDirty] = createSignal(false);
    const fieldError = () => {
      return errors()?.[ref.name];
    };
    const errorSinceMounted = createMemo<boolean>((v) => v || !!fieldError());

    setFields({
      [ref.name]: {
        ref,
        dirty,
      },
    });

    ref.onblur = () => {
      setDirty(true);

      validate();
    };
    ref.oninput = () => {
      setDirty(true);

      if (errorSinceMounted()) {
        // If the user has seen validation messages before, make sure they continue to get up-to-date validation
        validate();
      } else {
        // If the user has not seen validation messages before, only validate on blur
      }
    };
  };

  const formSubmit = (ref: HTMLFormElement) => {
    form = ref;

    // Don't do this via formProps, as we only want to use `novalidate` in the CSR
    ref.noValidate = true;

    ref.onsubmit = (e) => {
      const reply = validate();
      setFormSubmitted(true);

      const formData = new FormData(form);
      console.log({ formData: Object.fromEntries(formData.entries()) });

      if (reply?.status === 'error') {
        e.preventDefault();

        for (const k in fields) {
          const field = fields[k];
          if (reply.error?.[k]) {
            field.ref.focus();
            break;
          }
        }
      } else {
        setTimeout(() => {
          ref.reset();
        }, 0);
      }
    };
  };

  const fieldErrors = createMemo(() => {
    const fieldErrors: Record<string, string[] | null | undefined> = {};

    if (Object.keys(fields).length === 0) {
      // SSR
      for (const [key, value] of Object.entries(errors() ?? {})) {
        fieldErrors[key] = value;
      }
    } else {
      // CSR
      for (const [fieldName, field] of Object.entries(fields)) {
        const newErrors = errors()?.[fieldName];

        if (newErrors && (field.dirty() || formSubmitted())) {
          fieldErrors[fieldName] = newErrors;
        } else {
          // Used to be an error - isn't anymore
          fieldErrors[fieldName] = undefined;
        }
      }
    }

    return fieldErrors;
  });

  const createFieldProps = (
    name: string,
    customProps: ComponentProps<'input'>
  ): Accessor<ComponentProps<'input'>> =>
    createMemo(() => {
      const allErrors = fieldErrors();
      const initialValue = args.initialValues?.[name];

      const lastRequestFailed = submission.result?.status === 'error';
      const lastRequestValue = submission.input?.[0].get(name);
      const hasValidationError = !!allErrors[name];

      const zodShape = args.schema?.shape[name];

      let value: ComponentProps<'input'>['value'] | undefined;
      let checked: boolean | undefined;

      if (lastRequestFailed && typeof lastRequestValue === 'string') {
        value = lastRequestValue;
      } else if (typeof customProps.value !== 'undefined') {
        value = customProps.value;
      } else if (typeof customProps.checked !== 'undefined') {
        checked = customProps.checked;
      } else if (
        typeof initialValue === 'string' ||
        typeof initialValue === 'number' ||
        typeof initialValue === 'bigint'
      ) {
        value = initialValue;
      } else if (typeof initialValue === 'boolean') {
        checked = initialValue;
      }

      const merged = mergeProps(
        zodCanUseHtmlInputProps(zodShape)
          ? zodToHtmlInputProps(zodShape)
          : undefined,
        customProps,
        {
          name,
          value,
          checked,
          autofocus:
            submission.result && lastRequestFailed
              ? hasValidationError
              : customProps.autofocus,
          class: cn(
            customProps.class,
            hasValidationError && 'border-destructive'
          ),
        } satisfies ComponentProps<'input'>
      );

      return merged;
    });

  const formProps = createMemo(() => {
    return {
      method: 'post',
      action: args.action.url,
      ref: formSubmit,
    } satisfies ComponentProps<'form'>;
  });

  const submitProps = createMemo(() => {
    return {
      type: 'submit',
      disabled: submission.pending && !args.allowParallelSubmit,
      isPending: submission.pending,
    } satisfies ButtonProps;
  });

  return {
    field,
    createFieldProps,
    formProps,
    fieldErrors,
    submitProps,
  };
}
