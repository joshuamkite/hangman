import type { Difficulty } from '../types';

interface PersonFigureProps {
    wrongGuesses: number;
    difficulty: Difficulty;
}

const PIECES_TO_SHOW = {
    easy: 10,
    hard: 6
} as const;

export default function PersonFigure({ wrongGuesses, difficulty }: PersonFigureProps) {
    const maxPieces = PIECES_TO_SHOW[difficulty];
    const piecesToDraw = Math.min(wrongGuesses, maxPieces);

    return (
        <svg width="300" height="350" viewBox="0 0 200 250" className="hangman-figure">
            {/* Gallows */}
            <line x1="10" y1="230" x2="150" y2="230" className="gallows-line" strokeWidth="4" />
            <line x1="50" y1="230" x2="50" y2="20" className="gallows-line" strokeWidth="4" />
            <line x1="50" y1="20" x2="130" y2="20" className="gallows-line" strokeWidth="4" />
            <line x1="130" y1="20" x2="130" y2="50" className="gallows-line" strokeWidth="4" />

            {/* Person parts */}
            {/* 1. Head */}
            {piecesToDraw >= 1 && (
                <circle cx="130" cy="70" r="20" className="figure-part" strokeWidth="3" fill="none" />
            )}

            {/* 2. Body */}
            {piecesToDraw >= 2 && (
                <line x1="130" y1="90" x2="130" y2="150" className="figure-part" strokeWidth="3" />
            )}

            {/* 3. Left arm */}
            {piecesToDraw >= 3 && (
                <line x1="130" y1="110" x2="100" y2="130" className="figure-part" strokeWidth="3" />
            )}

            {/* 4. Right arm */}
            {piecesToDraw >= 4 && (
                <line x1="130" y1="110" x2="160" y2="130" className="figure-part" strokeWidth="3" />
            )}

            {/* 5. Left leg */}
            {piecesToDraw >= 5 && (
                <line x1="130" y1="150" x2="100" y2="180" className="figure-part" strokeWidth="3" />
            )}

            {/* 6. Right leg */}
            {piecesToDraw >= 6 && (
                <line x1="130" y1="150" x2="160" y2="180" className="figure-part" strokeWidth="3" />
            )}

            {/* Easy mode additional pieces */}
            {/* 7. Left hand */}
            {difficulty === 'easy' && piecesToDraw >= 7 && (
                <circle cx="100" cy="130" r="4" className="figure-fill" />
            )}

            {/* 8. Right hand */}
            {difficulty === 'easy' && piecesToDraw >= 8 && (
                <circle cx="160" cy="130" r="4" className="figure-fill" />
            )}

            {/* 9. Left foot */}
            {difficulty === 'easy' && piecesToDraw >= 9 && (
                <line x1="100" y1="180" x2="90" y2="185" className="figure-part" strokeWidth="3" />
            )}

            {/* 10. Right foot */}
            {difficulty === 'easy' && piecesToDraw >= 10 && (
                <line x1="160" y1="180" x2="170" y2="185" className="figure-part" strokeWidth="3" />
            )}
        </svg>
    );
}
