import { it, expect, vi } from 'vitest';
import { lazyInit } from './lazyInit';

it('should initialize the value only once', () => {
  const generator = vi.fn(() => 'initialized');
  const init = lazyInit(generator);

  const firstCall = init();
  const secondCall = init();

  expect(firstCall).toBe('initialized');
  expect(secondCall).toBe('initialized');
  expect(generator).toHaveBeenCalledTimes(1);
});

it('should pass arguments to the generator function', () => {
  const generator = vi.fn((a: number, b: number) => a + b);
  const init = lazyInit(generator);

  const result = init(2, 3);

  expect(result).toBe(5);
  expect(generator).toHaveBeenCalledWith(2, 3);
});
