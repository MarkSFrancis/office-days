import { AsyncLocalStorage } from 'async_hooks';

type CapitalizeFirstLetter<S extends string> =
  S extends `${infer First}${infer Rest}` ? `${Uppercase<First>}${Rest}` : S;

/**
 * Helps to create a middleware. Exports functions which you can then re-export as your middleware functions.
 * @param factory Create a middleware context
 * @param contextName Name of the context. Used for error messages.
 */
export const createMiddleware = <TContext, TName extends string>(
  factory: () => TContext | Promise<TContext>,
  contextName: CapitalizeFirstLetter<TName>
) => {
  const serverContext = new AsyncLocalStorage<TContext>();

  const tryGetSsrContext = () => serverContext.getStore();

  const getSsrContext = () => {
    const ctx = tryGetSsrContext();

    if (!ctx) {
      throw new Error(
        `SSR context ${contextName} is missing. Ensure that the endpoint is using with${contextName}`
      );
    }

    return ctx;
  };

  const withMiddleware = async <TResponse = unknown>(
    next: (context: TContext) => Promise<TResponse>
  ): Promise<TResponse> => {
    let context = tryGetSsrContext();
    if (context) {
      return next(context);
    }

    context = await factory();
    return serverContext.run(context, () => next(context));
  };

  return {
    withMiddleware,
    getSsrContext,
    tryGetSsrContext,
  };
};
