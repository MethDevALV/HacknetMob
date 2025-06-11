
import { networkSystemEnhanced } from '../../systems/NetworkSystemEnhanced';
import { terminalCore } from './TerminalCore';

export class FileCommands {
  static handleLs(args: string[]): string[] {
    const currentNode = terminalCore.getCurrentNode();
    const currentDirectory = terminalCore.getCurrentDirectory();
    
    console.log(`[FileCommands] ls: ${currentNode}:${currentDirectory}`);
    
    // Get files from network system
    const files = networkSystemEnhanced.getFiles(currentNode, currentDirectory);
    
    if (files.length === 0) {
      return [`ls: cannot access '${currentDirectory}': No such file or directory`];
    }

    const output = [];
    
    // Add header for detailed listing
    if (args.includes('-l')) {
      output.push('total ' + files.length);
    }
    
    files.forEach(file => {
      if (args.includes('-l')) {
        // Long format: permissions owner group size date name
        const typeChar = file.type === 'directory' ? 'd' : '-';
        const permissions = typeChar + file.permissions;
        const size = file.size.toString().padStart(8);
        output.push(`${permissions} 1 root root ${size} ${file.modified} ${file.name}`);
      } else {
        // Simple format with color coding
        const name = file.type === 'directory' ? `${file.name}/` : file.name;
        output.push(name);
      }
    });

    return output;
  }

  static handleCd(args: string[]): string[] {
    if (args.length === 0) {
      // cd with no arguments goes to home
      terminalCore.setCurrentDirectory('/home');
      const gameStateUpdater = terminalCore.getGameStateUpdater();
      if (gameStateUpdater) {
        gameStateUpdater({ currentDirectory: '/home' });
      }
      return [];
    }

    const targetPath = args[0];
    const currentNode = terminalCore.getCurrentNode();
    const currentDirectory = terminalCore.getCurrentDirectory();
    
    let newPath: string;
    
    // Handle different path types
    if (targetPath === '..') {
      // Go up one directory
      const parts = currentDirectory.split('/').filter(p => p);
      parts.pop();
      newPath = parts.length > 0 ? '/' + parts.join('/') : '/';
    } else if (targetPath.startsWith('/')) {
      // Absolute path
      newPath = targetPath;
    } else if (targetPath === '.') {
      // Current directory
      newPath = currentDirectory;
    } else {
      // Relative path
      const cleanCurrent = currentDirectory.endsWith('/') ? currentDirectory : currentDirectory + '/';
      newPath = cleanCurrent === '/' ? '/' + targetPath : cleanCurrent + targetPath;
    }
    
    // Normalize path
    newPath = newPath.replace(/\/+/g, '/');
    if (newPath !== '/' && newPath.endsWith('/')) {
      newPath = newPath.slice(0, -1);
    }
    
    console.log(`[FileCommands] cd: attempting to access ${currentNode}:${newPath}`);
    
    // Check if the directory exists
    const files = networkSystemEnhanced.getFiles(currentNode, newPath);
    
    // For root directory, always allow access
    if (newPath === '/' || files.length > 0) {
      terminalCore.setCurrentDirectory(newPath);
      const gameStateUpdater = terminalCore.getGameStateUpdater();
      if (gameStateUpdater) {
        gameStateUpdater({ currentDirectory: newPath });
      }
      return [];
    } else {
      return [`cd: ${targetPath}: No such file or directory`];
    }
  }

  static handleCat(args: string[]): string[] {
    if (args.length === 0) {
      return ['Usage: cat <filename>'];
    }

    const fileName = args[0];
    const currentNode = terminalCore.getCurrentNode();
    const currentDirectory = terminalCore.getCurrentDirectory();
    
    // Get files from current directory
    const files = networkSystemEnhanced.getFiles(currentNode, currentDirectory);
    const file = files.find(f => f.name === fileName && f.type === 'file');
    
    if (!file) {
      return [`cat: ${fileName}: No such file or directory`];
    }

    if (file.encrypted) {
      return [
        `cat: ${fileName}: File is encrypted`,
        'Use decryption tools to view contents'
      ];
    }

    return file.content ? file.content.split('\n') : ['[Binary file]'];
  }

  static handleRm(args: string[]): string[] {
    if (args.length === 0) {
      return ['Usage: rm <filename>'];
    }

    const fileName = args[0];
    const currentNode = terminalCore.getCurrentNode();
    const currentDirectory = terminalCore.getCurrentDirectory();
    
    const success = networkSystemEnhanced.deleteFile(currentNode, currentDirectory, fileName);
    
    if (success) {
      return [`Deleted: ${fileName}`];
    } else {
      return [`rm: cannot remove '${fileName}': No such file or directory`];
    }
  }

  static handleScp(args: string[]): string[] {
    if (args.length < 2) {
      return [
        'Usage: scp <source> <destination>',
        'Example: scp file.txt user@192.168.1.1:/home/user/'
      ];
    }

    const source = args[0];
    const destination = args[1];
    
    // Simple implementation - just report success for now
    return [
      `Copying ${source} to ${destination}...`,
      'Transfer complete.',
      `${source} -> ${destination}`
    ];
  }

  static handleAnalyze(args: string[]): string[] {
    if (args.length === 0) {
      return ['Usage: analyze <filename>'];
    }

    const fileName = args[0];
    const currentNode = terminalCore.getCurrentNode();
    const currentDirectory = terminalCore.getCurrentDirectory();
    
    const files = networkSystemEnhanced.getFiles(currentNode, currentDirectory);
    const file = files.find(f => f.name === fileName);
    
    if (!file) {
      return [`analyze: ${fileName}: File not found`];
    }

    const output = [
      `Analyzing: ${fileName}`,
      `Type: ${file.type}`,
      `Size: ${file.size} bytes`,
      `Permissions: ${file.permissions}`,
      `Modified: ${file.modified}`
    ];

    if (file.encrypted) {
      output.push('Status: ENCRYPTED');
      output.push('Encryption: AES-256');
    }

    if (file.type === 'file' && file.content) {
      output.push(`Content preview: ${file.content.substring(0, 50)}...`);
    }

    return output;
  }
}
