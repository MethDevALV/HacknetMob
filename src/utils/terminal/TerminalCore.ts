
import { GameState, NetworkNode } from '../../types/CoreTypes';
import { hackNetEngine } from '../../core/HackNetEngine';

export class TerminalCore {
  private static instance: TerminalCore;
  private gameState: GameState | null = null;
  private updateGameState: ((updates: Partial<GameState>) => void) | null = null;
  private discoverDeviceCallback: ((device: NetworkNode) => void) | null = null;

  private constructor() {}

  static getInstance(): TerminalCore {
    if (!TerminalCore.instance) {
      TerminalCore.instance = new TerminalCore();
    }
    return TerminalCore.instance;
  }

  setGameStateFunctions(
    updateGameState: (updates: Partial<GameState>) => void,
    discoverDevice: (device: NetworkNode) => void,
    gameState: GameState
  ) {
    this.updateGameState = updateGameState;
    this.discoverDeviceCallback = discoverDevice;
    this.gameState = gameState;
    
    // Initialize HackNet engine with current game state
    hackNetEngine.initialize(gameState, updateGameState);
  }

  getGameState(): GameState | null {
    return this.gameState;
  }

  getGameStateUpdater(): ((updates: Partial<GameState>) => void) | null {
    return this.updateGameState;
  }

  getCurrentNode(): string {
    return this.gameState?.currentNode || 'localhost';
  }

  getCurrentDirectory(): string {
    return this.gameState?.currentDirectory || '/home/user';
  }

  getDiscoveredDevices(): NetworkNode[] {
    return this.gameState?.discoveredDevices || [];
  }

  discoverDevice(device: NetworkNode) {
    if (this.discoverDeviceCallback) {
      this.discoverDeviceCallback(device);
    }
  }

  setCurrentNode(nodeIp: string) {
    if (this.updateGameState) {
      this.updateGameState({ currentNode: nodeIp });
    }
  }

  setCurrentDirectory(directory: string) {
    if (this.updateGameState) {
      this.updateGameState({ currentDirectory: directory });
    }
  }

  updateScannedNodes(nodes: string[]) {
    if (this.updateGameState) {
      this.updateGameState({ scannedNodes: nodes });
    }
  }

  async processCommand(commandString: string): Promise<string[]> {
    if (!this.gameState || !this.updateGameState) {
      return ['Error: Terminal not initialized.'];
    }

    // Use the unified HackNet engine to process all commands
    return await hackNetEngine.executeCommand(commandString);
  }
}

export const terminalCore = TerminalCore.getInstance();
