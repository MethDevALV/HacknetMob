
import { CommandRouter } from './commands/CommandRouter';

export class CommandProcessor {
  private commandRouter: CommandRouter;
  private gameStateFunctions: any = null;

  constructor() {
    this.commandRouter = new CommandRouter();
  }

  setGameStateFunctions(updateGameState: any, discoverDevice: any, gameState: any) {
    this.gameStateFunctions = { updateGameState, discoverDevice, gameState };
    
    // Use the correct method name that exists in CommandRouter
    this.commandRouter.setGameState(gameState, updateGameState);
    
    // Initialize the command router with current game state
    this.commandRouter.initializeWithGameState(gameState);
  }

  async processCommand(command: string): Promise<string[]> {
    return this.commandRouter.executeCommand(command);
  }

  getCommandSuggestions(input: string): string[] {
    // Use the CommandRouter's suggestion method if available, otherwise fallback
    if (this.commandRouter.getCommandSuggestions) {
      return this.commandRouter.getCommandSuggestions(input);
    }
    
    // Fallback suggestions
    const commands = [
      'help', 'scan', 'probe', 'connect', 'disconnect', 'dc', 'ls', 'cd', 'cat', 'mv', 'rm', 'scp', 
      'upload', 'login', 'reboot', 'replace', 'analyze', 'solve', 'exe', 'shell', 'clear', 'addNote',
      'forkbomb', 'openCDtray', 'closeCDtray', 'SSHcrack.exe', 'FTPBounce.exe', 'WebServerWorm.exe',
      'PortHack.exe', 'Notes.exe', 'Clock.exe', 'pwd', 'whoami'
    ];

    const currentDirectory = this.gameStateFunctions?.gameState?.currentDirectory || '/home/user';
    const currentNode = this.gameStateFunctions?.gameState?.currentNode || 'localhost';
    
    // Get files from current directory for autocompletion
    const files = ['readme.txt', 'profile.txt', 'Documents/', 'Downloads/', 'Desktop/'];
    
    const allSuggestions = [...commands, ...files];
    
    return allSuggestions.filter(item => 
      item.toLowerCase().startsWith(input.toLowerCase())
    ).sort();
  }
}
