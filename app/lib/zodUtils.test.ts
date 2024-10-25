import { describe, expect as expect, it, vi } from 'vitest';
import { zodUtils } from './zodUtils';
import { z } from 'zod';

const expectPass = (schema: z.SafeParseReturnType<unknown, unknown>) =>
  expect(schema.success, JSON.stringify(schema.error, null, 2)).toEqual(true);

describe('string', () => {
  it('should not allow undefined', () => {
    const { success } = zodUtils.string().safeParse(undefined);

    expect(success).toBeFalsy();
  });

  it('should not allow null', () => {
    const { success } = zodUtils.string().safeParse(null);

    expect(success).toBeFalsy();
  });

  it('should not allow numbers', () => {
    const { success } = zodUtils.string().safeParse(1);

    expect(success).toBeFalsy();
  });

  it('should not allow whitespace strings', () => {
    const result = zodUtils.string().safeParse('    ');

    expect(result.success).toBeFalsy();
  });

  it('should trim whitespace', () => {
    const result = zodUtils.string().safeParse(' asdf ');

    expectPass(result);
    expect(result.data).toEqual('asdf');
  });
});

describe('optional', () => {
  it('should allow undefined', () => {
    const { success } = zodUtils.optional(z.string()).safeParse(undefined);

    expect(success).toBeTruthy();
  });

  it('should not allow null', () => {
    const { success } = zodUtils.optional(z.string()).safeParse(null);

    expect(success).toBeFalsy();
  });

  it('should allow whitespace strings but transform to undefined', () => {
    const result = zodUtils.optional(z.string()).safeParse('    ');

    expectPass(result);
    expect(result.data).toEqual(undefined);
  });

  it('should pass values through to underlying parser if not undefined', () => {
    const result = zodUtils.optional(z.string()).safeParse('asdf');

    expectPass(result);
    expect(result.data).toEqual('asdf');
  });

  it('should only call the inner validator when the value is set', () => {
    const fakeTransform = vi.fn();
    const result = zodUtils
      .optional(z.string().transform(fakeTransform))
      .safeParse(undefined);

    expectPass(result);
    expect(result.data).toEqual(undefined);
    expect(fakeTransform).not.toHaveBeenCalled();
  });
});

describe('id', () => {
  it('should not allow undefined', () => {
    const { success } = zodUtils.intId().safeParse(undefined);

    expect(success).toBeFalsy();
  });

  it('should not allow null', () => {
    const { success } = zodUtils.intId().safeParse(null);

    expect(success).toBeFalsy();
  });

  it('should not allow -1', () => {
    const { success } = zodUtils.intId().safeParse(-1);

    expect(success).toBeFalsy();
  });

  it('should not allow 0', () => {
    const { success } = zodUtils.intId().safeParse(0);

    expect(success).toBeFalsy();
  });

  it('should not allow 1.5', () => {
    const { success } = zodUtils.intId().safeParse(1.5);

    expect(success).toBeFalsy();
  });

  it('should allow 1', () => {
    const result = zodUtils.intId().safeParse(1);

    expectPass(result);
    expect(result.data).toEqual(1);
  });
});

describe('numPos', () => {
  it('should not allow undefined', () => {
    const { success } = zodUtils.numPos().safeParse(null);

    expect(success).toBeFalsy();
  });

  it('should not allow null', () => {
    const { success } = zodUtils.numPos().safeParse(null);

    expect(success).toBeFalsy();
  });

  it('should not allow -1', () => {
    const { success } = zodUtils.numPos().safeParse(-1);

    expect(success).toBeFalsy();
  });

  it('should not allow 0', () => {
    const { success } = zodUtils.numPos().safeParse(0);

    expect(success).toBeFalsy();
  });

  it('should not allow NaN', () => {
    const { success } = zodUtils.numPos().safeParse(NaN);

    expect(success).toBeFalsy();
  });

  it('should not allow Infinity', () => {
    const { success } = zodUtils.numPos().safeParse(Infinity);

    expect(success).toBeFalsy();
  });

  it('should allow 1.5', () => {
    const result = zodUtils.numPos().safeParse(1.5);

    expectPass(result);
    expect(result.data).toEqual(1.5);
  });

  it('should not allow ""', () => {
    const result = zodUtils.numPos().safeParse('');

    expect(result.success).toEqual(false);
  });

  it('should allow 1', () => {
    const result = zodUtils.numPos().safeParse(1);

    expectPass(result);
    expect(result.data).toEqual(1);
  });

  it('should allow "1" and convert it to 1', () => {
    const result = zodUtils.numPos().safeParse('1');

    expectPass(result);
    expect(result.data).toEqual(1);
  });
});
