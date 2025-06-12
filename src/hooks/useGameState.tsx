import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameState, NetworkNode, HACKNET_TOOLS } from '../types/CoreTypes';

interface GameStateContextType {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  resetGameState: () => void;
  discoverDevice: (device: NetworkNode) => void;
  getVisibleDevices: () => NetworkNode[];
}

const defaultGameState: GameState = {
  currentNode: 'localhost',
  currentDirectory: '/home/user',
  homeDirectory: '/home/user',
  totalRAM: 8,
  usedRAM: 1.2,
  cpuUsage: 15,
  networkActivity: 0,
  traceLevel: 0,
  traceMultiplier: 1.0,
  activeTraces: [],
  scannedNodes: [],
  compromisedNodes: ['localhost'],
  discoveredDevices: [
    {
      id: 'localhost',
      name: 'localhost',
      ip: '127.0.0.1',
      hostname: 'localhost',
      type: 'personal',
      security: 'low',
      os: 'Linux Ubuntu 20.04',
      discovered: true,
      compromised: true,
      connections: [],
      x: 0,
      y: 0,
      openPorts: [22],
      difficulty: 'easy',
      ports: [
        { number: 22, service: 'SSH', open: true, cracked: true, version: '1.0' }
      ],
      files: [],
      services: [],
      links: []
    }
  ],
  connectedNodes: [],
  credits: 500,
  experience: 0,
  level: 1,
  reputation: {},
  unlockedTools: ['SSHcrack.exe'],
  availableTools: [HACKNET_TOOLS['ssh_crack']],
  activeMissions: ['tutorial_01'],
  completedMissions: [],
  claimedRewards: [],
  downloadedFiles: [],
  deletedFiles: [],
  uploadedFiles: [],
  crackedPorts: [],
  executedCommands: [],
  modifiedFiles: [],
  currentFaction: null,
  factionStandings: {},
  eventLog: [],
  systemLogs: [],
  activeDefenses: [],
  defenseHistory: [],
  tutorialStep: 0,
  tutorialCompleted: false,
  hintsEnabled: true
};

const GameStateContext = createContext<GameStateContextType | null>(null);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);

  useEffect(() => {
    const savedState = localStorage.getItem('hacknet-mobile-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        const migratedState: GameState = {
          ...defaultGameState,
          ...parsedState,
          homeDirectory: parsedState.homeDirectory || '/home/user',
          traceMultiplier: parsedState.traceMultiplier || 1.0,
          activeTraces: parsedState.activeTraces || [],
          connectedNodes: parsedState.connectedNodes || [],
          reputation: parsedState.reputation || {},
          availableTools: parsedState.availableTools || [HACKNET_TOOLS['ssh_crack']],
          crackedPorts: parsedState.crackedPorts || [],
          executedCommands: parsedState.executedCommands || [],
          modifiedFiles: parsedState.modifiedFiles || [],
          uploadedFiles: parsedState.uploadedFiles || [],
          currentFaction: parsedState.currentFaction || null,
          factionStandings: parsedState.factionStandings || {},
          eventLog: parsedState.eventLog || [],
          systemLogs: parsedState.systemLogs || [],
          activeDefenses: parsedState.activeDefenses || [],
          defenseHistory: parsedState.defenseHistory || [],
          tutorialStep: parsedState.tutorialStep || 0,
          tutorialCompleted: parsedState.tutorialCompleted || false,
          hintsEnabled: parsedState.hintsEnabled !== undefined ? parsedState.hintsEnabled : true,
          level: parsedState.level || 1,
          discoveredDevices: (parsedState.discoveredDevices || []).map((device: any) => ({
            ...device,
            hostname: device.hostname || device.name || device.ip || 'unknown',
            discovered: device.discovered !== undefined ? device.discovered : true,
            links: device.links || [],
            files: device.files || [],
            services: device.services || [],
            ports: device.ports || [],
            openPorts: device.openPorts || [],
            difficulty: device.difficulty || 'easy'
          }))
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

  const discoverDevice = (device: NetworkNode) => {
    setGameState(prev => {
      const exists = prev.discoveredDevices.find(d => d.ip === device.ip);
      if (exists) return prev;

      return {
        ...prev,
        discoveredDevices: [...prev.discoveredDevices, { 
          ...device, 
          discovered: true, 
          compromised: false,
          links: device.links || [],
          files: device.files || [],
          services: device.services || [],
          ports: device.ports || [],
          openPorts: device.openPorts || [],
          difficulty: device.difficulty || 'easy'
        }]
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
