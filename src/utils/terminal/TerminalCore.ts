
import { networkSystemEnhanced } from '../../systems/NetworkSystemEnhanced';
import { intrusionDetectionSystem } from '../../systems/IntrusionDetectionSystem';
import { gameCore } from '../../core/GameCore';

export class TerminalCore {
  private currentNode: string = '127.0.0.1';
  private currentDirectory: string = '/home/user';
  private gameStateUpdater: ((updates: any) => void) | null = null;
  private gameState: any = null;

  setGameState(gameState: any, updateGameState: (updates: any) => void) {
    this.gameState = gameState;
    this.gameStateUpdater = updateGameState;
    
    // Configurar GameCore con el estado del juego
    gameCore.setGameState(gameState, updateGameState);
    
    // Initialize with localhost if no current node set
    this.currentNode = gameState.currentNode || '127.0.0.1';
    this.currentDirectory = gameState.currentDirectory || '/home/user';
    
    // Set up intrusion detection system
    intrusionDetectionSystem.setGameStateUpdater(updateGameState);
    
    // Set up network system
    networkSystemEnhanced.setGameStateUpdater(updateGameState);
    
    console.log(`[TerminalCore] Initialized: ${this.currentNode}:${this.currentDirectory}`);
  }

  getCurrentNode(): string {
    return this.currentNode;
  }

  getCurrentDirectory(): string {
    return this.currentDirectory;
  }

  setCurrentNode(node: string) {
    this.currentNode = node;
    if (this.gameStateUpdater) {
      this.gameStateUpdater({ currentNode: node });
    }
    console.log(`[TerminalCore] Current node set to: ${node}`);
  }

  setCurrentDirectory(directory: string) {
    this.currentDirectory = directory;
    if (this.gameStateUpdater) {
      this.gameStateUpdater({ currentDirectory: directory });
    }
    console.log(`[TerminalCore] Current directory set to: ${directory}`);
  }

  getGameState(): any {
    return this.gameState;
  }

  getGameStateUpdater(): ((updates: any) => void) | null {
    return this.gameStateUpdater;
  }

  getCurrentPrompt(): string {
    const node = networkSystemEnhanced.getNode(this.currentNode);
    const hostname = node ? node.hostname : this.currentNode;
    return `${hostname}:${this.currentDirectory}$`;
  }
}

export const terminalCore = new TerminalCore();
