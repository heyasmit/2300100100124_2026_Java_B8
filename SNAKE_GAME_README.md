# 🐍 Multiplayer Snake Game

A modern multiplayer snake game built with React and Socket.io that supports both solo and multiplayer modes with room-based matchmaking!

## Features

✨ **Solo Mode**: Play against yourself with increasing difficulty
👥 **Multiplayer Mode**: Play with friends in private rooms using room codes
🎮 **Real-time Gameplay**: Smooth synchronization between all players
📊 **Score Tracking**: Keep track of your score in real-time
🎨 **Beautiful UI**: Modern gradient design with smooth animations

## Project Structure

```
2300100100124_2026_Java_B8/
├── reactapp/                 # React frontend
│   ├── src/
│   │   ├── components/      # Game components
│   │   │   ├── GameBoard.jsx
│   │   │   ├── GameBoard.css
│   │   │   ├── Menu.jsx
│   │   │   ├── Menu.css
│   │   │   ├── MultiplayerGame.jsx
│   │   │   └── MultiplayerGame.css
│   │   ├── hooks/
│   │   │   └── useGameLogic.js  # Game logic hook
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── ...
│   └── package.json
└── server/                  # Node.js backend
    ├── server.js           # Express + Socket.io server
    └── package.json
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
cd /workspaces/2300100100124_2026_Java_B8
```

2. **Install Backend Dependencies**
```bash
cd server
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../reactapp
npm install
```

## Running the Game

### Option 1: Run Both Server and Client

1. **Terminal 1 - Start the Backend Server**
```bash
cd server
npm start
# or for development with auto-reload:
# npm run dev
```
The server will start on `http://localhost:3001`

2. **Terminal 2 - Start the React Development Server**
```bash
cd reactapp
npm run dev
```
The frontend will start on `http://localhost:5173`

3. **Open your browser**
Navigate to `http://localhost:5173` to play!

## How to Play

### Controls
- **Arrow Keys** or **WASD**: Move the snake
- **ESC**: Return to menu (during gameplay)

### Solo Mode
1. Click "Solo Mode" from the main menu
2. Use arrow keys or WASD to move
3. Eat the red food to grow longer
4. Avoid hitting yourself or the walls (which wrap around)
5. Try to get the highest score!

### Multiplayer Mode

#### Creating a Room
1. Click "Multiplayer Mode" from the main menu
2. Click "Create Room"
3. Share the generated room code with your friends
4. Wait for at least one player to join
5. Click "Start Game" to begin

#### Joining a Room
1. Click "Multiplayer Mode" from the main menu
2. Click "Join Room"
3. Enter the room code provided by your friend
4. Wait for the host to start the game

#### Gameplay
- Be the last player alive to win!
- Your snake will grow as you eat food
- The game syncs in real-time with all other players
- When a player dies, they're eliminated from the game
- Last player standing wins!

## Game Rules

### Solo Mode
- Eat red food to grow and earn 10 points per food
- The snake wraps around when hitting walls (no Game Over on walls)
- Game ends when you hit yourself
- Try to beat your high score!

### Multiplayer Mode
- Same rules as solo mode
- Multiple snakes compete for food
- Last player alive wins the match
- Room creates automatically, no backend needed for room creation (everything is client-side)

## Features Breakdown

### Game Mechanics
- **Grid Size**: 20x20 tiles
- **Game Speed**: Moves every 100ms
- **Collision Detection**: Real-time self-collision and position sync
- **Food Generation**: Random food placement on the grid

### Multiplayer Features
- **WebSocket Communication**: Real-time game state synchronization via Socket.io
- **Room System**: 6-character alphanumeric room codes
- **Player Management**: Track multiple players with individual scores
- **Game States**: Lobby, Playing, Game Over

### UI/UX Features
- Responsive design with mobile support
- Smooth animations and transitions
- Real-time score updates
- Visual feedback for all interactions

## Technical Stack

### Frontend
- **React 19.2.0**: UI framework
- **Vite 7.3.1**: Build tool
- **Socket.io Client 4.7.2**: Real-time communication
- **CSS3**: Styling with gradients and animations

### Backend
- **Express.js 4.18.2**: Web framework
- **Socket.io 4.7.2**: WebSocket library
- **CORS**: Handle cross-origin requests
- **Node.js**: Runtime environment

## API Events

### Socket.io Events

#### Server Events (Listen)
- `create-room`: Create a new game room
- `join-room`: Join an existing room with code
- `start-game`: Start the game (owner only)
- `player-moved`: Broadcast player movement
- `player-dead`: Notify when a player dies
- `disconnect`: Handle player disconnection

#### Client Events (Receive)
- `room-created`: Room successfully created with code
- `player-joined`: New player joined the room
- `game-started`: Game has started for all players
- `player-moved`: Other player movement update
- `player-dead`: Player has been eliminated
- `game-over`: Game ended, winner announced
- `error`: Error message from server

## Customization

### Change Game Speed
Edit in `useGameLogic.js`:
```javascript
}, 100); // Change to higher value for slower speed
```

### Change Grid Size
Edit constants in `useGameLogic.js`:
```javascript
const GRID_WIDTH = 20;  // Change width
const GRID_HEIGHT = 20; // Change height
```

### Change Colors
Edit CSS files in `components/`:
- `.snake-segment`: Snake color
- `.food`: Food color
- `.game-board`: Board background

## Troubleshooting

### Can't connect to multiplayer
- Ensure the backend server is running on port 3001
- Check that frontend is trying to connect to `http://localhost:3001`
- Verify both are running on the same machine or correct network

### Room code not found
- Ensure you copied the code correctly (case-insensitive)
- Ask the room owner to share the code again
- The room might have been closed if all players disconnected

### Game feels laggy
- Check your internet connection
- Ensure the server is running locally
- Close other applications using network bandwidth

## Performance Tips
- Play with 2-4 players for best experience
- Close unnecessary browser tabs
- Run server on a dedicated terminal
- Use WebSocket instead of polling (Socket.io handles this automatically)

## Future Enhancements
- [ ] Power-ups and obstacles
- [ ] Different game modes (Timed, Survival, etc.)
- [ ] Player profiles and statistics
- [ ] Leaderboards
- [ ] Chat during lobby
- [ ] Death replay camera
- [ ] Customizable snake skins
- [ ] Sound effects and music

## License
MIT

## Author
Snake Game Developer

Enjoy playing! 🎮🐍
