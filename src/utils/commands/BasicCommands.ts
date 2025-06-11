
import { FileSystemManager } from '../FileSystemManager';

export class BasicCommands {
  static handleHelp(args: string[]): string[] {
    return [
      'Available commands:',
      '',
      'Network Commands:',
      '  scan                 - Discover devices on the network',
      '  probe <ip>          - Get detailed info about a device',
      '  connect <ip>        - Connect to a remote device',
      '  disconnect          - Disconnect from current device',
      '',
      'File System Commands:',
      '  ls [directory]      - List files in current or specified directory',
      '  cd <directory>      - Change to specified directory',
      '  cat <filename>      - Display file contents',
      '  pwd                 - Show current directory',
      '  rm <filename>       - Delete a file',
      '',
      'System Commands:',
      '  whoami              - Show current user',
      '  ps                  - Show running processes',
      '  netstat             - Show network connections',
      '',
      'Hacking Tools:',
      '  sshcrack <ip>       - Crack SSH passwords',
      '  ftpbounce <ip>      - Exploit FTP bounce vulnerability',
      '  webserverworm <ip>  - Exploit web server vulnerabilities',
      '  porthack <ip>       - Exploit open ports',
      '',
      'Defense Commands:',
      '  firewall <action>   - Manage firewall settings',
      '  isolate <ip>        - Isolate suspicious connections',
      '  trace_block         - Block incoming traces',
      '  counter_hack <ip>   - Launch counter-attack',
      '',
      'Other Commands:',
      '  help                - Show this help message',
      '  clear               - Clear the terminal screen'
    ];
  }

  static handleLs(args: string[], currentDirectory: string = '/home/user', currentNode: string = 'localhost'): string[] {
    const fsManager = FileSystemManager.getInstance();
    
    // Determine which directory to list
    let targetDir = currentDirectory;
    if (args.length > 0) {
      const arg = args[0];
      if (arg.startsWith('/')) {
        targetDir = arg; // Absolute path
      } else {
        targetDir = currentDirectory === '/' ? `/${arg}` : `${currentDirectory}/${arg}`;
      }
    }

    console.log(`[BasicCommands] Listing directory: ${targetDir} on node: ${currentNode}`);
    const files = fsManager.getFileSystem(currentNode, targetDir);
    
    if (files.length === 0) {
      // Check if directory exists by trying parent directory
      const parentDir = targetDir.split('/').slice(0, -1).join('/') || '/';
      const parentFiles = fsManager.getFileSystem(currentNode, parentDir);
      const dirName = targetDir.split('/').pop();
      const dirExists = parentFiles.some(f => f.name === dirName && f.type === 'directory');
      
      if (!dirExists && targetDir !== currentDirectory) {
        return [`ls: cannot access '${targetDir}': No such file or directory`];
      }
      return ['Directory is empty'];
    }

    const result = [`Contents of ${targetDir}:`, ''];
    
    // Sort: directories first, then files
    const sortedFiles = files.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    sortedFiles.forEach(file => {
      const typeIndicator = file.type === 'directory' ? 'd' : '-';
      const permissions = file.permissions || '-rw-r--r--';
      const size = file.size ? file.size.toString().padStart(8) : '     dir';
      const modified = file.modified || 'unknown';
      
      result.push(`${typeIndicator}${permissions.slice(1)} ${size} ${modified} ${file.name}`);
    });

    return result;
  }

  static handleCat(args: string[], currentDirectory: string = '/home/user', currentNode: string = 'localhost'): string[] {
    if (args.length === 0) {
      return ['Usage: cat <filename>', 'Display the contents of a file'];
    }

    const fileName = args[0];
    const fsManager = FileSystemManager.getInstance();
    
    // Handle absolute vs relative paths
    let filePath = currentDirectory;
    let targetFileName = fileName;
    
    if (fileName.includes('/')) {
      const pathParts = fileName.split('/');
      targetFileName = pathParts.pop() || '';
      const dirPath = pathParts.join('/');
      filePath = dirPath.startsWith('/') ? dirPath : `${currentDirectory}/${dirPath}`;
    }

    console.log(`[BasicCommands] Reading file: ${targetFileName} from ${filePath} on node: ${currentNode}`);
    const file = fsManager.getFile(currentNode, filePath, targetFileName);
    
    if (!file) {
      return [`cat: ${fileName}: No such file or directory`];
    }

    if (file.type === 'directory') {
      return [`cat: ${fileName}: Is a directory`];
    }

    if (file.content) {
      return [
        `=== Contents of ${fileName} ===`,
        '',
        ...file.content.split('\n'),
        '',
        `=== End of ${fileName} ===`
      ];
    }

    return [`File ${fileName} appears to be empty or binary.`];
  }

  static handleCd(args: string[], currentDirectory: string = '/home/user', currentNode: string = 'localhost'): string[] {
    const fsManager = FileSystemManager.getInstance();
    
    if (args.length === 0) {
      return [`Current directory: ${currentDirectory}`];
    }

    const targetDir = args[0];
    let newPath: string;

    if (targetDir === '..') {
      // Go up one directory
      const pathParts = currentDirectory.split('/').filter(p => p);
      pathParts.pop();
      newPath = pathParts.length > 0 ? '/' + pathParts.join('/') : '/';
    } else if (targetDir.startsWith('/')) {
      // Absolute path
      newPath = targetDir;
    } else {
      // Relative path
      newPath = currentDirectory === '/' ? `/${targetDir}` : `${currentDirectory}/${targetDir}`;
    }

    console.log(`[BasicCommands] Changing to directory: ${newPath} on node: ${currentNode}`);
    
    // Check if the directory exists
    const files = fsManager.getFileSystem(currentNode, newPath);
    
    // If files array is empty, check if the directory exists in parent
    if (files.length === 0 && newPath !== '/') {
      const parentDir = newPath.split('/').slice(0, -1).join('/') || '/';
      const parentFiles = fsManager.getFileSystem(currentNode, parentDir);
      const dirName = newPath.split('/').pop();
      const dirExists = parentFiles.some(f => f.name === dirName && f.type === 'directory');
      
      if (!dirExists) {
        return [`cd: ${targetDir}: No such file or directory`];
      }
    }

    return [`Changed to directory: ${newPath}`];
  }

  static handlePwd(currentDirectory: string = '/home/user'): string[] {
    return [currentDirectory];
  }

  static handleWhoami(): string[] {
    return ['user'];
  }

  static handleNetstat(): string[] {
    return [
      'Active Internet connections:',
      'Proto Recv-Q Send-Q Local Address          Foreign Address        State',
      'tcp        0      0 localhost:22           *:*                    LISTEN',
      'tcp        0      0 localhost:80           *:*                    LISTEN',
      'tcp        0      0 localhost:443          *:*                    LISTEN',
      'udp        0      0 localhost:53           *:*                    LISTEN'
    ];
  }
}
