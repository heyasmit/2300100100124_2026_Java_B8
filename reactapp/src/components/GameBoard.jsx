import React from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import './GameBoard.css';

const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;
const CELL_SIZE = 20;

export const GameBoard = ({ snake, food, score, gameOver, onReset }) => {
  return (
    <div className="game-container">
      <div className="score-board">
        <h2>Score: {score}</h2>
      </div>
      <div 
        className="game-board"
        style={{
          width: GRID_WIDTH * CELL_SIZE,
          height: GRID_HEIGHT * CELL_SIZE,
        }}
      >
        {/* Food */}
        <div
          className="food"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`snake-segment ${index === 0 ? 'head' : ''}`}
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
          />
        ))}
      </div>

      {gameOver && (
        <div className="game-over-modal">
          <div className="modal-content">
            <h2>Game Over!</h2>
            <p>Final Score: {score}</p>
            <button onClick={onReset} className="btn-primary">Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
};

export const SoloGame = ({ onBack }) => {
  const { snake, food, score, gameOver, resetGame } = useGameLogic();

  return (
    <div className="solo-game-container">
      <div className="header">
        <button onClick={onBack} className="btn-back">← Back</button>
        <h1>Snake Game - Solo</h1>
      </div>
      <p className="controls-info">Use Arrow Keys or WASD to move</p>
      <GameBoard 
        snake={snake}
        food={food}
        score={score}
        gameOver={gameOver}
        onReset={resetGame}
      />
    </div>
  );
};
