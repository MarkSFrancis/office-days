export const lazyInit = <T, TArgs extends unknown[] = []>(
  generator: (...args: TArgs) => T
) => {
  let hasBeenInitialised = false;
  let cached: T | undefined;

  return (...args: TArgs) => {
    if (!hasBeenInitialised) {
      cached = generator(...args);
      hasBeenInitialised = true;
    }

    return cached as T;
  };
};
