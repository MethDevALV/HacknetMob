import { GameState, NetworkNode, FileEntry, ProcessInfo } from '../types/CoreTypes';
import { SystemResourceManager } from '../utils/SystemResourcesEnhanced';

export interface CommandContext {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  currentDirectory: string;
  currentNode: string;
  resourceManager: SystemResourceManager;
}

export interface CommandResult {
  output: string[];
  success: boolean;
  nodeChanged?: boolean;
  directoryChanged?: boolean;
}

export class HackNetCommands {
  private static instance: HackNetCommands;
  private context: CommandContext | null = null;

  static getInstance(): HackNetCommands {
    if (!HackNetCommands.instance) {
      HackNetCommands.instance = new HackNetCommands();
    }
    return HackNetCommands.instance;
  }

  setContext(context: CommandContext) {
    this.context = context;
  }

  async executeCommand(command: string, args: string[]): Promise<CommandResult> {
    if (!this.context) {
      return { output: ['Error: Command context not initialized'], success: false };
    }

    switch (command.toLowerCase()) {
      case 'help': return this.handleHelp();
      case 'scan': return this.handleScan();
      case 'probe': return this.handleProbe(args);
      case 'connect': return this.handleConnect(args);
      case 'disconnect': return this.handleDisconnect();
      case 'ls': return this.handleLs(args);
      case 'cd': return this.handleCd(args);
      case 'cat': return this.handleCat(args);
      case 'rm': return this.handleRm(args);
      case 'pwd': return this.handlePwd();
      case 'whoami': return this.handleWhoami();
      case 'ps': return this.handlePs();
      case 'kill': return this.handleKill(args);
      case 'sshcrack': return this.handleSSHCrack(args);
      case 'porthack': return this.handlePortHack(args);
      case 'ftpbounce': return this.handleFTPBounce(args);
      case 'webserverworm': return this.handleWebServerWorm(args);
      case 'clear': return { output: [], success: true };
      case 'netmap': return this.handleNetMap();
      case 'upload': return this.handleUpload(args);
      case 'download': return this.handleDownload(args);
      case 'analyze': return this.handleAnalyze(args);
      case 'tracekill': return this.handleTraceKill();
      case 'reboot': return this.handleReboot();
      default:
        return { output: [`Command not found: ${command}. Type 'help' for available commands.`], success: false };
    }
  }

  private handleHelp(): CommandResult {
    return {
      output: [
        '=== HackNet Terminal Commands ===',
        '',
        'Network Commands:',
        '  scan              - Scan for connected devices',
        '  probe <ip>        - Probe target for open ports',
        '  connect <ip>      - Connect to target system',
        '  disconnect        - Disconnect from current system',
        '  netmap            - Display network topology',
        '',
        'File System:',
        '  ls [path]         - List directory contents',
        '  cd <path>         - Change directory',
        '  cat <file>        - Display file contents',
        '  rm <file>        - Delete file',
        '  upload <file>     - Upload file to current system',
        '  download <file>   - Download file to home system',
        '  analyze <file>    - Analyze file structure',
        '',
        'Process Management:',
        '  ps                - List running processes',
        '  kill <pid>        - Terminate process',
        '  reboot            - Reboot current system',
        '',
        'Hacking Tools:',
        '  sshcrack <ip>     - Crack SSH (port 22)',
        '  ftpbounce <ip>    - Crack FTP (port 21)',
        '  webserverworm <ip> - Crack HTTP (port 80)',
        '  porthack <ip>     - Generic port cracking',
        '',
        'Security & Defense:',
        '  tracekill         - Kill all active traces',
        '',
        'Type command name for detailed usage.'
      ],
      success: true
    };
  }

  private handleScan(): CommandResult {
    const processId = this.context!.resourceManager.startProcess({
      name: 'Network Scan',
      cpuUsage: 15,
      ramUsage: 32,
      networkUsage: 50,
      duration: 3000
    });

    // Mock discovered devices
    const mockDevices: NetworkNode[] = [
      {
        id: 'router_001',
        name: 'Home Router',
        ip: '192.168.1.1',
        hostname: 'home-router-001',
        type: 'router',
        os: 'RouterOS v6.48',
        security: 'medium',
        compromised: false,
        discovered: true,
        connections: ['192.168.1.50', '192.168.1.100'],
        x: 100,
        y: 100,
        openPorts: [22, 80, 443],
        ports: [
          { number: 22, service: 'SSH', open: true, cracked: false, version: '2.0' },
          { number: 80, service: 'HTTP', open: true, cracked: false, version: '1.1' }
        ],
        files: [],
        services: ['ssh', 'http'],
        links: [],
        difficulty: 'medium'
      },
      {
        id: 'workstation_001',
        name: 'Office Workstation',
        ip: '192.168.1.50',
        hostname: 'office-ws-001',
        type: 'workstation',
        os: 'Windows 10 Pro',
        security: 'low',
        compromised: false,
        discovered: true,
        connections: [],
        x: 200,
        y: 150,
        openPorts: [22, 3389],
        ports: [
          { number: 22, service: 'SSH', open: true, cracked: false, version: '2.0' },
          { number: 3389, service: 'RDP', open: true, cracked: false, version: '1.0' }
        ],
        files: [],
        services: ['ssh', 'rdp'],
        links: [],
        difficulty: 'easy'
      }
    ];

    // Update game state with discovered devices
    const currentDevices = this.context!.gameState.discoveredDevices;
    const newDevices = mockDevices.filter(device => 
      !currentDevices.some(existing => existing.ip === device.ip)
    );

    if (newDevices.length > 0) {
      this.context!.updateGameState({
        discoveredDevices: [...currentDevices, ...newDevices],
        scannedNodes: [...(this.context!.gameState.scannedNodes || []), ...newDevices.map(d => d.ip)]
      });
    }

    const output = [
      'Scanning network...',
      'Probing for active devices...',
      '',
      'SCAN RESULTS:',
      '============================================',
      ''
    ];

    this.context!.gameState.discoveredDevices.forEach(device => {
      output.push(`Device Found: ${device.hostname}`);
      output.push(`IP Address: ${device.ip}`);
      output.push(`Type: ${device.type.toUpperCase()}`);
      output.push(`OS: ${device.os}`);
      output.push(`Security: ${device.security.toUpperCase()}`);
      output.push(`Status: ${device.compromised ? 'COMPROMISED' : 'SECURED'}`);
      output.push('--------------------------------------------');
    });

    output.push('');
    output.push(`Scan complete. Found ${this.context!.gameState.discoveredDevices.length} device(s).`);
    output.push('Use "connect <ip>" to attempt connection.');

    return { output, success: true };
  }

  private handleProbe(args: string[]): CommandResult {
    if (args.length === 0) {
      return { output: ['Usage: probe <target_ip>', 'Example: probe 192.168.1.50'], success: false };
    }

    const targetIp = args[0];
    const device = this.context!.gameState.discoveredDevices.find(d => d.ip === targetIp);

    if (!device) {
      return {
        output: [
          `No device found at ${targetIp}`,
          'Use "scan" to discover devices first.'
        ],
        success: false
      };
    }

    const processId = this.context!.resourceManager.startProcess({
      name: `Probe ${targetIp}`,
      cpuUsage: 10,
      ramUsage: 64,
      networkUsage: 25,
      duration: 5000
    });

    return {
      output: [
        `Probing ${targetIp}...`,
        '',
        `Target: ${device.hostname}`,
        `IP: ${device.ip}`,
        `OS: ${device.os}`,
        `Type: ${device.type.toUpperCase()}`,
        `Security Level: ${device.security.toUpperCase()}`,
        `Status: ${device.compromised ? 'COMPROMISED' : 'SECURED'}`,
        '',
        'Open Ports:',
        ...device.ports.map(port => 
          `  ${port.number}/tcp  ${port.service.padEnd(8)} ${port.open ? 'OPEN' : 'CLOSED'} ${port.cracked ? '(CRACKED)' : ''}`
        ),
        '',
        device.compromised 
          ? 'Device is compromised - you can connect directly.'
          : 'Device requires penetration tools to access.'
      ],
      success: true
    };
  }

  private handleConnect(args: string[]): CommandResult {
    if (args.length === 0) {
      return { output: ['Usage: connect <target_ip>', 'Example: connect 192.168.1.50'], success: false };
    }

    const targetIp = args[0];
    const device = this.context!.gameState.discoveredDevices.find(d => d.ip === targetIp);

    if (!device) {
      return {
        output: [
          `No route to host ${targetIp}`,
          'Device not found in discovered networks.',
          'Use "scan" to discover devices first.'
        ],
        success: false
      };
    }

    if (!device.compromised) {
      return {
        output: [
          `Connection to ${targetIp} failed: Access denied`,
          `Target: ${device.hostname}`,
          `Security: ${device.security.toUpperCase()}`,
          '',
          'You need to compromise this system first.',
          'Try using: sshcrack <ip>'
        ],
        success: false
      };
    }

    this.context!.updateGameState({ 
      currentNode: targetIp, 
      currentDirectory: '/',
      connectedNodes: [...(this.context!.gameState.connectedNodes || []), targetIp].filter((ip, index, arr) => arr.indexOf(ip) === index)
    });

    return {
      output: [
        `Connected to ${targetIp}`,
        `Hostname: ${device.hostname}`,
        `OS: ${device.os}`,
        `Access Level: ROOT`,
        '',
        'Connection established successfully.'
      ],
      success: true,
      nodeChanged: true
    };
  }

  private handleDisconnect(): CommandResult {
    this.context!.updateGameState({ 
      currentNode: 'localhost', 
      currentDirectory: '/home/user'
    });
    
    return {
      output: [
        'Disconnected from remote system.',
        'Returned to localhost (127.0.0.1)'
      ],
      success: true,
      nodeChanged: true,
      directoryChanged: true
    };
  }

  private handleSSHCrack(args: string[]): CommandResult {
    if (args.length === 0) {
      return { output: ['Usage: sshcrack <target_ip>'], success: false };
    }

    const targetIp = args[0];
    const device = this.context!.gameState.discoveredDevices.find(d => d.ip === targetIp);

    if (!device) {
      return { output: [`Device ${targetIp} not found. Use "scan" first.`], success: false };
    }

    const sshPort = device.ports.find(p => p.number === 22);
    if (!sshPort || !sshPort.open) {
      return { output: [`SSH port (22) not open on ${targetIp}`], success: false };
    }

    if (sshPort.cracked) {
      return { output: [`SSH port already cracked on ${targetIp}`], success: true };
    }

    const processId = this.context!.resourceManager.startProcess({
      name: 'SSH Crack',
      cpuUsage: 25,
      ramUsage: 512,
      networkUsage: 30,
      duration: 5000
    });

    const successRate = device.security === 'low' ? 0.9 : device.security === 'medium' ? 0.7 : 0.4;
    const success = Math.random() < successRate;

    if (success) {
      // Mark port as cracked and device as compromised
      sshPort.cracked = true;
      device.compromised = true;
      
      this.context!.updateGameState({
        compromisedNodes: [...(this.context!.gameState.compromisedNodes || []), targetIp].filter((ip, index, arr) => arr.indexOf(ip) === index),
        crackedPorts: [...(this.context!.gameState.crackedPorts || []), `${targetIp}:22`]
      });

      return {
        output: [
          `Attempting to crack SSH on ${targetIp}...`,
          'SSH authentication bypassed!',
          `Device ${targetIp} compromised successfully.`,
          'Use "connect" to access the device.'
        ],
        success: true
      };
    } else {
      return {
        output: [
          `Attempting to crack SSH on ${targetIp}...`,
          'SSH crack failed. Try again or improve your tools.'
        ],
        success: false
      };
    }
  }

  private handleLs(args: string[]): CommandResult {
    const path = args[0] || this.context!.currentDirectory;
    const currentNode = this.context!.currentNode;
    
    // Mock file system for demonstration
    const files: FileEntry[] = [
      { name: 'system.log', type: 'file', size: 2048, permissions: 'rw-r--r--', lastModified: new Date(), content: 'System logs...' },
      { name: 'config.txt', type: 'file', size: 512, permissions: 'rw-r--r--', lastModified: new Date(), content: 'Configuration data...' },
      { name: 'data', type: 'directory', size: 0, permissions: 'rwxr-xr-x', lastModified: new Date() }
    ];

    const output = ['Directory listing for ' + path, ''];
    files.forEach(file => {
      const sizeStr = file.type === 'directory' ? '<DIR>' : file.size.toString().padStart(8);
      output.push(`${file.permissions} ${sizeStr} ${file.name}`);
    });

    return { output, success: true };
  }

  private handlePwd(): CommandResult {
    return { output: [this.context!.currentDirectory], success: true };
  }

  private handlePs(): CommandResult {
    const processes = this.context!.resourceManager.getAllProcesses();
    const output = [
      'PID    CPU%  RAM    Name',
      '-------------------------'
    ];
    
    processes.forEach(proc => {
      output.push(`${proc.id.padStart(6)} ${proc.cpuUsage.toFixed(1).padStart(5)} ${proc.ramUsage?.toFixed(0).padStart(6) || '0'} ${proc.name}`);
    });

    return { output, success: true };
  }

  private handleKill(args: string[]): CommandResult {
    if (args.length === 0) {
      return { output: ['Usage: kill <pid>'], success: false };
    }

    const pid = args[0];
    const success = this.context!.resourceManager.killProcess(pid);
    
    if (success) {
      return { output: [`Process ${pid} terminated.`], success: true };
    } else {
      return { output: [`Failed to terminate process ${pid}.`], success: false };
    }
  }

  private handlePortHack(args: string[]): CommandResult {
    return this.handleSSHCrack(args); // Fallback to SSH crack for now
  }

  private handleFTPBounce(args: string[]): CommandResult {
    // Similar implementation to SSH crack but for FTP port 21
    return { output: ['FTP Bounce not yet implemented'], success: false };
  }

  private handleWebServerWorm(args: string[]): CommandResult {
    // Similar implementation for HTTP port 80
    return { output: ['Web Server Worm not yet implemented'], success: false };
  }

  private handleNetMap(): CommandResult {
    const devices = this.context!.gameState.discoveredDevices;
    const output = [
      'Network Topology Map:',
      '===================='
    ];

    devices.forEach(device => {
      const status = device.compromised ? '[COMPROMISED]' : '[SECURED]';
      output.push(`${device.ip} - ${device.hostname} ${status}`);
      if (device.connections.length > 0) {
        output.push(`  └─ Connected to: ${device.connections.join(', ')}`);
      }
    });

    return { output, success: true };
  }

  private handleUpload(args: string[]): CommandResult {
    return { output: ['Upload functionality not yet implemented'], success: false };
  }

  private handleDownload(args: string[]): CommandResult {
    return { output: ['Download functionality not yet implemented'], success: false };
  }

  private handleAnalyze(args: string[]): CommandResult {
    return { output: ['File analysis not yet implemented'], success: false };
  }

  private handleTraceKill(): CommandResult {
    this.context!.updateGameState({
      traceLevel: 0,
      activeTraces: []
    });

    return {
      output: [
        'TraceKill.exe executed',
        'All active traces terminated',
        'Trace level reset to 0%'
      ],
      success: true
    };
  }

  private handleReboot(): CommandResult {
    // Clear all processes and reset to base state
    this.context!.resourceManager.getAllProcesses().forEach(proc => {
      this.context!.resourceManager.killProcess(proc.id);
    });

    return {
      output: [
        'System rebooting...',
        'All processes terminated',
        'System online'
      ],
      success: true
    };
  }

  private handleCd(args: string[]): CommandResult {
    if (args.length === 0) {
      return { output: ['Usage: cd <directory>'], success: false };
    }

    const targetDir = args[0];
    let newDirectory = this.context!.currentDirectory;

    if (targetDir === '..') {
      const parts = newDirectory.split('/').filter(p => p);
      parts.pop();
      newDirectory = '/' + parts.join('/');
    } else if (targetDir.startsWith('/')) {
      newDirectory = targetDir;
    } else {
      newDirectory = this.context!.currentDirectory + (this.context!.currentDirectory.endsWith('/') ? '' : '/') + targetDir;
    }

    this.context!.updateGameState({ currentDirectory: newDirectory });

    return {
      output: [`Changed directory to ${newDirectory}`],
      success: true,
      directoryChanged: true
    };
  }

  private handleCat(args: string[]): CommandResult {
    if (args.length === 0) {
      return { output: ['Usage: cat <filename>'], success: false };
    }

    const filename = args[0];
    // Mock file content
    const content = `Contents of ${filename}:\n\nThis is a sample file on the ${this.context!.currentNode} system.\nFile accessed from ${this.context!.currentDirectory}`;

    return { output: content.split('\n'), success: true };
  }

  private handleRm(args: string[]): CommandResult {
    if (args.length === 0) {
      return { output: ['Usage: rm <filename>'], success: false };
    }

    const filename = args[0];
    
    this.context!.updateGameState({
      deletedFiles: [...(this.context!.gameState.deletedFiles || []), `${this.context!.currentNode}:${this.context!.currentDirectory}/${filename}`]
    });

    return { output: [`File ${filename} deleted.`], success: true };
  }

  private handleWhoami(): CommandResult {
    const currentNode = this.context!.currentNode;
    const isCompromised = this.context!.gameState.compromisedNodes.includes(currentNode);
    
    return {
      output: [
        isCompromised ? 'root' : 'guest',
        `Current system: ${currentNode}`,
        `Access level: ${isCompromised ? 'Administrator' : 'Limited'}`
      ],
      success: true
    };
  }
}

export const hackNetCommands = HackNetCommands.getInstance();
