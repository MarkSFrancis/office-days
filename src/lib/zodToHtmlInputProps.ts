import { ComponentProps } from 'solid-js';
import { z } from 'zod';

export const zodCanUseHtmlInputProps = (
  schema?: z.ZodTypeAny
): schema is ZodHtmlInputSchema => {
  if (schema instanceof z.ZodOptional) {
    return zodCanUseHtmlInputProps(schema._def.innerType as z.ZodTypeAny);
  } else if (schema instanceof z.ZodDefault) {
    return zodCanUseHtmlInputProps(schema._def.innerType as z.ZodTypeAny);
  }

  if (
    schema instanceof z.ZodNumber ||
    schema instanceof z.ZodString ||
    schema instanceof z.ZodBoolean
  ) {
    return true;
  }

  return false;
};

type ZodHtmlInputRequiredSchema = z.ZodNumber | z.ZodString | z.ZodBoolean;

export type ZodHtmlInputSchema =
  | ZodHtmlInputRequiredSchema
  | z.ZodOptional<ZodHtmlInputRequiredSchema>;

/**
 * Convert a Zod schema to HTML input props to give direct feedback to the user.
 * Should be used for `z.string()`, `z.number()` schemas.
 */
export function zodToHtmlInputProps(
  schema: ZodHtmlInputSchema
): ComponentProps<'input'> {
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodDefault) {
    const typedSchema = schema as
      | z.ZodOptional<ZodHtmlInputSchema>
      | z.ZodDefault<ZodHtmlInputSchema>;
    return {
      ...zodToHtmlInputProps(typedSchema._def.innerType),
      required: false,
    };
  }

  const typedSchema = schema;

  const inputProps: ComponentProps<'input'> = {
    required: true,
  };

  if (typedSchema instanceof z.ZodBoolean) {
    return {
      ...inputProps,
      type: 'checkbox',
    };
  }

  const { checks } = typedSchema._def;
  if (typedSchema instanceof z.ZodNumber) {
    inputProps.type = 'number';
  } else if (typedSchema instanceof z.ZodString) {
    inputProps.type = 'text';
  }

  for (const check of checks) {
    switch (check.kind) {
      case 'min':
        if (typedSchema instanceof z.ZodString) {
          inputProps.minLength = check.value;
        } else {
          inputProps.min = check.value;
        }
        break;
      case 'max':
        if (typedSchema instanceof z.ZodString) {
          inputProps.maxLength = check.value;
        } else {
          inputProps.max = check.value;
        }
        break;
      case 'length':
        if (typedSchema instanceof z.ZodString) {
          inputProps.minLength = check.value;
          inputProps.maxLength = check.value;
        } else if (typedSchema instanceof z.ZodNumber) {
          inputProps.min = check.value;
          inputProps.max = check.value;
        }
        break;
      case 'email':
        inputProps.type = 'email';
        break;
      case 'regex':
        inputProps.pattern = check.regex.source;
        break;
      case 'url':
        inputProps.type = 'url';
        break;
      case 'int':
        inputProps.step = '1';
        break;
      case 'date':
        inputProps.type = 'date';
        break;
      case 'time':
        inputProps.type = 'time';
        break;
      case 'datetime':
        inputProps.type = 'datetime-local';
        break;
      // Could do some more advanced stuff here with regex (validate things like `startsWith`), but I'll leave that for future me
    }
  }

  return inputProps;
}
