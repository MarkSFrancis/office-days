import { parseWithZod } from '@conform-to/zod';
import { z, ZodTypeAny } from 'zod';
import { SubmissionResult } from '@conform-to/dom';

export type RequestWithBodyEvent<TBody> = Omit<Request, 'body'> & {
  body: TBody;
};

export const withFormData = async <
  TRequestSchema extends ZodTypeAny,
  TResponse = unknown,
>(
  schema: TRequestSchema,
  formData: FormData,
  next: (data: z.output<TRequestSchema>) => Promise<TResponse>
): Promise<TResponse | SubmissionResult> => {
  'use server';
  const validation = parseWithZod(formData, { schema });

  if (validation.status !== 'success') {
    return validation.reply();
  }

  return next(validation.value);
};
