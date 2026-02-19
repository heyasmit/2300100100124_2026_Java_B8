import { useState } from 'react'
import './App.css'
import { Menu } from './components/Menu'
import { SoloGame } from './components/GameBoard'
import { MultiplayerGame } from './components/MultiplayerGame'

function App() {
  const [gameMode, setGameMode] = useState('menu') // 'menu', 'solo', 'multiplayer'

  return (
    <div className="app">
      {gameMode === 'menu' && (
        <Menu 
          onPlaySolo={() => setGameMode('solo')}
          onPlayMultiplayer={() => setGameMode('multiplayer')}
        />
      )}
      {gameMode === 'solo' && (
        <SoloGame onBack={() => setGameMode('menu')} />
      )}
      {gameMode === 'multiplayer' && (
        <MultiplayerGame onBack={() => setGameMode('menu')} />
      )}
    </div>
  )
}

export default App
