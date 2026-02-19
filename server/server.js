import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Room management
const rooms = new Map();
const playerNames = new Map();

// Generate random room code
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create a new room
  socket.on('create-room', () => {
    const roomCode = generateRoomCode();
    socket.join(roomCode);
    
    if (!rooms.has(roomCode)) {
      rooms.set(roomCode, {
        code: roomCode,
        players: [],
        gameStarted: false,
        owner: socket.id
      });
    }

    const room = rooms.get(roomCode);
    room.players.push({
      id: socket.id,
      name: `Player ${room.players.length + 1}`,
      snake: [{x: 10, y: 10}],
      score: 0,
      alive: true
    });

    playerNames.set(socket.id, `Player ${room.players.length}`);
    
    socket.emit('room-created', {
      roomCode: roomCode,
      playerId: socket.id
    });

    console.log(`Room created: ${roomCode}`);
  });

  // Join existing room
  socket.on('join-room', (data) => {
    const { roomCode } = data;
    
    if (rooms.has(roomCode)) {
      const room = rooms.get(roomCode);
      
      // Check if game already started
      if (room.gameStarted) {
        socket.emit('error', 'Game has already started');
        return;
      }

      socket.join(roomCode);
      
      const playerNum = room.players.length + 1;
      const playerName = `Player ${playerNum}`;
      
      room.players.push({
        id: socket.id,
        name: playerName,
        snake: [{x: Math.random() * 20 | 0, y: Math.random() * 20 | 0}],
        score: 0,
        alive: true
      });

      playerNames.set(socket.id, playerName);
      
      // Notify all players in room
      io.to(roomCode).emit('player-joined', {
        roomCode,
        playerName,
        players: room.players.map(p => ({
          id: p.id,
          name: p.name
        }))
      });

      console.log(`Player ${playerName} joined room ${roomCode}`);
    } else {
      socket.emit('error', 'Room not found');
    }
  });

  // Start game
  socket.on('start-game', (data) => {
    const { roomCode } = data;
    const room = rooms.get(roomCode);

    if (room && room.owner === socket.id && room.players.length > 1) {
      room.gameStarted = true;
      io.to(roomCode).emit('game-started');
      console.log(`Game started in room ${roomCode}`);
    }
  });

  // Player moved
  socket.on('player-moved', (data) => {
    const { roomCode, playerId, snake, score } = data;
    const room = rooms.get(roomCode);

    if (room) {
      const player = room.players.find(p => p.id === playerId);
      if (player) {
        player.snake = snake;
        player.score = score;
      }

      // Broadcast to other players
      socket.to(roomCode).emit('player-moved', {
        playerId,
        snake,
        score,
        playerName: playerNames.get(playerId)
      });
    }
  });

  // Player died
  socket.on('player-dead', (data) => {
    const { roomCode, playerId } = data;
    const room = rooms.get(roomCode);

    if (room) {
      const player = room.players.find(p => p.id === playerId);
      if (player) {
        player.alive = false;
      }

      // Broadcast to all players
      io.to(roomCode).emit('player-dead', {
        playerId,
        playerName: playerNames.get(playerId)
      });

      // Check if only one player left
      const alivePlayers = room.players.filter(p => p.alive);
      if (alivePlayers.length === 1) {
        io.to(roomCode).emit('game-over', {
          winner: alivePlayers[0].name,
          playerId: alivePlayers[0].id
        });
        
        // Clean up room
        room.gameStarted = false;
        room.players.forEach(p => p.alive = true);
      }
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Find and remove player from all rooms
    for (const [roomCode, room] of rooms.entries()) {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        const playerName = room.players[playerIndex].name;
        room.players.splice(playerIndex, 1);

        // Notify other players
        io.to(roomCode).emit('player-joined', {
          roomCode,
          players: room.players.map(p => ({
            id: p.id,
            name: p.name
          }))
        });

        console.log(`Player ${playerName} left room ${roomCode}`);

        // Delete room if empty
        if (room.players.length === 0) {
          rooms.delete(roomCode);
          console.log(`Room ${roomCode} deleted (empty)`);
        }
      }
    }

    playerNames.delete(socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Snake Game Server running on port ${PORT}`);
});
