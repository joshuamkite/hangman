export type FigureType = 'person' | 'spider';

export type Difficulty = 'easy' | 'hard';

export interface WordData {
    word: string;
    length: number;
    definition: string;
    attempts: number;
}

export interface GameState {
    word: string;
    guessedLetters: Set<string>;
    incorrectGuesses: string[];
    gameStatus: 'playing' | 'won' | 'lost' | 'loading';
    definition: string;
    figureType: FigureType;
    difficulty: Difficulty;
    wordLength: number;
}

// Number of wrong guesses allowed based on difficulty
export const MAX_WRONG_GUESSES = {
    easy: 10,
    hard: 6
} as const;
