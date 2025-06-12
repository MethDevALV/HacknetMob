
import { networkSystemEnhanced } from '../../systems/NetworkSystemEnhanced';
import { GameState } from '../../types/CoreTypes';

export class FileCommands {
  private gameState: GameState | null = null;
  private updateGameState: ((updates: Partial<GameState>) => void) | null = null;

  setGameState(gameState: GameState, updateGameState: (updates: Partial<GameState>) => void) {
    this.gameState = gameState;
    this.updateGameState = updateGameState;
  }

  listFiles(nodeIp: string, directory: string): string[] {
    const files = networkSystemEnhanced.getFiles(nodeIp, directory);
    
    if (files.length === 0) {
      return ['Directory is empty'];
    }
    
    const result = ['Files in ' + directory + ':'];
    files.forEach(file => {
      const indicator = file.type === 'directory' ? '/' : '';
      const size = file.type === 'file' ? ` (${file.size} bytes)` : '';
      result.push(`${file.permissions} ${file.name}${indicator}${size}`);
    });
    
    return result;
  }

  changeDirectory(targetDir: string): string[] {
    if (!this.gameState || !this.updateGameState) {
      return ['Error: Game state not initialized.'];
    }

    if (!targetDir) {
      return ['Usage: cd <directory>'];
    }

    let newPath: string;
    
    if (targetDir === '/') {
      newPath = '/';
    } else if (targetDir === '..') {
      const currentParts = this.gameState.currentDirectory.split('/').filter(p => p);
      currentParts.pop();
      newPath = currentParts.length > 0 ? '/' + currentParts.join('/') : '/';
    } else if (targetDir.startsWith('/')) {
      newPath = targetDir;
    } else {
      newPath = this.gameState.currentDirectory === '/' 
        ? '/' + targetDir 
        : this.gameState.currentDirectory + '/' + targetDir;
    }

    // Check if directory exists
    const files = networkSystemEnhanced.getFiles(this.gameState.currentNode, newPath === '/' ? '/' : newPath.split('/').slice(0, -1).join('/') || '/');
    const dirExists = newPath === '/' || files.some(f => f.type === 'directory' && f.name === targetDir);

    if (!dirExists && newPath !== '/') {
      return [`cd: ${targetDir}: No such file or directory`];
    }

    this.updateGameState({ currentDirectory: newPath });
    return [`Changed directory to: ${newPath}`];
  }

  readFile(fileName: string): string[] {
    if (!this.gameState) {
      return ['Error: Game state not initialized.'];
    }

    if (!fileName) {
      return ['Usage: cat <filename>'];
    }

    const filePath = this.gameState.currentDirectory === '/' ? '/' + fileName : this.gameState.currentDirectory + '/' + fileName;
    const content = networkSystemEnhanced.getFileContent(this.gameState.currentNode, filePath);

    if (content === null) {
      return [`cat: ${fileName}: No such file or directory`];
    }

    return content.split('\n');
  }
}
