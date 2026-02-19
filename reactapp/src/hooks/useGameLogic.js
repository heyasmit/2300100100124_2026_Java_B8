import { useState, useEffect, useCallback, useRef } from 'react';

const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;
const INITIAL_SNAKE = [{x: 10, y: 10}];
const INITIAL_DIRECTION = {x: 1, y: 0};

export const useGameLogic = (isMultiplayer = false, onGameOver = null) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(generateFood());
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameLoopRef = useRef(null);

  function generateFood() {
    return {
      x: Math.floor(Math.random() * GRID_WIDTH),
      y: Math.floor(Math.random() * GRID_HEIGHT)
    };
  }

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
  }, []);

  const moveSnake = useCallback((currentSnake, currentDirection) => {
    const head = currentSnake[0];
    const newHead = {
      x: (head.x + currentDirection.x + GRID_WIDTH) % GRID_WIDTH,
      y: (head.y + currentDirection.y + GRID_HEIGHT) % GRID_HEIGHT
    };

    // Check self collision
    if (currentSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      setGameOver(true);
      if (onGameOver) onGameOver(score);
      return currentSnake;
    }

    let newSnake = [newHead, ...currentSnake];

    // Check food collision
    if (newHead.x === food.x && newHead.y === food.y) {
      setScore(s => s + 10);
      setFood(generateFood());
    } else {
      newSnake.pop();
    }

    return newSnake;
  }, [food, score, onGameOver]);

  useEffect(() => {
    if (gameOver) return;

    const handleKeyPress = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'arrowup' || key === 'w') {
        if (direction.y === 0) setNextDirection({x: 0, y: -1});
        e.preventDefault();
      }
      if (key === 'arrowdown' || key === 's') {
        if (direction.y === 0) setNextDirection({x: 0, y: 1});
        e.preventDefault();
      }
      if (key === 'arrowleft' || key === 'a') {
        if (direction.x === 0) setNextDirection({x: -1, y: 0});
        e.preventDefault();
      }
      if (key === 'arrowright' || key === 'd') {
        if (direction.x === 0) setNextDirection({x: 1, y: 0});
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver]);

  useEffect(() => {
    if (gameOver) return;

    gameLoopRef.current = setInterval(() => {
      setSnake(currentSnake => {
        setDirection(nextDirection);
        return moveSnake(currentSnake, nextDirection);
      });
    }, 100);

    return () => clearInterval(gameLoopRef.current);
  }, [moveSnake, nextDirection, gameOver]);

  return {
    snake,
    food,
    score,
    gameOver,
    resetGame,
    setSnake,
    setDirection
  };
};
