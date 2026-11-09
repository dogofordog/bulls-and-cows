import { describe, it, expect } from 'vitest';
import { createDigitValidator, isValidGuess, generateSecret } from './logic';

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

describe('isValidGuess', () => {
  it('should return true for a valid guess', () => {
    expect(isValidGuess('1234', 4, 10)).toBe(true);
    expect(isValidGuess('0123', 4, 10)).toBe(true);
  });

  it('should return false if length does not match', () => {
    expect(isValidGuess('123', 4, 10)).toBe(false);
    expect(isValidGuess('12345', 4, 10)).toBe(false);
  });

  it('should return false if characters are not unique', () => {
    expect(isValidGuess('1123', 4, 10)).toBe(false);
    expect(isValidGuess('1223', 4, 10)).toBe(false);
  });

  it('should return false if characters are invalid for the base', () => {
    expect(isValidGuess('1238', 4, 8)).toBe(false);
    expect(isValidGuess('12a3', 4, 10)).toBe(false);
  });

  it('should handle hex case-insensitively and check uniqueness', () => {
    expect(isValidGuess('1A2b', 4, 16)).toBe(true);
    expect(isValidGuess('1A1b', 4, 16)).toBe(false);
  });
});

describe('generateSecret', () => {
  it('should generate a secret of correct length', () => {
    const secret = generateSecret(4, 10, () => 0.5);
    expect(secret.length).toBe(4);
  });

  it('should generate unique digits', () => {
    const secret = generateSecret(4, 10, () => 0.5);
    const uniqueChars = new Set(secret);
    expect(uniqueChars.size).toBe(4);
  });

  it('should be deterministic with mocked random', () => {
    const mockRandom = () => 0.1;
    const secret1 = generateSecret(4, 10, mockRandom);
    const secret2 = generateSecret(4, 10, mockRandom);
    expect(secret1).toBe(secret2);
  });

  it('should use all available digits for small base', () => {
    const secret = generateSecret(2, 2, () => 0.5);
    expect(secret.length).toBe(2);
    expect(new Set(secret).size).toBe(2);
  });
});
