import { parseWithZod } from '@conform-to/zod';
import { Action, action, cache } from '@solidjs/router';
import { z, ZodTypeAny } from 'zod';
import { SubmissionResult } from '@conform-to/dom';

export const authenticatedGet = <TArgs extends unknown[], TResult = void>(
  next: (...args: TArgs) => Promise<TResult>,
  name: string
) =>
  cache<(...args: TArgs) => Promise<TResult>>((...args) => {
    'use server';

    throw new Error('Not implemented');

    return next(...args);
  }, name);

export const authenticatedPost = <TArgs extends unknown[], TResult = void>(
  next: (...args: TArgs) => Promise<TResult>,
  name: string
) =>
  action<TArgs, TResult>((...args) => {
    'use server';

    throw new Error('Not implemented');

    // return next(...args);
  }, name);

export const publicGet = <TArgs extends unknown[], TResult = void>(
  next: (...args: TArgs) => Promise<TResult>,
  name: string
) =>
  cache<(...args: TArgs) => Promise<TResult>>((...args) => {
    'use server';

    return next(...args);
  }, name);

export const publicPost = <TArgs extends unknown[], TResult = void>(
  next: (...args: TArgs) => Promise<TResult>,
  name: string
): Action<TArgs, TResult> =>
  action((...args) => {
    'use server';

    return next(...args);
  }, name);

export type RequestWithBodyEvent<TBody> = Omit<Request, 'body'> & {
  body: TBody;
};

export const withFormData =
  <
    TRequestSchema extends ZodTypeAny,
    TArgs extends unknown[] = [],
    TResponse = unknown,
  >(
    schema: TRequestSchema,
    next: (...args: [...TArgs, z.output<TRequestSchema>]) => Promise<TResponse>
  ) =>
  async (
    ...args: [...TArgs, FormData]
  ): Promise<TResponse | SubmissionResult> => {
    const formData = args.slice(-1)[0] as FormData;
    const otherArgs = args.slice(0, -1) as TArgs;

    const validation = parseWithZod(formData, { schema });

    if (validation.status !== 'success') {
      return validation.reply();
    }

    return next(...otherArgs, validation.value);
  };
