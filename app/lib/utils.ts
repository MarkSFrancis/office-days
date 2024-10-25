import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert a duration into milliseconds. Useful for `setTimeout` intervals
 */
export const Duration = {
  zero: 0,
  milliseconds: (ms: number) => ms,
  seconds: (seconds: number) => seconds * 1000,
  minutes: (minutes: number) => minutes * 1000 * 60,
  hours: (hours: number) => hours * 1000 * 60 * 60,
};

/**
 * Wait for a certain number of milliseconds. Useful for testing how the UI responds to slow loading times
 */
export const waitFor = (milliseconds: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

type NullPropsToUndefined<T> = {
  [K in keyof T]: null extends T[K] ? NonNullable<T[K]> | undefined : T[K];
};

export const nullPropsToUndefined = <T extends Record<string, unknown>>(
  data: T
) => {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      if (value === null) {
        return [key, undefined];
      }
      return [key, value];
    })
  ) as NullPropsToUndefined<T>;
};
