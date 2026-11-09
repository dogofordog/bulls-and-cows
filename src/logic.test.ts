import { describe, it, expect } from 'vitest';
import { createDigitValidator } from './logic';

describe('createDigitValidator', () => {
  it('should return true for valid digits in base 10', () => {
    const isValid = createDigitValidator(10);
    expect(isValid('5')).toBe(true);
    expect(isValid('9')).toBe(true);
    expect(isValid('10')).toBe(false);
  });

  it('should handle hex case-insensitively', () => {
    const isValid = createDigitValidator(16);
    expect(isValid('a')).toBe(true);
    expect(isValid('A')).toBe(true);
    expect(isValid('f')).toBe(true);
    expect(isValid('F')).toBe(true);
    expect(isValid('g')).toBe(false);
    expect(isValid('G')).toBe(false);
  });

  it('should restrict to base 2', () => {
    const isValid = createDigitValidator(2);
    expect(isValid('0')).toBe(true);
    expect(isValid('1')).toBe(true);
    expect(isValid('2')).toBe(false);
  });
});
