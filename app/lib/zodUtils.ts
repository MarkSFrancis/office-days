import z, { ZodTypeAny } from 'zod';

const optional = <T extends ZodTypeAny>(validation: T) =>
  z.preprocess(
    (val) =>
      (typeof val === 'string' && val.trim() === '') || val === undefined
        ? undefined
        : val,
    z.union([z.undefined(), validation])
  );

const string = () => z.string().trim().min(1, 'This field is required');

const numPos = (message?: string) =>
  z.coerce
    .number()
    .refine(
      (v) => v > 0 && !isNaN(v) && isFinite(v),
      message ?? 'This field must be more than zero'
    );

const intId = () => z.number().int().positive();

const checkbox = () =>
  z.preprocess((val) => {
    if (typeof val === 'boolean') return val;
    return val === 'on';
  }, z.boolean());

export const zodUtils = {
  /**
   * Non-empty `string` (after it's trimmed for whitespace)
   */
  string,
  /**
   * Makes the value optional. If the value is a whitespace string, it'll convert it to `undefined`
   */
  optional,
  /**
   * Positive integer
   */
  intId,
  /**
   * A positive number, allowing decimal values, parsed from string if necessary
   */
  numPos,
  /**
   * A checkbox input, converted to a boolean type
   */
  checkbox,
};
