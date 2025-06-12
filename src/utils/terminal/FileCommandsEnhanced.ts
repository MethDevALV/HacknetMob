import { networkSystemEnhanced } from '../../systems/NetworkSystemEnhanced';
import { terminalCore } from './TerminalCore';
import { systemResourcesEnhanced } from '../SystemResourcesEnhanced';

export class FileCommandsEnhanced {
  static async handleLs(args: string[]): Promise<string[]> {
    const gameState = terminalCore.getGameState();
    if (!gameState) return ['Error: No game state available'];

    const currentPath = args[0] || gameState.currentDirectory;
    const currentNode = gameState.currentNode;
    
    const files = networkSystemEnhanced.getFiles(currentNode, currentPath);
    
    if (files.length === 0) {
      return ['Directory is empty'];
    }

    const output: string[] = [];
    files.forEach(file => {
      const type = file.type === 'directory' ? 'd' : '-';
      const permissions = file.permissions || 'rw-r--r--';
      const size = file.size.toString().padStart(8);
      const name = file.type === 'directory' ? `${file.name}/` : file.name;
      const modified = file.modified || 'Jan 01 12:00';
      
      output.push(`${type}${permissions} ${size} ${modified} ${name}`);
    });

    return output;
  }

  static async handleCd(args: string[]): Promise<string[]> {
    if (args.length === 0) return ['Usage: cd <directory>'];
    
    const gameState = terminalCore.getGameState();
    const updateGameState = terminalCore.getGameStateUpdater();
    
    if (!gameState || !updateGameState) {
      return ['Error: No game state available'];
    }

    const directory = args[0];
    let newPath: string;
    
    if (directory === '/') {
      newPath = '/';
    } else if (directory === '..') {
      const currentParts = gameState.currentDirectory.split('/').filter(p => p);
      if (currentParts.length > 0) {
        currentParts.pop();
        newPath = currentParts.length > 0 ? '/' + currentParts.join('/') : '/';
      } else {
        newPath = '/';
      }
    } else if (directory.startsWith('/')) {
      newPath = directory;
    } else {
      newPath = gameState.currentDirectory === '/' 
        ? '/' + directory 
        : gameState.currentDirectory + '/' + directory;
    }

    // Check if directory exists
    const files = networkSystemEnhanced.getFiles(gameState.currentNode, newPath);
    const directoryExists = files.length > 0 || newPath === '/' || newPath === '/home' || newPath === '/home/user' || newPath === '/bin';

    if (!directoryExists) {
      return [`cd: ${directory}: No such file or directory`];
    }

    updateGameState({ currentDirectory: newPath });
    return [`Changed directory to: ${newPath}`];
  }

  static async handleCat(args: string[]): Promise<string[]> {
    if (args.length === 0) return ['Usage: cat <filename>'];
    
    const gameState = terminalCore.getGameState();
    if (!gameState) return ['Error: No game state available'];

    const filename = args[0];
    const files = networkSystemEnhanced.getFiles(gameState.currentNode, gameState.currentDirectory);
    const file = files.find(f => f.name === filename && f.type === 'file');

    if (!file) {
      return [`cat: ${filename}: No such file or directory`];
    }

    if (file.encrypted) {
      return [`cat: ${filename}: File is encrypted`];
    }

    return file.content ? file.content.split('\n') : ['[Binary file]'];
  }

  static async handleRm(args: string[]): Promise<string[]> {
    if (args.length === 0) return ['Usage: rm <filename>'];
    
    const gameState = terminalCore.getGameState();
    const updateGameState = terminalCore.getGameStateUpdater();
    
    if (!gameState || !updateGameState) return ['Error: No game state available'];

    const filename = args[0];
    const success = networkSystemEnhanced.deleteFile(
      gameState.currentNode, 
      gameState.currentDirectory, 
      filename
    );

    if (success) {
      // Add to deleted files for mission tracking
      const deletedFiles = gameState.deletedFiles || [];
      const fileEntry = `${gameState.currentNode}:${gameState.currentDirectory}/${filename}`;
      
      updateGameState({
        deletedFiles: [...deletedFiles, fileEntry]
      });

      return [`Removed: ${filename}`];
    } else {
      return [`rm: ${filename}: No such file or directory`];
    }
  }

  static async handleScp(args: string[]): Promise<string[]> {
    if (args.length < 2) {
      return [
        'Usage: scp <source> <destination>',
        'Examples:',
        '  scp filename.txt localhost:/home/user/Downloads/',
        '  scp /remote/path/tool.exe localhost:/bin/',
        '  scp * localhost:/home/user/Downloads/ (download all files)'
      ];
    }

    const gameState = terminalCore.getGameState();
    const updateGameState = terminalCore.getGameStateUpdater();
    
    if (!gameState || !updateGameState) {
      return ['Error: No game state available'];
    }

    const source = args[0];
    const destination = args[1];

    // Parse destination
    const destParts = destination.split(':');
    if (destParts.length !== 2) {
      return ['Error: Invalid destination format. Use: hostname:/path/'];
    }

    const [destHost, destPath] = destParts;
    
    // Normalize localhost references
    const normalizedDestHost = (destHost === 'localhost' || destHost === '127.0.0.1') ? '127.0.0.1' : destHost;

    try {
      // Start download process
      const processId = systemResourcesEnhanced.startProcess({
        name: `SCP Download ${source}`,
        cpuUsage: 10,
        ramUsage: 128,
        networkUsage: 50,
        duration: 3000, // 3 seconds
        onComplete: () => {
          this.completeSCPDownload(source, normalizedDestHost, destPath, gameState, updateGameState);
        }
      });

      return [
        `Starting SCP transfer...`,
        `Source: ${gameState.currentNode}:${gameState.currentDirectory}/${source}`,
        `Destination: ${destHost}:${destPath}`,
        `Transfer ID: ${processId}`,
        '',
        'Transfer will complete automatically...'
      ];

    } catch (error) {
      return [
        'Error: Insufficient system resources for transfer',
        'Wait for other processes to complete and try again'
      ];
    }
  }

  private static completeSCPDownload(
    source: string, 
    destHost: string, 
    destPath: string, 
    gameState: any, 
    updateGameState: any
  ) {
    const sourceNode = gameState.currentNode;
    const sourceDir = gameState.currentDirectory;
    
    // Get source files
    const files = networkSystemEnhanced.getFiles(sourceNode, sourceDir);
    
    if (source === '*') {
      // Download all files
      const downloadedFiles = files
        .filter(f => f.type === 'file')
        .map(f => {
          const targetPath = this.getAutoTargetPath(f.name, destPath);
          this.addFileToDestination(destHost, targetPath, f.name, f);
          return f.name;
        });

      if (downloadedFiles.length > 0) {
        updateGameState({
          downloadedFiles: [...(gameState.downloadedFiles || []), ...downloadedFiles]
        });
        
        console.log(`[SCP] Downloaded ${downloadedFiles.length} files to ${destHost}:${destPath}`);
      }
    } else {
      // Download specific file
      const file = files.find(f => f.name === source && f.type === 'file');
      
      if (file) {
        const targetPath = this.getAutoTargetPath(file.name, destPath);
        this.addFileToDestination(destHost, targetPath, file.name, file);
        
        updateGameState({
          downloadedFiles: [...(gameState.downloadedFiles || []), file.name]
        });
        
        console.log(`[SCP] Downloaded ${file.name} to ${destHost}:${targetPath}`);
      }
    }
  }

  private static getAutoTargetPath(filename: string, basePath: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    // Auto-categorize files
    if (extension === 'exe') {
      return '/bin';
    } else if (['txt', 'log', 'dat', 'cfg'].includes(extension || '')) {
      return '/home/user/Downloads';
    } else if (['zip', 'tar', 'gz'].includes(extension || '')) {
      return '/home/user/Downloads';
    }
    
    return basePath || '/home/user/Downloads';
  }

  private static addFileToDestination(destHost: string, destPath: string, filename: string, fileData: any) {
    // Add file to destination using networkSystemEnhanced
    networkSystemEnhanced.addFile(destHost, destPath, filename, {
      content: fileData.content,
      size: fileData.size,
      type: fileData.type,
      permissions: fileData.permissions,
      encrypted: fileData.encrypted
    });
  }

  static async handleAnalyze(args: string[]): Promise<string[]> {
    if (args.length === 0) return ['Usage: analyze <filename>'];
    
    const filename = args[0];
    
    try {
      const processId = systemResourcesEnhanced.startProcess({
        name: `Analyze ${filename}`,
        cpuUsage: 15,
        ramUsage: 256,
        duration: 2000
      });

      return [
        `Analyzing ${filename}...`,
        `Process ID: ${processId}`,
        'Analysis will complete automatically'
      ];
    } catch (error) {
      return ['Error: Insufficient system resources'];
    }
  }
}

export const fileCommandsEnhanced = new FileCommandsEnhanced();
