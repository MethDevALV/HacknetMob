
// Complete HackNet terminal command processor
import { hackingToolsSystem } from '../systems/HackingToolsSystem';
import { counterAttackSystem } from '../systems/CounterAttackSystem';
import { networkSystem } from '../systems/NetworkSystem';
import { HACKNET_TOOLS } from '../types/HackNetTypes';

export class HackNetTerminal {
  private currentNode: string = '127.0.0.1';
  private currentDirectory: string = '/';
  private gameStateUpdater: ((updates: any) => void) | null = null;
  private gameState: any = null;

  setGameState(gameState: any, updateGameState: (updates: any) => void) {
    this.gameState = gameState;
    this.gameStateUpdater = updateGameState;
    this.currentNode = gameState.currentNode || '127.0.0.1';
    this.currentDirectory = gameState.currentDirectory || '/';
  }

  async processCommand(input: string): Promise<string[]> {
    const parts = input.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    console.log(`[HackNetTerminal] Processing: ${command} with args:`, args);

    switch (command) {
      case 'help':
        return this.handleHelp();
      case 'scan':
        return this.handleScan();
      case 'probe':
        return this.handleProbe(args);
      case 'connect':
        return this.handleConnect(args);
      case 'disconnect':
      case 'dc':
        return this.handleDisconnect();
      case 'ls':
        return this.handleLs(args);
      case 'cd':
        return this.handleCd(args);
      case 'cat':
        return this.handleCat(args);
      case 'rm':
        return this.handleRm(args);
      case 'scp':
        return this.handleScp(args);
      case 'ps':
        return this.handlePs();
      case 'kill':
        return this.handleKill(args);
      case 'reboot':
        return this.handleReboot();
      case 'porthack':
        return this.handlePortHack(args);
      case 'analyze':
        return this.handleAnalyze(args);
      case 'firewall':
        return this.handleFirewall();
      case 'proxy':
        return this.handleProxy();
      case 'tracekill':
        return this.handleTraceKill();
      default:
        // Check if it's a tool execution
        if (HACKNET_TOOLS[command] || HACKNET_TOOLS[command + '.exe']) {
          return this.handleToolExecution(command, args);
        }
        return [`Command not found: ${command}. Type 'help' for available commands.`];
    }
  }

  private handleHelp(): string[] {
    return [
      '=== HackNet Terminal Commands ===',
      '',
      'Network Commands:',
      '  scan              - Scan for connected devices',
      '  probe <ip>        - Probe target for open ports',
      '  connect <ip>      - Connect to target system',
      '  disconnect        - Disconnect from current system',
      '',
      'File System:',
      '  ls [path]         - List directory contents',
      '  cd <path>         - Change directory',
      '  cat <file>        - Display file contents',
      '  rm <file>         - Delete file',
      '  scp <file>        - Download file to home system',
      '',
      'Process Management:',
      '  ps                - List running processes',
      '  kill <pid>        - Terminate process',
      '  reboot            - Reboot current system',
      '',
      'Hacking Tools:',
      '  porthack <ip>     - Basic port cracking',
      '  SSHcrack.exe <ip> - Crack SSH (port 22)',
      '  FTPBounce.exe <ip>- Crack FTP (port 21)',
      '  analyze <file>    - Analyze file structure',
      '',
      'Defense:',
      '  firewall          - Activate firewall defense',
      '  proxy             - Activate proxy defense',
      '  tracekill         - Kill active traces',
      '',
      'Type command name for detailed usage.'
    ];
  }

  private handleScan(): string[] {
    const connectedNodes = networkSystem.scanNetwork(this.currentNode);
    
    if (connectedNodes.length === 0) {
      return ['No devices found on network.'];
    }

    const output = ['Scanning network...', ''];
    connectedNodes.forEach(ip => {
      const node = networkSystem.getNode(ip);
      if (node) {
        output.push(`${ip} - ${node.hostname} (${node.type}) - Security: ${node.security}`);
      }
    });

    // Update game state
    if (this.gameStateUpdater) {
      this.gameStateUpdater({
        scannedNodes: [...(this.gameState.scannedNodes || []), ...connectedNodes]
      });
    }

    return output;
  }

  private handleProbe(args: string[]): string[] {
    if (args.length === 0) {
      return ['Usage: probe <target_ip>'];
    }

    const targetIp = args[0];
    const node = networkSystem.getNode(targetIp);
    
    if (!node || !node.discovered) {
      return [`No device found at ${targetIp}. Use 'scan' first.`];
    }

    const ports = networkSystem.probeNode(targetIp);
    const output = [
      `Probing ${targetIp} (${node.hostname})...`,
      `OS: ${node.os}`,
      `Security Level: ${node.security}`,
      '',
      'Open Ports:'
    ];

    if (ports.length === 0) {
      output.push('  No open ports detected');
    } else {
      ports.forEach(port => {
        const status = port.cracked ? '[CRACKED]' : '[CLOSED]';
        output.push(`  ${port.number}/tcp ${port.service} ${status}`);
      });
    }

    return output;
  }

  private handleConnect(args: string[]): string[] {
    if (args.length === 0) {
      return ['Usage: connect <target_ip>'];
    }

    const targetIp = args[0];
    
    // Special case for localhost
    if (targetIp === 'localhost' || targetIp === '127.0.0.1') {
      this.currentNode = '127.0.0.1';
      this.currentDirectory = '/';
      
      if (this.gameStateUpdater) {
        this.gameStateUpdater({
          currentNode: '127.0.0.1',
          currentDirectory: '/'
        });
      }
      
      return [`Connected to localhost (127.0.0.1)`];
    }

    const node = networkSystem.getNode(targetIp);
    
    if (!node || !node.discovered) {
      return [`Connection failed: Unknown host ${targetIp}`];
    }

    if (!node.compromised) {
      return [
        `Connection failed: Access denied`,
        `Host ${targetIp} requires authentication`,
        `Use hacking tools to gain access first`
      ];
    }

    this.currentNode = targetIp;
    this.currentDirectory = '/';
    
    if (this.gameStateUpdater) {
      this.gameStateUpdater({
        currentNode: targetIp,
        currentDirectory: '/'
      });
    }

    return [
      `Connected to ${node.hostname} (${targetIp})`,
      `OS: ${node.os}`,
      `Security: ${node.security}`,
      'Connection established successfully'
    ];
  }

  private handleDisconnect(): string[] {
    this.currentNode = '127.0.0.1';
    this.currentDirectory = '/';
    
    if (this.gameStateUpdater) {
      this.gameStateUpdater({
        currentNode: '127.0.0.1',
        currentDirectory: '/'
      });
    }
    
    return ['Disconnected. Returned to localhost.'];
  }

  private handleLs(args: string[]): string[] {
    const path = args[0] || this.currentDirectory;
    const files = networkSystem.getFiles(this.currentNode, path);
    
    if (files.length === 0) {
      return ['Directory empty or access denied'];
    }

    const output = [`Contents of ${path}:`, ''];
    files.forEach(file => {
      const type = file.type === 'directory' ? 'd' : '-';
      const size = file.type === 'directory' ? '' : ` (${file.size} bytes)`;
      output.push(`${type} ${file.permissions} ${file.name}${size}`);
    });

    return output;
  }

  private handleCd(args: string[]): string[] {
    if (args.length === 0) {
      return ['Usage: cd <directory>'];
    }

    const targetDir = args[0];
    
    if (targetDir === '..') {
      if (this.currentDirectory !== '/') {
        const pathParts = this.currentDirectory.split('/').filter(p => p);
        pathParts.pop();
        this.currentDirectory = '/' + pathParts.join('/');
        if (this.currentDirectory !== '/' && this.currentDirectory.endsWith('/')) {
          this.currentDirectory = this.currentDirectory.slice(0, -1);
        }
      }
    } else if (targetDir === '/') {
      this.currentDirectory = '/';
    } else {
      const newPath = this.currentDirectory === '/' ? `/${targetDir}` : `${this.currentDirectory}/${targetDir}`;
      const files = networkSystem.getFiles(this.currentNode, this.currentDirectory);
      const targetFile = files.find(f => f.name === targetDir && f.type === 'directory');
      
      if (!targetFile) {
        return [`cd: ${targetDir}: No such directory`];
      }
      
      this.currentDirectory = newPath;
    }

    if (this.gameStateUpdater) {
      this.gameStateUpdater({
        currentDirectory: this.currentDirectory
      });
    }

    return [`Changed directory to ${this.currentDirectory}`];
  }

  private handleCat(args: string[]): string[] {
    if (args.length === 0) {
      return ['Usage: cat <filename>'];
    }

    const filename = args[0];
    const files = networkSystem.getFiles(this.currentNode, this.currentDirectory);
    const file = files.find(f => f.name === filename && f.type === 'file');

    if (!file) {
      return [`cat: ${filename}: No such file`];
    }

    if (file.content) {
      return file.content.split('\n');
    }

    return [`Contents of ${filename}`, '(Binary file or no content available)'];
  }

  private handleRm(args: string[]): string[] {
    if (args.length === 0) {
      return ['Usage: rm <filename>'];
    }

    const filename = args[0];
    
    if (filename === '*') {
      // Delete all files in current directory
      const files = networkSystem.getFiles(this.currentNode, this.currentDirectory);
      const deletedFiles: string[] = [];
      
      files.forEach(file => {
        if (file.type === 'file') {
          if (networkSystem.deleteFile(this.currentNode, this.currentDirectory, file.name)) {
            deletedFiles.push(file.name);
          }
        }
      });

      if (deletedFiles.length > 0) {
        if (this.gameStateUpdater) {
          this.gameStateUpdater({
            deletedFiles: [...(this.gameState.deletedFiles || []), ...deletedFiles]
          });
        }
        return [`Deleted ${deletedFiles.length} files: ${deletedFiles.join(', ')}`];
      } else {
        return ['No files to delete'];
      }
    } else {
      if (networkSystem.deleteFile(this.currentNode, this.currentDirectory, filename)) {
        if (this.gameStateUpdater) {
          this.gameStateUpdater({
            deletedFiles: [...(this.gameState.deletedFiles || []), filename]
          });
        }
        return [`File '${filename}' deleted successfully`];
      } else {
        return [`rm: ${filename}: No such file or permission denied`];
      }
    }
  }

  private handleScp(args: string[]): string[] {
    if (args.length === 0) {
      return ['Usage: scp <filename>'];
    }

    const filename = args[0];
    const file = networkSystem.downloadFile(this.currentNode, filename);

    if (!file) {
      return [`scp: ${filename}: File not found or access denied`];
    }

    if (this.gameStateUpdater) {
      this.gameStateUpdater({
        downloadedFiles: [...(this.gameState.downloadedFiles || []), filename]
      });

      // If it's a tool, unlock it
      if (HACKNET_TOOLS[filename]) {
        hackingToolsSystem.acquireTool(filename);
      }
    }

    return [
      `Downloading ${filename}...`,
      `Transfer complete: ${file.size} bytes`,
      `File saved to localhost:/bin/${filename}`
    ];
  }

  private handlePs(): string[] {
    const processes = hackingToolsSystem.getActiveProcesses();
    const traces = counterAttackSystem.getActiveTraces();
    
    const output = ['Active Processes:', ''];
    
    if (processes.length === 0 && traces.length === 0) {
      output.push('No active processes');
    } else {
      output.push('PID  COMMAND               RAM    STATUS');
      output.push('---  --------------------  -----  --------');
      
      processes.forEach((process, index) => {
        const pid = `${index + 1}`.padEnd(3);
        const command = process.tool.name.padEnd(20);
        const ram = `${process.tool.ramCost}MB`.padEnd(5);
        const status = process.status.toUpperCase();
        output.push(`${pid}  ${command}  ${ram}  ${status}`);
      });

      traces.forEach((trace, index) => {
        const pid = `T${index + 1}`.padEnd(3);
        const command = `Trace from ${trace.source}`.padEnd(20);
        const progress = `${Math.round(trace.progress)}%`.padEnd(5);
        const status = 'TRACING';
        output.push(`${pid}  ${command}  ${progress}  ${status}`);
      });
    }

    return output;
  }

  private handleKill(args: string[]): string[] {
    if (args.length === 0) {
      return ['Usage: kill <process_id>'];
    }

    const processId = args[0];
    
    if (hackingToolsSystem.killProcess(processId)) {
      return [`Process ${processId} terminated`];
    } else {
      return [`kill: ${processId}: No such process`];
    }
  }

  private handleReboot(): string[] {
    // Kill all processes and reset traces
    hackingToolsSystem.getActiveProcesses().forEach(process => {
      hackingToolsSystem.killProcess(process.id);
    });

    return [
      'System rebooting...',
      'All processes terminated',
      'System online'
    ];
  }

  private async handleToolExecution(toolName: string, args: string[]): Promise<string[]> {
    const fullToolName = toolName.endsWith('.exe') ? toolName : toolName + '.exe';
    const result = await hackingToolsSystem.executeTool(fullToolName, args, args[0]);
    
    if (result.success && args[0]) {
      // Check if this compromises the target
      const targetIp = args[0];
      const tool = hackingToolsSystem.getToolByName(fullToolName);
      
      if (tool && tool.category === 'port_hack') {
        networkSystem.crackPort(targetIp, tool.targetPort || 22);
        
        // Check if enough ports are cracked to compromise the system
        const node = networkSystem.getNode(targetIp);
        if (node) {
          const crackedPorts = node.ports.filter(p => p.cracked);
          const totalPorts = node.ports.length;
          
          if (crackedPorts.length >= totalPorts) {
            networkSystem.compromiseNode(targetIp);
            result.output.push('', '*** SYSTEM COMPROMISED ***', 'Root access granted');
          }
        }
      }
    }

    return result.output;
  }

  private handlePortHack(args: string[]): string[] {
    if (args.length === 0) {
      return ['Usage: porthack <target_ip>'];
    }

    const targetIp = args[0];
    const node = networkSystem.getNode(targetIp);
    
    if (!node || !node.discovered) {
      return [`Target ${targetIp} not found`];
    }

    if (node.compromised) {
      return [`${targetIp} already compromised`];
    }

    // Basic port hack - only works on very low security
    if (node.security !== 'none' && node.security !== 'basic') {
      return [
        'Basic port hack failed',
        'Target requires specialized tools',
        'Use specific port crackers (SSHcrack.exe, FTPBounce.exe, etc.)'
      ];
    }

    networkSystem.compromiseNode(targetIp);
    
    return [
      `Port hacking ${targetIp}...`,
      'Exploiting vulnerabilities...',
      '*** SYSTEM COMPROMISED ***',
      'Root access granted'
    ];
  }

  private handleAnalyze(args: string[]): string[] {
    if (args.length === 0) {
      return ['Usage: analyze <filename>'];
    }

    const filename = args[0];
    const files = networkSystem.getFiles(this.currentNode, this.currentDirectory);
    const file = files.find(f => f.name === filename);

    if (!file) {
      return [`File ${filename} not found`];
    }

    return [
      `Analyzing ${filename}...`,
      `Type: ${file.type}`,
      `Size: ${file.size} bytes`,
      `Permissions: ${file.permissions}`,
      `Encrypted: ${file.encrypted ? 'Yes' : 'No'}`,
      file.encrypted ? 'Use Decypher.exe to decrypt' : 'Analysis complete'
    ];
  }

  private handleFirewall(): string[] {
    const result = counterAttackSystem.activateDefense('firewall');
    return result.output;
  }

  private handleProxy(): string[] {
    const result = counterAttackSystem.activateDefense('proxy');
    return result.output;
  }

  private handleTraceKill(): string[] {
    const result = counterAttackSystem.activateDefense('trace_killer');
    return result.output;
  }

  getCurrentPrompt(): string {
    const node = networkSystem.getNode(this.currentNode);
    const hostname = node ? node.hostname : this.currentNode;
    return `${hostname}:${this.currentDirectory}$`;
  }

  getCommandSuggestions(partial: string): string[] {
    const commands = [
      'help', 'scan', 'probe', 'connect', 'disconnect', 'ls', 'cd', 'cat', 'rm', 'scp',
      'ps', 'kill', 'reboot', 'porthack', 'analyze', 'firewall', 'proxy', 'tracekill'
    ];

    const tools = Object.keys(HACKNET_TOOLS);
    const allCommands = [...commands, ...tools];

    return allCommands.filter(cmd => 
      cmd.toLowerCase().startsWith(partial.toLowerCase())
    ).slice(0, 8);
  }
}

export const hackNetTerminal = new HackNetTerminal();
