
import { useState, useEffect } from 'react';
import { GameState } from '../types/HackNetTypes';

const INITIAL_GAME_STATE: GameState = {
  // Core system
  currentNode: '127.0.0.1',
  currentDirectory: '/',
  homeDirectory: '/home/user',
  
  // Resources and performance
  totalRAM: 8,
  usedRAM: 2,
  cpuUsage: 10,
  networkActivity: 0,
  
  // Security and traces
  traceLevel: 0,
  traceMultiplier: 1.0,
  activeTraces: [],
  
  // Network and nodes
  scannedNodes: ['127.0.0.1'],
  compromisedNodes: ['127.0.0.1'],
  discoveredDevices: [],
  connectedNodes: [],
  
  // Player progression
  credits: 100,
  experience: 0,
  level: 1,
  reputation: {},
  
  // Tools and files - Start with only basic tools
  unlockedTools: ['SSHcrack.exe'], // Only SSH crack at start
  availableTools: [],
  downloadedFiles: [],
  deletedFiles: [],
  uploadedFiles: [],
  crackedPorts: [],
  
  // Missions and story
  activeMissions: [],
  completedMissions: [],
  claimedRewards: [],
  currentFaction: null,
  factionStandings: {},
  
  // Events and logs
  eventLog: [],
  systemLogs: [],
  
  // Defense systems
  activeDefenses: [],
  defenseHistory: [],
  
  // Tutorial progress
  tutorialStep: 0,
  tutorialCompleted: false,
  hintsEnabled: true,
};

export function useGameStateEnhanced() {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Load from localStorage if available
    const savedState = localStorage.getItem('hacknet-game-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Ensure unlockedTools always includes SSHcrack.exe
        if (!parsed.unlockedTools || !parsed.unlockedTools.includes('SSHcrack.exe')) {
          parsed.unlockedTools = ['SSHcrack.exe'];
        }
        return { ...INITIAL_GAME_STATE, ...parsed };
      } catch (error) {
        console.error('Failed to parse saved game state:', error);
      }
    }
    return INITIAL_GAME_STATE;
  });

  // Save to localStorage whenever game state changes
  useEffect(() => {
    localStorage.setItem('hacknet-game-state', JSON.stringify(gameState));
  }, [gameState]);

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prevState => {
      const newState = { ...prevState, ...updates };
      
      // Ensure unlockedTools always includes SSHcrack.exe
      if (newState.unlockedTools && !newState.unlockedTools.includes('SSHcrack.exe')) {
        newState.unlockedTools = ['SSHcrack.exe', ...newState.unlockedTools];
      }
      
      console.log('[useGameStateEnhanced] State updated:', updates);
      return newState;
    });
  };

  const resetGameState = () => {
    setGameState(INITIAL_GAME_STATE);
    localStorage.removeItem('hacknet-game-state');
  };

  return {
    gameState,
    updateGameState,
    resetGameState
  };
}
