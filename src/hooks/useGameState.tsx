
import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameState, Device } from '../types/GameTypes';

interface GameStateContextType {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  resetGameState: () => void;
  discoverDevice: (device: Device) => void;
  getVisibleDevices: () => Device[];
}

const defaultGameState: GameState = {
  currentNode: 'localhost',
  currentDirectory: '/home/user',
  totalRAM: 8,
  usedRAM: 1.2,
  cpuUsage: 15,
  networkActivity: 0,
  traceLevel: 0,
  traceMultiplier: 1.0,
  scannedNodes: [],
  compromisedNodes: ['localhost'],
  discoveredDevices: [
    {
      ip: '127.0.0.1',
      hostname: 'localhost',
      type: 'Personal Computer',
      security: 'None',
      os: 'Linux',
      discovered: true,
      compromised: true
    }
  ],
  credits: 500,
  experience: 0,
  level: 1,
  unlockedTools: ['scan', 'probe', 'connect'],
  activeMissions: ['tutorial_01'],
  completedMissions: [],
  claimedRewards: [],
  downloadedFiles: [],
  deletedFiles: [],
  uploadedFiles: [],
  executedCommands: [],
  modifiedFiles: [],
  factions: {},
  eventLog: [],
  lastEventCheck: 0,
  systemLockout: 0
};

const GameStateContext = createContext<GameStateContextType | null>(null);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);

  useEffect(() => {
    const savedState = localStorage.getItem('hacknet-mobile-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        const migratedState = {
          ...defaultGameState,
          ...parsedState,
          lastEventCheck: parsedState.lastEventCheck || 0,
          systemLockout: parsedState.systemLockout || 0
        };
        setGameState(migratedState);
      } catch (error) {
        console.error('Failed to load game state:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('hacknet-mobile-state', JSON.stringify(gameState));
  }, [gameState]);

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const resetGameState = () => {
    setGameState(defaultGameState);
    localStorage.removeItem('hacknet-mobile-state');
  };

  const discoverDevice = (device: Device) => {
    setGameState(prev => {
      const exists = prev.discoveredDevices.find(d => d.ip === device.ip);
      if (exists) return prev;

      return {
        ...prev,
        discoveredDevices: [...prev.discoveredDevices, { ...device, discovered: true, compromised: false }]
      };
    });
  };

  const getVisibleDevices = () => {
    return gameState.discoveredDevices.filter(device => device.discovered);
  };

  return (
    <GameStateContext.Provider value={{ 
      gameState, 
      updateGameState, 
      resetGameState, 
      discoverDevice, 
      getVisibleDevices 
    }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};

export default GameStateProvider;
