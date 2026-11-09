export type GameStatus = 'settings' | 'playing' | 'won';
export type Base = 2 | 8 | 10 | 16;

export interface GameState {
  length: number;
  base: Base;
  secret: string;
  history: { guess: string; bulls: number; cows: number }[];
  startTime: number | null;
  status: GameStatus;
}

export const initialState: GameState = {
  length: 4,
  base: 10,
  secret: '',
  history: [],
  startTime: null,
  status: 'settings',
};

export const updateSettings = (state: GameState, length: number, base: Base): GameState => ({
  ...state,
  length,
  base,
});

export const startGame = (state: GameState, secret: string): GameState => ({
  ...state,
  secret,
  history: [],
  startTime: Date.now(),
  status: 'playing',
});

export const addAttempt = (
  state: GameState,
  guess: string,
  bulls: number,
  cows: number
): GameState => ({
  ...state,
  history: [...state.history, { guess, bulls, cows }],
});

export const winGame = (state: GameState): GameState => ({
  ...state,
  status: 'won',
});

export const resetGame = (): GameState => ({ ...initialState });
