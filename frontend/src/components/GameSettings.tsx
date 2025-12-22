import type { FigureType, Difficulty } from '../types';

interface GameSettingsProps {
    figureType: FigureType;
    difficulty: Difficulty;
    wordLength: number;
    onFigureTypeChange: (type: FigureType) => void;
    onDifficultyChange: (difficulty: Difficulty) => void;
    onWordLengthChange: (length: number) => void;
    onNewGame: () => void;
    disabled: boolean;
}

export default function GameSettings({
    figureType,
    difficulty,
    wordLength,
    onFigureTypeChange,
    onDifficultyChange,
    onWordLengthChange,
    onNewGame,
    disabled
}: GameSettingsProps) {
    return (
        <div className="game-settings">
            <div className="setting-group">
                <label htmlFor="figure-type">Figure Type:</label>
                <select
                    id="figure-type"
                    value={figureType}
                    onChange={(e) => onFigureTypeChange(e.target.value as FigureType)}
                    disabled={disabled}
                >
                    <option value="person">Person</option>
                    <option value="spider">Spider</option>
                </select>
            </div>

            <div className="setting-group">
                <label htmlFor="difficulty">Difficulty:</label>
                <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
                    disabled={disabled}
                >
                    <option value="easy">Easy (10 wrong guesses)</option>
                    <option value="hard">Hard (6 wrong guesses)</option>
                </select>
            </div>

            <div className="setting-group">
                <label htmlFor="word-length">Word Length:</label>
                <select
                    id="word-length"
                    value={wordLength}
                    onChange={(e) => onWordLengthChange(parseInt(e.target.value))}
                    disabled={disabled}
                >
                    {Array.from({ length: 18 }, (_, i) => i + 3).map(length => (
                        <option key={length} value={length}>{length} letters</option>
                    ))}
                </select>
            </div>

            <div className="setting-group">
                <label>&nbsp;</label>
                <button className="new-game-btn" onClick={onNewGame} disabled={disabled}>
                    New Game
                </button>
            </div>
        </div>
    );
}
