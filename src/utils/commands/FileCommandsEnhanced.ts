
import { GameState } from '../../types/CoreTypes';
import { networkSystemEnhanced } from '../../systems/NetworkSystemEnhanced';

export class FileCommandsEnhanced {
  private gameState: GameState | null = null;
  private updateGameState: ((updates: Partial<GameState>) => void) | null = null;

  setGameState(gameState: GameState, updateGameState: (updates: Partial<GameState>) => void) {
    this.gameState = gameState;
    this.updateGameState = updateGameState;
  }

  async handleLs(args: string[]): Promise<string[]> {
    if (!this.gameState) return ['Error: Game state not initialized'];

    const currentNode = this.gameState.currentNode;
    const targetPath = args.length > 0 ? args[0] : this.gameState.currentDirectory;
    
    // Resolve relative paths
    let fullPath = targetPath;
    if (!targetPath.startsWith('/')) {
      fullPath = this.resolvePath(this.gameState.currentDirectory, targetPath);
    }

    const files = networkSystemEnhanced.getFiles(currentNode, fullPath);
    
    if (files.length === 0) {
      return [`ls: cannot access '${targetPath}': No such file or directory`];
    }

    const output = [`Contents of ${fullPath}:`];
    
    // Sort: directories first, then files
    const sortedFiles = files.sort((a, b) => {
      if (a.type === 'directory' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'directory') return 1;
      return a.name.localeCompare(b.name);
    });

    sortedFiles.forEach(file => {
      const typeIndicator = file.type === 'directory' ? 'd' : '-';
      const permissions = file.permissions || 'rw-r--r--';
      const size = file.size.toString().padStart(8);
      const modified = file.modified || 'Unknown';
      const name = file.type === 'directory' ? `${file.name}/` : file.name;
      
      output.push(`${typeIndicator}${permissions} ${size} ${modified} ${name}`);
    });

    return output;
  }

  async handleCd(args: string[]): Promise<string[]> {
    if (!this.gameState || !this.updateGameState) {
      return ['Error: Game state not initialized'];
    }

    if (args.length === 0) {
      // cd with no args goes to home directory
      this.updateGameState({ currentDirectory: '/home/user' });
      return [`Changed directory to /home/user`];
    }

    const targetPath = args[0];
    let newPath: string;

    if (targetPath === '..') {
      // Go up one directory
      const parts = this.gameState.currentDirectory.split('/').filter(p => p);
      parts.pop();
      newPath = parts.length > 0 ? '/' + parts.join('/') : '/';
    } else if (targetPath === '.') {
      // Stay in current directory
      return [`Already in ${this.gameState.currentDirectory}`];
    } else if (targetPath.startsWith('/')) {
      // Absolute path
      newPath = targetPath;
    } else {
      // Relative path
      newPath = this.resolvePath(this.gameState.currentDirectory, targetPath);
    }

    // Check if the target directory exists
    const files = networkSystemEnhanced.getFiles(this.gameState.currentNode, newPath);
    const isValidDir = files.length > 0 || this.isSystemDirectory(newPath);

    if (!isValidDir) {
      return [`cd: no such file or directory: ${targetPath}`];
    }

    this.updateGameState({ currentDirectory: newPath });
    return [`Changed directory to ${newPath}`];
  }

  async handleCat(args: string[]): Promise<string[]> {
    if (!this.gameState) return ['Error: Game state not initialized'];
    
    if (args.length === 0) {
      return ['Usage: cat <filename>'];
    }

    const fileName = args[0];
    const currentNode = this.gameState.currentNode;
    const currentDir = this.gameState.currentDirectory;

    // Find the file
    const files = networkSystemEnhanced.getFiles(currentNode, currentDir);
    const file = files.find(f => f.name === fileName);

    if (!file) {
      return [`cat: ${fileName}: No such file or directory`];
    }

    if (file.type === 'directory') {
      return [`cat: ${fileName}: Is a directory`];
    }

    // Log file access for missions
    if (this.updateGameState) {
      const accessedFiles = this.gameState.downloadedFiles || [];
      this.updateGameState({
        downloadedFiles: [...accessedFiles, fileName]
      });
    }

    if (file.encrypted) {
      return [
        `File: ${fileName}`,
        '==================',
        'ERROR: File is encrypted',
        'Use decryption tools to access contents'
      ];
    }

    const content = file.content || 'Empty file';
    const lines = content.split('\n');
    
    return [
      `File: ${fileName}`,
      '==================',
      ...lines
    ];
  }

  async handleRm(args: string[]): Promise<string[]> {
    if (!this.gameState || !this.updateGameState) {
      return ['Error: Game state not initialized'];
    }

    if (args.length === 0) {
      return ['Usage: rm <filename>'];
    }

    const fileName = args[0];
    const currentNode = this.gameState.currentNode;
    const currentDir = this.gameState.currentDirectory;

    const success = networkSystemEnhanced.deleteFile(currentNode, currentDir, fileName);

    if (success) {
      // Log deletion for missions
      const deletedFiles = this.gameState.deletedFiles || [];
      const fileEntry = `${currentNode}:${currentDir}/${fileName}`;
      
      this.updateGameState({
        deletedFiles: [...deletedFiles, fileEntry]
      });

      return [`File '${fileName}' deleted successfully`];
    } else {
      return [`rm: cannot remove '${fileName}': No such file or directory`];
    }
  }

  async handlePwd(): Promise<string[]> {
    if (!this.gameState) return ['Error: Game state not initialized'];
    return [this.gameState.currentDirectory];
  }

  async handleWhoami(): Promise<string[]> {
    if (!this.gameState) return ['Error: Game state not initialized'];
    
    const currentNode = this.gameState.currentNode;
    if (currentNode === '127.0.0.1' || currentNode === 'localhost') {
      return ['user'];
    } else {
      const device = networkSystemEnhanced.getNodeByIp(currentNode);
      if (device && device.compromised) {
        return ['root'];
      } else {
        return ['Error: Not authenticated'];
      }
    }
  }

  private resolvePath(currentPath: string, relativePath: string): string {
    const parts = currentPath.split('/').filter(p => p);
    const relativeParts = relativePath.split('/').filter(p => p);

    for (const part of relativeParts) {
      if (part === '..') {
        parts.pop();
      } else if (part !== '.') {
        parts.push(part);
      }
    }

    return parts.length > 0 ? '/' + parts.join('/') : '/';
  }

  private isSystemDirectory(path: string): boolean {
    const systemDirs = [
      '/', '/bin', '/etc', '/home', '/var', '/tmp', '/usr', '/opt',
      '/home/user', '/home/admin', '/var/log', '/etc/ssh'
    ];
    return systemDirs.includes(path);
  }
}
