export const createDigitValidator =
  (base: number) =>
  (char: string): boolean => {
    const validChars = '0123456789abcdef'.slice(0, base);
    return validChars.includes(char.toLowerCase());
  };

export const isValidGuess = (guess: string, length: number, base: number): boolean => {
  if (guess.length !== length) return false;

  const uniqueChars = new Set(guess.toLowerCase());
  if (uniqueChars.size !== length) return false;

  const validator = createDigitValidator(base);
  return [...guess].every(validator);
};

export const generateSecret = (
  length: number,
  base: number,
  random: () => number = Math.random
): string => {
  const availableDigits = '0123456789abcdef'.slice(0, base).split('');
  return Array.from({ length }).reduce((acc) => {
    const randIndex = Math.floor(random() * availableDigits.length);
    const [picked] = availableDigits.splice(randIndex, 1);
    return acc + picked;
  }, '');
};

export const evaluateGuess = (secret: string, guess: string): { bulls: number; cows: number } => {
  const lowerSecret = secret.toLowerCase();
  const lowerGuess = guess.toLowerCase();

  const bulls = [...lowerGuess].reduce(
    (acc, char, index) => (char === lowerSecret[index] ? acc + 1 : acc),
    0
  );

  const cows = [...lowerGuess].reduce(
    (acc, char, index) =>
      lowerSecret.includes(char) && char !== lowerSecret[index] ? acc + 1 : acc,
    0
  );

  return { bulls, cows };
};

const countPossibleSecretsRaw = (length: number, base: number): number => {
  if (length === 0) return 1;
  if (length > base) return 0;
  return base * countPossibleSecretsRaw(length - 1, base - 1);
};

const memoizationCache = new Map<string, number>();

export const countPossibleSecrets = (length: number, base: number): number => {
  const key = `${length},${base}`;
  if (memoizationCache.has(key)) {
    return memoizationCache.get(key) as number;
  }
  const result = countPossibleSecretsRaw(length, base);
  memoizationCache.set(key, result);
  return result;
};
