import React from 'react';
import './Menu.css';

export const Menu = ({ onPlaySolo, onPlayMultiplayer }) => {
  return (
    <div className="menu-container">
      <div className="menu-content">
        <div className="menu-header">
          <h1 className="game-title">🐍 SNAKE GAME</h1>
          <p className="game-subtitle">Play Solo or with Friends</p>
        </div>

        <div className="menu-buttons">
          <button 
            className="menu-btn solo-btn"
            onClick={onPlaySolo}
          >
            <span className="btn-icon">🎮</span>
            <span className="btn-text">
              <strong>Solo Mode</strong>
              <em>Play against yourself</em>
            </span>
          </button>

          <button 
            className="menu-btn multiplayer-btn"
            onClick={onPlayMultiplayer}
          >
            <span className="btn-icon">👥</span>
            <span className="btn-text">
              <strong>Multiplayer Mode</strong>
              <em>Play with friends</em>
            </span>
          </button>
        </div>

        <div className="menu-footer">
          <h3>How to Play</h3>
          <ul>
            <li>Use <strong>Arrow Keys</strong> or <strong>WASD</strong> to move</li>
            <li>Eat the red food to grow longer</li>
            <li>Avoid hitting yourself or the walls</li>
            <li>In multiplayer, be the last one standing!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
