
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameState, NetworkNode } from '../types/CoreTypes';

interface GameStateContextType {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  resetGameState: () => void;
}

const GameStateContext = createContext<GameStateContextType | null>(null);

const initialGameState: GameState = {
  currentNode: 'localhost',
  currentDirectory: '/home/user',
  homeDirectory: '/home/user',
  credits: 500,
  experience: 0,
  level: 1,
  traceLevel: 0,
  traceMultiplier: 1,
  totalRAM: 8,
  usedRAM: 2.5,
  cpuUsage: 15,
  networkActivity: 5,
  discoveredDevices: [],
  compromisedNodes: [],
  activeTraces: [],
  activeMissions: [],
  completedMissions: [],
  claimedRewards: [],
  executedCommands: [],
  crackedPorts: [],
  connectedNodes: [],
  scannedNodes: [],
  downloadedFiles: [],
  deletedFiles: [],
  uploadedFiles: [],
  modifiedFiles: [],
  unlockedTools: ['scanner', 'probe'],
  availableTools: [],
  currentFaction: null,
  factionStandings: {},
  reputation: {},
  eventLog: [],
  systemLogs: [],
  activeDefenses: [],
  defenseHistory: [],
  tutorialStep: 0,
  tutorialCompleted: false,
  hintsEnabled: true
};

interface GameStateProviderProps {
  children: ReactNode;
}

const GameStateProvider: React.FC<GameStateProviderProps> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  // Load game state from localStorage on component mount
  useEffect(() => {
    loadGameState();
  }, []);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  const loadGameState = () => {
    try {
      const savedState = localStorage.getItem('hacknet-mobile-state');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        setGameState({ ...initialGameState, ...parsedState });
        console.log('[GameState] Loaded saved state');
      }
    } catch (error) {
      console.error('[GameState] Failed to load state:', error);
    }
  };

  const saveGameState = (state: GameState) => {
    try {
      localStorage.setItem('hacknet-mobile-state', JSON.stringify(state));
    } catch (error) {
      console.error('[GameState] Failed to save state:', error);
    }
  };

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prevState => ({
      ...prevState,
      ...updates,
    }));
  };

  const resetGameState = () => {
    try {
      localStorage.removeItem('hacknet-mobile-state');
      setGameState(initialGameState);
      console.log('[GameState] Game state reset');
    } catch (error) {
      console.error('[GameState] Failed to reset state:', error);
    }
  };

  return (
    <GameStateContext.Provider value={{ gameState, updateGameState, resetGameState }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = (): GameStateContextType => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};

export default GameStateProvider;
