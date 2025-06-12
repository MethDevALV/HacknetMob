
import { terminalCore } from '../terminal/TerminalCore';
import { SystemCommandsEnhanced } from '../terminal/SystemCommandsEnhanced';
import { FileCommandsEnhanced } from '../terminal/FileCommandsEnhanced';
import { NetworkCommandsEnhanced } from '../terminal/NetworkCommandsEnhanced';

export class CommandRouter {
  static async processCommand(command: string): Promise<string[]> {
    const [cmd, ...args] = command.trim().split(' ');
    const commandName = cmd.toLowerCase();

    try {
      switch (commandName) {
        // Help command
        case 'help':
          return [
            'Available commands:',
            '',
            '=== SYSTEM ===',
            'ps               - List running processes',
            'kill <pid>       - Kill a process',
            'clear            - Clear terminal',
            'disconnect       - Disconnect from current node',
            '',
            '=== NETWORK ===',
            'scan             - Scan for available devices',
            'probe <ip>       - Get detailed device information',
            'connect <ip>     - Connect to a device',
            '',
            '=== FILES ===',
            'ls [path]        - List directory contents',
            'cd <path>        - Change directory',
            'cat <file>       - View file contents',
            'rm <file>        - Delete file',
            'cp <src> <dest>  - Copy file',
            'mv <src> <dest>  - Move file',
            '',
            '=== HACKING ===',
            'porthack <ip>    - Crack open SSH port (22)',
            'crack <ip>       - Attempt to crack device security',
            'upload <file>    - Upload file to remote system',
            '',
            'Type "help <command>" for detailed information about a specific command.'
          ];

        // System commands
        case 'ps':
          return SystemCommandsEnhanced.handlePs();
        
        case 'kill':
          if (args.length === 0) return ['Usage: kill <pid>'];
          return SystemCommandsEnhanced.handleKill(args);
        
        case 'clear':
          return [];
        
        case 'disconnect':
          return await NetworkCommandsEnhanced.handleDisconnect();

        // Network commands
        case 'scan':
          return await NetworkCommandsEnhanced.handleScan();
        
        case 'probe':
          if (args.length === 0) return ['Usage: probe <ip_address>'];
          return await NetworkCommandsEnhanced.handleProbe(args);
        
        case 'connect':
          if (args.length === 0) return ['Usage: connect <ip_address>'];
          return await NetworkCommandsEnhanced.handleConnect(args);

        // File commands
        case 'ls':
          return await FileCommandsEnhanced.handleLs(args);
        
        case 'cd':
          if (args.length === 0) return ['Usage: cd <directory>'];
          return await FileCommandsEnhanced.handleCd(args);
        
        case 'cat':
          if (args.length === 0) return ['Usage: cat <filename>'];
          return await FileCommandsEnhanced.handleCat(args);
        
        case 'rm':
          if (args.length === 0) return ['Usage: rm <filename>'];
          return await FileCommandsEnhanced.handleRm(args);
        
        case 'cp':
          if (args.length < 2) return ['Usage: cp <source> <destination>'];
          return [`Copying ${args[0]} to ${args[1]}...`, 'File copied successfully!'];
        
        case 'mv':
          if (args.length < 2) return ['Usage: mv <source> <destination>'];
          return [`Moving ${args[0]} to ${args[1]}...`, 'File moved successfully!'];

        // Hacking commands (basic implementation)
        case 'porthack':
          if (args.length === 0) return ['Usage: porthack <ip_address>'];
          return [`Attempting to crack SSH port on ${args[0]}...`, 'SSH port cracked successfully!'];
        
        case 'crack':
          if (args.length === 0) return ['Usage: crack <ip_address>'];
          return [`Attempting to crack security on ${args[0]}...`, 'Security bypassed!'];
        
        case 'upload':
          if (args.length === 0) return ['Usage: upload <filename>'];
          return [`Uploading ${args[0]}...`, 'File uploaded successfully!'];

        // Unknown command
        default:
          // Check if it's an executable file
          const gameState = terminalCore.getGameState();
          if (gameState) {
            const executedCommands = gameState.executedCommands || [];
            const updateGameState = terminalCore.getGameStateUpdater();
            if (updateGameState) {
              updateGameState({
                executedCommands: [...executedCommands, command]
              });
            }
          }
          
          return [`Command not found: ${commandName}`, 'Type "help" for available commands'];
      }
    } catch (error) {
      console.error('Command execution error:', error);
      return [`Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}`];
    }
  }
}
