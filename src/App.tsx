
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import GameStateProvider from './hooks/useGameState';
import MobileHackNet from './pages/MobileHackNet';
import './styles/hacknet-effects.css';

function App() {
  return (
    <ThemeProvider>
      <GameStateProvider>
        <Router>
          <div className="App h-screen">
            <Routes>
              <Route path="/" element={<MobileHackNet />} />
            </Routes>
          </div>
        </Router>
      </GameStateProvider>
    </ThemeProvider>
  );
}

export default App;
