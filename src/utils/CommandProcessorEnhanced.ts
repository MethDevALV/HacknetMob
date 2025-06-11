
// Enhanced command processor that integrates all systems
import { hackNetTerminalEnhanced } from './HackNetTerminalEnhanced';
import { HackingTools } from './terminal/HackingTools';

export class CommandProcessorEnhanced {
  private gameStateUpdater: ((updates: any) => void) | null = null;
  private deviceDiscoverer: ((device: any) => void) | null = null;
  private gameState: any = null;

  constructor() {
    console.log('[CommandProcessorEnhanced] Initialized');
  }

  setGameStateFunctions(
    updateGameState: (updates: any) => void,
    discoverDevice: (device: any) => void,
    gameState: any
  ) {
    this.gameStateUpdater = updateGameState;
    this.deviceDiscoverer = discoverDevice;
    this.gameState = gameState;
    
    // Initialize the terminal with game state
    hackNetTerminalEnhanced.setGameState(gameState, updateGameState);
    
    console.log('[CommandProcessorEnhanced] Game state functions set');
  }

  async processCommand(input: string): Promise<string[]> {
    if (!input.trim()) {
      return [''];
    }

    console.log('[CommandProcessorEnhanced] Processing command:', input);
    const parts = input.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    try {
      // Primero verificar herramientas de hacking
      if (HackingTools.isValidTool(command)) {
        console.log('[CommandProcessorEnhanced] Executing hacking tool:', command);
        return HackingTools.executeHackingTool(command, args);
      }

      // Luego usar el terminal mejorado para otros comandos
      const result = await hackNetTerminalEnhanced.processCommand(input);
      console.log('[CommandProcessorEnhanced] Command result:', result);
      return result;
    } catch (error) {
      console.error('[CommandProcessorEnhanced] Command execution error:', error);
      return [`Error executing command: ${error}`];
    }
  }

  getCommandSuggestions(partial: string): string[] {
    const hackingTools = ['sshcrack', 'ftpbounce'];
    const basicCommands = hackNetTerminalEnhanced.getCommandSuggestions(partial);
    
    const allCommands = [...basicCommands, ...hackingTools];
    
    return allCommands.filter(cmd => 
      cmd.toLowerCase().startsWith(partial.toLowerCase())
    ).slice(0, 8);
  }
}

export const commandProcessorEnhanced = new CommandProcessorEnhanced();
