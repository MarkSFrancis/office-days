import { describe, expect, it } from 'vitest';
import { Duration } from './utils';

describe('Duration', () => {
  it('should return 0 for zero', () => {
    expect(Duration.zero).toEqual(0);
  });

  it('should return negative value if asked for negative duration', () => {
    expect(Duration.milliseconds(-50)).toEqual(-50);
  });

  it('should return same value for milliseconds', () => {
    expect(Duration.milliseconds(50)).toEqual(50);
  });

  it('should return 2000 for 2 seconds', () => {
    expect(Duration.seconds(2)).toEqual(2000);
  });

  it('should return 120_000 for 2 seconds', () => {
    expect(Duration.minutes(2)).toEqual(120_000);
  });

  it('should return 7_200_000 for 2 hours', () => {
    expect(Duration.hours(2)).toEqual(7_200_000);
  });
});
