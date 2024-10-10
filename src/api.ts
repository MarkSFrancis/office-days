import { parseWithZod } from '@conform-to/zod';
import { z, ZodTypeAny } from 'zod';
import { SubmissionResult } from '@conform-to/dom';
import { User } from '@supabase/supabase-js';
import { supabaseClient } from './supabase/supabaseClient';

// TODO: make it run on the server instead + provide async context propagation for who the current user is
export const withAuth = async <TResponse = unknown>(
  next: (user: User) => Promise<TResponse>
): Promise<TResponse | SubmissionResult> => {
  const usr = await supabaseClient.auth.getUser();
  if (usr.error) {
    return {
      error: {
        reason: ['Unauthorized'],
      },
      status: 'error',
    } satisfies SubmissionResult;
  }

  return next(usr.data.user);
};

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
