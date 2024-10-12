'use server';
import { getRequestEvent } from 'solid-js/web';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const tryGetSsrContext = <TContext>(contextId: string) => {
  return getRequestEvent()?.locals[contextId] as TContext | undefined;
};

export const getSsrContext = <TContext>(contextId: string) => {
  const ctx = tryGetSsrContext<TContext>(contextId);

  if (!ctx) {
    throw new Error(
      `SSR context ${String(contextId)} is missing. Ensure that the endpoint is using with${String(contextId)}`
    );
  }

  return ctx;
};

export const setSsrContext = (contextId: string, context: unknown) => {
  getRequestEvent()!.locals[contextId] = context;
};

export const withMiddleware = async <TContext, TResponse = unknown>(
  factory: () => TContext | Promise<TContext>,
  contextId: string,
  next: (context: TContext) => Promise<TResponse>
): Promise<TResponse> => {
  'use server';

  let context = tryGetSsrContext<TContext>(contextId);
  if (context) {
    return next(context);
  }

  context = await factory();
  setSsrContext(contextId, context);
  return next(context);
};
