# Quick Start Guide - Multiplayer Snake Game

## 🚀 Get Started in 3 Minutes

### Step 1: Install Dependencies

#### Open Terminal 1 and run:
```bash
cd server
npm install
```

#### Open Terminal 2 and run:
```bash
cd reactapp
npm install
```

### Step 2: Start the Backend Server

In Terminal 1:
```bash
cd server
npm start
```

You should see:
```
Snake Game Server running on port 3001
```

### Step 3: Start the Frontend

In Terminal 2:
```bash
cd reactapp
npm run dev
```

You should see:
```
Local: http://localhost:5173
```

### Step 4: Play!

1. Open browser to `http://localhost:5173`
2. Click "🎮 Solo Mode" to play alone, or "👥 Multiplayer Mode" to play with friends

---

## 🎮 Playing Solo Mode

- Use **Arrow Keys** or **WASD** to move
- Eat red circles to grow
- Don't hit yourself!
- Click "Play Again" after game over

---

## 👥 Playing Multiplayer Mode

### For Room Creator (Host):
1. Click "Create Room"
2. Share the 6-character code with friends
3. Wait for friends to join (you'll see their names appear)
4. Click "Start Game" when ready

### For Others (Joining):
1. Click "Join Room"
2. Enter the room code from your friend
3. Click "Join Room"
4. Wait for host to start the game
5. Last player alive wins!

---

## ⚙️ Keyboard Controls

| Action | Key |
|--------|-----|
| Move Up | ↑ or W |
| Move Down | ↓ or S |
| Move Left | ← or A |
| Move Right | → or D |
| Back to Menu | Click "← Back" button |

---

## 📊 Game Rules

- **Food**: Each food = +10 points
- **Growth**: Eating food makes you longer
- **Death**: Touching yourself ends the game
- **Walls**: Wrap around to opposite side (no death)
- **Multiplayer**: Last player standing wins!

---

## 🐛 If Something Goes Wrong

**Port Already in Use?**
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or use different port
PORT=3002 npm start
```

**Can't Connect?**
- Make sure both terminals show running without errors
- Check that you're visiting `http://localhost:5173`
- Refresh the browser (Ctrl+R or Cmd+R)

**Room Code Not Working?**
- Check spelling (code is case-insensitive)
- Make sure server is running
- Ask creator to generate new room code

---

## 🎉 Tips for Best Experience

1. **Solo Mode**: Try to beat your high score!
2. **Multiplayer**: 2-4 players works best
3. **Movement**: Use arrow keys for better control
4. **Server**: Keep server running in background
5. **Network**: Play with friends on same network for best experience

---

## 🎨 Customization (Optional)

Want to change colors or speed?

**Edit speed** (`reactapp/src/hooks/useGameLogic.js`):
- Change `200` to higher number = slower
- Change to lower number = faster

**Edit colors** (`reactapp/src/components/GameBoard.css`):
- `.snake-segment`: green color
- `.food`: red color  
- `.game-board`: background color

---

Enjoy! 🐍🎮
