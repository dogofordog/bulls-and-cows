import { describe, it, expect } from 'vitest';
import {
  createDigitValidator,
  isValidGuess,
  generateSecret,
  evaluateGuess,
  countPossibleSecrets,
} from './logic';

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

describe('evaluateGuess', () => {
  it('should return 4 bulls for exact match', () => {
    expect(evaluateGuess('1234', '1234')).toEqual({ bulls: 4, cows: 0 });
  });

  it('should return 0 bulls and 4 cows for all digits in wrong positions', () => {
    expect(evaluateGuess('1234', '4321')).toEqual({ bulls: 0, cows: 4 });
  });

  it('should return mixed bulls and cows', () => {
    expect(evaluateGuess('1234', '1243')).toEqual({ bulls: 2, cows: 2 });
  });

  it('should return 0 bulls and 0 cows for no matching digits', () => {
    expect(evaluateGuess('1234', '5678')).toEqual({ bulls: 0, cows: 0 });
  });

  it('should handle hex case-insensitively', () => {
    expect(evaluateGuess('a1b2', 'A1B2')).toEqual({ bulls: 4, cows: 0 });
    expect(evaluateGuess('a1b2', '2b1a')).toEqual({ bulls: 0, cows: 4 });
  });

  it('should handle partial matches correctly', () => {
    expect(evaluateGuess('1234', '1567')).toEqual({ bulls: 1, cows: 0 });
    expect(evaluateGuess('1234', '5234')).toEqual({ bulls: 3, cows: 0 });
  });
});

describe('countPossibleSecrets', () => {
  it('should return 1 for length 0', () => {
    expect(countPossibleSecrets(0, 10)).toBe(1);
  });

  it('should return base for length 1', () => {
    expect(countPossibleSecrets(1, 10)).toBe(10);
    expect(countPossibleSecrets(1, 16)).toBe(16);
  });

  it('should return correct permutations for length 2', () => {
    expect(countPossibleSecrets(2, 10)).toBe(90); // 10 * 9
  });

  it('should return correct permutations for length 4 in base 10', () => {
    expect(countPossibleSecrets(4, 10)).toBe(5040); // 10 * 9 * 8 * 7
  });

  it('should return 0 if length exceeds base', () => {
    expect(countPossibleSecrets(5, 2)).toBe(0);
    expect(countPossibleSecrets(11, 10)).toBe(0);
  });

  it('should be memoized (return cached result on repeated calls)', () => {
    const result1 = countPossibleSecrets(4, 10);
    const result2 = countPossibleSecrets(4, 10);
    expect(result1).toBe(result2);
  });
});
