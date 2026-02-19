import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { GameBoard } from './GameBoard';
import './MultiplayerGame.css';

const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;
const CELL_SIZE = 20;

export const MultiplayerGame = ({ roomCode: initialRoomCode, onBack }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [roomCode, setRoomCode] = useState(initialRoomCode || '');
  const [mode, setMode] = useState('create'); // 'create' or 'join'
  const [players, setPlayers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [currentPlayerSnake, setCurrentPlayerSnake] = useState([{x: 10, y: 10}]);
  const [currentScore, setCurrentScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [allPlayers, setAllPlayers] = useState({});
  const [message, setMessage] = useState('');
  const socketRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    socketRef.current = newSocket;
    setSocket(newSocket);

    // Handle socket events
    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('room-created', (data) => {
      setRoomCode(data.roomCode);
      setCurrentPlayerId(data.playerId);
      setMessage('Room created! Share the code with your friends.');
    });

    newSocket.on('player-joined', (data) => {
      setPlayers(data.players);
      setMessage(`${data.playerName} joined the room!`);
    });

    newSocket.on('game-started', () => {
      setGameStarted(true);
    });

    newSocket.on('player-moved', (data) => {
      setAllPlayers(prev => ({
        ...prev,
        [data.playerId]: {
          snake: data.snake,
          score: data.score,
          name: data.playerName
        }
      }));
    });

    newSocket.on('player-dead', (data) => {
      setPlayers(prev => prev.filter(p => p.id !== data.playerId));
      if (data.playerId === currentPlayerId) {
        setGameOver(true);
      }
    });

    newSocket.on('error', (error) => {
      setMessage(`Error: ${error}`);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentPlayerId]);

  // Game logic for multiplayer
  useEffect(() => {
    if (!gameStarted || !socket || gameOver) return;

    let direction = { x: 1, y: 0 };
    let nextDirection = { x: 1, y: 0 };

    const handleKeyPress = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'arrowup' || key === 'w') {
        if (direction.y === 0) nextDirection = {x: 0, y: -1};
        e.preventDefault();
      }
      if (key === 'arrowdown' || key === 's') {
        if (direction.y === 0) nextDirection = {x: 0, y: 1};
        e.preventDefault();
      }
      if (key === 'arrowleft' || key === 'a') {
        if (direction.x === 0) nextDirection = {x: -1, y: 0};
        e.preventDefault();
      }
      if (key === 'arrowright' || key === 'd') {
        if (direction.x === 0) nextDirection = {x: 1, y: 0};
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    const gameLoop = setInterval(() => {
      setCurrentPlayerSnake(prevSnake => {
        direction = nextDirection;
        const head = prevSnake[0];
        const newHead = {
          x: (head.x + direction.x + GRID_WIDTH) % GRID_WIDTH,
          y: (head.y + direction.y + GRID_HEIGHT) % GRID_HEIGHT
        };

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          socket.emit('player-dead', { roomCode, playerId: currentPlayerId });
          return prevSnake;
        }

        let newSnake = [newHead, ...prevSnake];
        newSnake.pop();

        socket.emit('player-moved', {
          roomCode,
          playerId: currentPlayerId,
          snake: newSnake,
          score: currentScore
        });

        return newSnake;
      });
    }, 100);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameStarted, socket, gameOver, currentPlayerId, roomCode, currentScore]);

  const handleCreateRoom = () => {
    if (socket) {
      socket.emit('create-room');
    }
  };

  const handleJoinRoom = () => {
    if (roomCode && socket) {
      socket.emit('join-room', { roomCode });
      setCurrentPlayerId(socket.id);
      setMessage('Waiting for host to start the game...');
    }
  };

  const handleStartGame = () => {
    if (socket) {
      socket.emit('start-game', { roomCode });
    }
  };

  // Lobby view
  if (!gameStarted) {
    return (
      <div className="multiplayer-lobby">
        <div className="lobby-container">
          <button onClick={onBack} className="btn-back">← Back</button>
          
          {!roomCode ? (
            <div className="lobby-section">
              <h1>Join or Create a Room</h1>
              
              <div className="mode-buttons">
                <button 
                  className={`mode-btn ${mode === 'create' ? 'active' : ''}`}
                  onClick={() => setMode('create')}
                >
                  Create Room
                </button>
                <button 
                  className={`mode-btn ${mode === 'join' ? 'active' : ''}`}
                  onClick={() => setMode('join')}
                >
                  Join Room
                </button>
              </div>

              {mode === 'create' ? (
                <div className="action-section">
                  <button onClick={handleCreateRoom} className="btn-primary">
                    Create New Room
                  </button>
                </div>
              ) : (
                <div className="action-section">
                  <input
                    type="text"
                    placeholder="Enter room code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="room-input"
                    maxLength="6"
                  />
                  <button onClick={handleJoinRoom} className="btn-primary">
                    Join Room
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="lobby-section">
              <h1>Room: {roomCode}</h1>
              
              <div className="room-info">
                <p className="code-display">
                  Room Code: <span className="code">{roomCode}</span>
                </p>
                <p className="player-count">Players: {players.length}</p>
              </div>

              <div className="players-list">
                <h3>Players in Room:</h3>
                <ul>
                  {players.map((player, idx) => (
                    <li key={idx}>
                      {player.name} {player.id === currentPlayerId ? '(You)' : ''}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="action-buttons">
                <button onClick={() => {
                  setRoomCode('');
                  setPlayers([]);
                }} className="btn-secondary">
                  Leave Room
                </button>
                {players.length > 1 && (
                  <button onClick={handleStartGame} className="btn-primary">
                    Start Game
                  </button>
                )}
              </div>
            </div>
          )}

          {message && (
            <div className="message-box">{message}</div>
          )}
        </div>
      </div>
    );
  }

  // Game view
  return (
    <div className="multiplayer-game-container">
      <div className="game-header">
        <div className="player-score">
          <h3>Your Score: {currentScore}</h3>
        </div>
        <div className="room-code-display">
          Room: {roomCode}
        </div>
      </div>

      <div className="game-boards-wrapper">
        <div className="main-board">
          <h3>You</h3>
          <GameBoard 
            snake={currentPlayerSnake}
            food={{x: Math.random() * 20, y: Math.random() * 20}}
            score={currentScore}
            gameOver={gameOver}
            onReset={() => {}}
          />
        </div>

        <div className="other-players">
          <h3>Other Players</h3>
          {Object.entries(allPlayers).map(([playerId, playerData]) => (
            <div key={playerId} className="opponent-board">
              <p>{playerData.name} - Score: {playerData.score}</p>
              <div 
                className="game-board"
                style={{
                  width: 200,
                  height: 200,
                }}
              >
                {playerData.snake.map((segment, idx) => (
                  <div
                    key={idx}
                    className={`snake-segment ${idx === 0 ? 'head' : ''}`}
                    style={{
                      left: (segment.x / 20) * 200,
                      top: (segment.y / 20) * 200,
                      width: 10,
                      height: 10,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {gameOver && (
        <div className="game-over-modal">
          <div className="modal-content">
            <h2>You're Out!</h2>
            <p>Your Score: {currentScore}</p>
            <button onClick={onBack} className="btn-primary">Back to Menu</button>
          </div>
        </div>
      )}
    </div>
  );
};
