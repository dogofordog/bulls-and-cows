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
