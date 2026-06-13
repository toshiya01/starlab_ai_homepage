import { describe, it, expect } from 'vitest';
import { easeOutCubic, countValue } from '../src/utils.js';

describe('easeOutCubic', () => {
  it('returns 0 at progress 0', () => {
    expect(easeOutCubic(0)).toBe(0);
  });

  it('returns 1 at progress 1', () => {
    expect(easeOutCubic(1)).toBe(1);
  });

  it('eases out: midpoint progress is past linear midpoint', () => {
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
    expect(easeOutCubic(0.5)).toBeCloseTo(0.875, 5);
  });

  it('clamps progress below 0 to 0', () => {
    expect(easeOutCubic(-0.5)).toBe(0);
  });

  it('clamps progress above 1 to 1', () => {
    expect(easeOutCubic(1.5)).toBe(1);
  });
});

describe('countValue', () => {
  it('returns 0 at progress 0', () => {
    expect(countValue(500, 0)).toBe(0);
  });

  it('returns the target at progress 1', () => {
    expect(countValue(500, 1)).toBe(500);
  });

  it('returns an eased integer mid-animation', () => {
    expect(countValue(100, 0.5)).toBe(88); // round(100 * 0.875)
  });

  it('returns integers for fractional eased values', () => {
    expect(Number.isInteger(countValue(98, 0.3))).toBe(true);
  });
});
