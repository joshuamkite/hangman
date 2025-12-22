interface KeyboardProps {
    onGuess: (letter: string) => void;
    guessedLetters: Set<string>;
    incorrectGuesses: string[];
    disabled: boolean;
}

const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

export default function Keyboard({ onGuess, guessedLetters, incorrectGuesses, disabled }: KeyboardProps) {
    const getKeyClass = (letter: string): string => {
        if (!guessedLetters.has(letter)) return 'key';
        if (incorrectGuesses.includes(letter)) return 'key incorrect';
        return 'key correct';
    };

    return (
        <div className="keyboard">
            {KEYBOARD_ROWS.map((row, rowIndex) => (
                <div key={rowIndex} className="keyboard-row">
                    {row.map(letter => (
                        <button
                            key={letter}
                            className={getKeyClass(letter)}
                            onClick={() => onGuess(letter)}
                            disabled={disabled || guessedLetters.has(letter)}
                        >
                            {letter}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
}
