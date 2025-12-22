import { useState, useEffect, useCallback } from 'react';
import type { GameState, FigureType, Difficulty } from './types';
import { MAX_WRONG_GUESSES } from './types';
import { fetchWord } from './api';
import PersonFigure from './components/PersonFigure';
import SpiderFigure from './components/SpiderFigure';
import WordDisplay from './components/WordDisplay';
import Keyboard from './components/Keyboard';
import GameSettings from './components/GameSettings';
import LicenseModal from './components/LicenseModal';
import './App.css';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    word: '',
    guessedLetters: new Set(),
    incorrectGuesses: [],
    gameStatus: 'loading',
    definition: '',
    figureType: 'person',
    difficulty: 'easy',
    wordLength: 5
  });

  const [error, setError] = useState<string>('');
  const [showLicense, setShowLicense] = useState(false);

  const startNewGame = useCallback(async () => {
    setError('');
    setGameState(prev => ({ ...prev, gameStatus: 'loading' }));

    try {
      const data = await fetchWord(gameState.wordLength);
      setGameState(prev => ({
        ...prev,
        word: data.word,
        definition: data.definition,
        guessedLetters: new Set(),
        incorrectGuesses: [],
        gameStatus: 'playing'
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch word');
      setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
    }
  }, [gameState.wordLength]);

  useEffect(() => {
    startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGuess = useCallback((letter: string) => {
    if (gameState.gameStatus !== 'playing') return;
    if (gameState.guessedLetters.has(letter)) return;

    const newGuessedLetters = new Set(gameState.guessedLetters);
    newGuessedLetters.add(letter);

    const isCorrect = gameState.word.includes(letter);
    const newIncorrectGuesses = isCorrect
      ? gameState.incorrectGuesses
      : [...gameState.incorrectGuesses, letter];

    // Check win condition
    const allLettersGuessed = gameState.word
      .split('')
      .every(l => newGuessedLetters.has(l));

    // Check lose condition
    const maxWrong = MAX_WRONG_GUESSES[gameState.difficulty];
    const lost = newIncorrectGuesses.length >= maxWrong;

    setGameState(prev => ({
      ...prev,
      guessedLetters: newGuessedLetters,
      incorrectGuesses: newIncorrectGuesses,
      gameStatus: allLettersGuessed ? 'won' : lost ? 'lost' : 'playing'
    }));
  }, [gameState]);

  // Keyboard event listener
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        handleGuess(key);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleGuess]);

  const handleFigureTypeChange = (type: FigureType) => {
    setGameState(prev => ({ ...prev, figureType: type }));
  };

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setGameState(prev => ({ ...prev, difficulty }));
  };

  const handleWordLengthChange = (length: number) => {
    if (length >= 3 && length <= 20) {
      setGameState(prev => ({ ...prev, wordLength: length }));
    }
  };

  const isGameActive = gameState.gameStatus === 'playing';
  const isGameOver = gameState.gameStatus === 'won' || gameState.gameStatus === 'lost';

  return (
    <div className="app">
      <header>
        <h1>Hangman</h1>
      </header>

      <main className="game-container">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="game-wrapper">
          <GameSettings
            figureType={gameState.figureType}
            difficulty={gameState.difficulty}
            wordLength={gameState.wordLength}
            onFigureTypeChange={handleFigureTypeChange}
            onDifficultyChange={handleDifficultyChange}
            onWordLengthChange={handleWordLengthChange}
            onNewGame={startNewGame}
            disabled={gameState.gameStatus === 'loading'}
          />

          <div className="game-board">
            <div className="figure-container">
              {gameState.figureType === 'person' ? (
                <PersonFigure
                  wrongGuesses={gameState.incorrectGuesses.length}
                  difficulty={gameState.difficulty}
                />
              ) : (
                <SpiderFigure
                  wrongGuesses={gameState.incorrectGuesses.length}
                  difficulty={gameState.difficulty}
                />
              )}
              <div className="wrong-count">
                Wrong guesses: {gameState.incorrectGuesses.length} / {MAX_WRONG_GUESSES[gameState.difficulty]}
              </div>
            </div>

            <div className="game-info">
              {gameState.gameStatus === 'loading' ? (
                <div className="loading">Loading word...</div>
              ) : (
                <>
                  <WordDisplay
                    word={gameState.word}
                    guessedLetters={gameState.guessedLetters}
                    revealed={isGameOver}
                  />

                  {gameState.incorrectGuesses.length > 0 && (
                    <div className="incorrect-letters">
                      <strong>Incorrect:</strong> {gameState.incorrectGuesses.join(', ')}
                    </div>
                  )}

                  {gameState.gameStatus === 'won' && (
                    <div className="game-result won">
                      <h2>You Won!</h2>
                      <p className="definition">
                        <strong>Definition:</strong> {gameState.definition}
                      </p>
                    </div>
                  )}

                  {gameState.gameStatus === 'lost' && (
                    <div className="game-result lost">
                      <h2>Game Over!</h2>
                      <p>The word was: <strong>{gameState.word}</strong></p>
                      <p className="definition">
                        <strong>Definition:</strong> {gameState.definition}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <Keyboard
            onGuess={handleGuess}
            guessedLetters={gameState.guessedLetters}
            incorrectGuesses={gameState.incorrectGuesses}
            disabled={!isGameActive}
          />

          <div className="game-footer">
            <a
              href="https://www.joshuakite.co.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-button"
            >
              Visit My Website
            </a>
            <a
              href="https://github.com/code-joshua/hangman"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-button"
            >
              View Source
            </a>
            <button
              className="footer-button"
              onClick={() => setShowLicense(true)}
            >
              View License
            </button>
          </div>
        </div>
      </main>

      {showLicense && (
        <LicenseModal onClose={() => setShowLicense(false)} />
      )}
    </div>
  );
}

export default App;
