export const createDigitValidator =
  (base: number) =>
  (char: string): boolean => {
    const validChars = '0123456789abcdef'.slice(0, base);
    return validChars.includes(char.toLowerCase());
  };
