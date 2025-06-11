
import { terminalCore } from './terminal/TerminalCore';
import { NetworkCommands } from './terminal/NetworkCommands';
import { FileCommands } from './terminal/FileCommands';
import { SystemCommands } from './terminal/SystemCommands';
import { HackingTools } from './terminal/HackingTools';
import { intrusionDetectionSystem } from '../systems/IntrusionDetectionSystem';
import { HACKNET_TOOLS } from '../types/HackNetTypes';

export class HackNetTerminalEnhanced {
  setGameState(gameState: any, updateGameState: (updates: any) => void) {
    terminalCore.setGameState(gameState, updateGameState);
  }

  async processCommand(input: string): Promise<string[]> {
    const parts = input.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    console.log(`[HackNetTerminalEnhanced] Processing: ${command} with args:`, args);

    // Update traces
    intrusionDetectionSystem.updateTraces();

    switch (command) {
      case 'help':
        return SystemCommands.handleHelp();
      case 'scan':
        return NetworkCommands.handleScan();
      case 'probe':
        return NetworkCommands.handleProbe(args);
      case 'connect':
        return NetworkCommands.handleConnect(args);
      case 'disconnect':
      case 'dc':
        return NetworkCommands.handleDisconnect();
      case 'ls':
        return FileCommands.handleLs(args);
      case 'cd':
        return FileCommands.handleCd(args);
      case 'cat':
        return FileCommands.handleCat(args);
      case 'rm':
        return FileCommands.handleRm(args);
      case 'scp':
        return FileCommands.handleScp(args);
      case 'ps':
        return SystemCommands.handlePs();
      case 'kill':
        return SystemCommands.handleKill(args);
      case 'reboot':
        return SystemCommands.handleReboot();
      case 'analyze':
        return FileCommands.handleAnalyze(args);
      case 'tracekill':
        return SystemCommands.handleTraceKill();
      default:
        if (HackingTools.isValidTool(command)) {
          return HackingTools.executeHackingTool(command, args);
        }
        return [`Command not found: ${command}. Type 'help' for available commands.`];
    }
  }

  getCurrentPrompt(): string {
    return terminalCore.getCurrentPrompt();
  }

  getCommandSuggestions(partial: string): string[] {
    const commands = [
      'help', 'scan', 'probe', 'connect', 'disconnect', 'ls', 'cd', 'cat', 'rm', 'scp',
      'ps', 'kill', 'reboot', 'analyze', 'tracekill'
    ];

    const tools = Object.keys(HACKNET_TOOLS);
    const allCommands = [...commands, ...tools];

    return allCommands.filter(cmd => 
      cmd.toLowerCase().startsWith(partial.toLowerCase())
    ).slice(0, 8);
  }
}

export const hackNetTerminalEnhanced = new HackNetTerminalEnhanced();
