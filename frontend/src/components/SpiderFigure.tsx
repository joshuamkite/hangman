import type { Difficulty } from '../types';

interface SpiderFigureProps {
    wrongGuesses: number;
    difficulty: Difficulty;
}

const PIECES_TO_SHOW = {
    easy: 10,
    hard: 6
} as const;

export default function SpiderFigure({ wrongGuesses, difficulty }: SpiderFigureProps) {
    const maxPieces = PIECES_TO_SHOW[difficulty];
    const piecesToDraw = Math.min(wrongGuesses, maxPieces);

    return (
        <svg width="300" height="350" viewBox="0 0 200 250" className="hangman-figure">
            {/* Larger Spider Web - centered */}
            <g className="spider-web">
                {/* Radial threads from center */}
                <line x1="100" y1="125" x2="100" y2="10" className="web-thread" strokeWidth="2" />
                <line x1="100" y1="125" x2="175" y2="25" className="web-thread" strokeWidth="2" />
                <line x1="100" y1="125" x2="195" y2="85" className="web-thread" strokeWidth="2" />
                <line x1="100" y1="125" x2="195" y2="165" className="web-thread" strokeWidth="2" />
                <line x1="100" y1="125" x2="175" y2="225" className="web-thread" strokeWidth="2" />
                <line x1="100" y1="125" x2="100" y2="240" className="web-thread" strokeWidth="2" />
                <line x1="100" y1="125" x2="25" y2="225" className="web-thread" strokeWidth="2" />
                <line x1="100" y1="125" x2="5" y2="165" className="web-thread" strokeWidth="2" />
                <line x1="100" y1="125" x2="5" y2="85" className="web-thread" strokeWidth="2" />
                <line x1="100" y1="125" x2="25" y2="25" className="web-thread" strokeWidth="2" />

                {/* Connecting threads - circular patterns */}
                {/* Inner circle */}
                <polygon points="100,95 120,100 130,110 130,140 120,150 100,155 80,150 70,140 70,110 80,100"
                    className="web-circle" strokeWidth="2" fill="none" />

                {/* Middle circle */}
                <polygon points="100,65 135,75 155,95 155,155 135,175 100,185 65,175 45,155 45,95 65,75"
                    className="web-circle" strokeWidth="2" fill="none" />

                {/* Outer circle */}
                <polygon points="100,35 165,50 190,85 190,165 165,200 100,215 35,200 10,165 10,85 35,50"
                    className="web-circle" strokeWidth="2" fill="none" />
            </g>

            {/* Spider parts - sitting at web center */}
            {/* 1. Body */}
            {piecesToDraw >= 1 && (
                <ellipse cx="100" cy="135" rx="18" ry="28" className="figure-part" strokeWidth="3" fill="none" />
            )}

            {/* 2. Head */}
            {piecesToDraw >= 2 && (
                <circle cx="100" cy="105" r="15" className="figure-part" strokeWidth="3" fill="none" />
            )}

            {/* 3. Leg pair 1 - left */}
            {piecesToDraw >= 3 && (
                <>
                    <line x1="88" y1="110" x2="55" y2="95" className="figure-part" strokeWidth="3" />
                    <line x1="55" y1="95" x2="30" y2="110" className="figure-part" strokeWidth="3" />
                </>
            )}

            {/* 4. Leg pair 1 - right */}
            {piecesToDraw >= 4 && (
                <>
                    <line x1="112" y1="110" x2="145" y2="95" className="figure-part" strokeWidth="3" />
                    <line x1="145" y1="95" x2="170" y2="110" className="figure-part" strokeWidth="3" />
                </>
            )}

            {/* 5. Leg pair 2 - left */}
            {piecesToDraw >= 5 && (
                <>
                    <line x1="88" y1="130" x2="50" y2="120" className="figure-part" strokeWidth="3" />
                    <line x1="50" y1="120" x2="20" y2="125" className="figure-part" strokeWidth="3" />
                </>
            )}

            {/* 6. Leg pair 2 - right */}
            {piecesToDraw >= 6 && (
                <>
                    <line x1="112" y1="130" x2="150" y2="120" className="figure-part" strokeWidth="3" />
                    <line x1="150" y1="120" x2="180" y2="125" className="figure-part" strokeWidth="3" />
                </>
            )}

            {/* Easy mode additional pieces - legs 5-8 */}
            {/* 7. Leg pair 3 - left */}
            {difficulty === 'easy' && piecesToDraw >= 7 && (
                <>
                    <line x1="88" y1="145" x2="50" y2="155" className="figure-part" strokeWidth="3" />
                    <line x1="50" y1="155" x2="20" y2="160" className="figure-part" strokeWidth="3" />
                </>
            )}

            {/* 8. Leg pair 3 - right */}
            {difficulty === 'easy' && piecesToDraw >= 8 && (
                <>
                    <line x1="112" y1="145" x2="150" y2="155" className="figure-part" strokeWidth="3" />
                    <line x1="150" y1="155" x2="180" y2="160" className="figure-part" strokeWidth="3" />
                </>
            )}

            {/* 9. Leg pair 4 - left */}
            {difficulty === 'easy' && piecesToDraw >= 9 && (
                <>
                    <line x1="88" y1="160" x2="55" y2="175" className="figure-part" strokeWidth="3" />
                    <line x1="55" y1="175" x2="30" y2="190" className="figure-part" strokeWidth="3" />
                </>
            )}

            {/* 10. Leg pair 4 - right (8 legs total) */}
            {difficulty === 'easy' && piecesToDraw >= 10 && (
                <>
                    <line x1="112" y1="160" x2="145" y2="175" className="figure-part" strokeWidth="3" />
                    <line x1="145" y1="175" x2="170" y2="190" className="figure-part" strokeWidth="3" />
                </>
            )}
        </svg>
    );
}
