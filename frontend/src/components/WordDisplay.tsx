interface WordDisplayProps {
    word: string;
    guessedLetters: Set<string>;
    revealed?: boolean;
}

export default function WordDisplay({ word, guessedLetters, revealed = false }: WordDisplayProps) {
    return (
        <div className="word-display">
            {word.split('').map((letter, index) => {
                const isGuessed = guessedLetters.has(letter);
                const showLetter = isGuessed || revealed;

                return (
                    <span key={index} className="letter-slot">
                        {showLetter ? letter : '_'}
                    </span>
                );
            })}
        </div>
    );
}
