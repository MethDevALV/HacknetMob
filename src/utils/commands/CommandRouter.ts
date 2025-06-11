import { NetworkManager } from '../NetworkManager';
import { FileSystemManager } from '../FileSystemManager';
import { systemResourceManager } from '../SystemResources';
import { defenseSystem } from '../DefenseSystem';
import { CounterAttackSystem } from '../CounterAttack';

export class CommandRouter {
  private networkManager: NetworkManager;
  private fsManager: FileSystemManager;
  private counterAttackSystem: CounterAttackSystem;
  private gameStateUpdater: ((updates: any) => void) | null = null;
  private gameState: any = null;

  constructor() {
    this.networkManager = NetworkManager.getInstance();
    this.fsManager = FileSystemManager.getInstance();
    this.counterAttackSystem = new CounterAttackSystem();
  }

  setGameState(gameState: any, updater: (updates: any) => void) {
    this.gameState = gameState;
    this.gameStateUpdater = updater;
    this.networkManager.setGameStateUpdater(updater);
  }

  initializeWithGameState(gameState: any) {
    if (gameState?.discoveredDevices) {
      this.networkManager.initializeFromGameState(gameState.discoveredDevices);
    } else {
      this.networkManager.initializeDefaultDevices();
    }
    
    if (gameState?.activeMissions) {
      gameState.activeMissions.forEach((missionId: string) => {
        this.fsManager.plantMissionFiles(missionId);
      });
    }
  }

  async executeCommand(command: string): Promise<string[]> {
    const parts = command.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    console.log(`[CommandRouter] Executing: ${cmd}`, args);

    switch (cmd) {
      case 'help':
        return this.handleHelp();
      
      case 'clear':
        return [''];
      
      case 'scan':
      case 'probe':
        return this.handleScan();
      
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
      
      case 'mv':
        return this.handleMv(args);
      
      case 'rm':
        return this.handleRm(args);
      
      case 'scp':
        return this.handleScp(args);
      
      case 'upload':
        return this.handleUpload(args);
      
      case 'login':
        return this.handleLogin();
      
      case 'reboot':
        return this.handleReboot();
      
      case 'replace':
        return this.handleReplace(args);
      
      case 'analyze':
        return this.handleAnalyze();
      
      case 'solve':
        return this.handleSolve(args);
      
      case 'exe':
        return this.handleExe();
      
      case 'shell':
        return this.handleShell();
      
      case 'addnote':
        return this.handleAddNote(args);
      
      case 'forkbomb':
        return this.handleForkbomb();
      
      case 'opencdtray':
        return this.handleOpenCDTray();
      
      case 'closecdtray':
        return this.handleCloseCDTray();
      
      case 'pwd':
        return [this.gameState?.currentDirectory || '/home/user'];
      
      case 'whoami':
        return ['user'];
      
      case 'sshcrack.exe':
      case 'sshcrack':
        return this.handleSshCrack(args);
      
      case 'ftpbounce.exe':
      case 'ftpbounce':
        return this.handleFtpBounce(args);
      
      case 'webserverworm.exe':
      case 'webserverworm':
        return this.handleWebServerWorm(args);
      
      case 'porthack.exe':
      case 'porthack':
        return this.handlePortHack(args);
      
      // Defense Commands
      case 'firewall':
        return this.handleFirewall();
      
      case 'proxy':
        return this.handleProxy();
      
      case 'scramble':
        return this.handleScramble();
      
      case 'deflect':
        return this.handleDeflect();
      
      case 'counterhack':
        return this.handleCounterhack();
      
      case 'isolate':
        return this.handleIsolate();
      
      case 'restore':
        return this.handleRestore();
      
      case 'panic':
        return this.handlePanic();
      
      default:
        return [`Command not found: ${cmd}`, 'Type "help" for available commands.'];
    }
  }

  getCommandSuggestions(input: string): string[] {
    const commands = [
      'help', 'clear', 'scan', 'probe', 'connect', 'disconnect', 'dc', 'ls', 'cd', 'cat',
      'mv', 'rm', 'scp', 'upload', 'login', 'reboot', 'replace', 'analyze', 'solve',
      'exe', 'shell', 'addnote', 'forkbomb', 'opencdtray', 'closecdtray', 'pwd', 'whoami',
      'sshcrack.exe', 'ftpbounce.exe', 'webserverworm.exe', 'porthack.exe',
      'firewall', 'proxy', 'scramble', 'deflect', 'counterhack', 'isolate', 'restore', 'panic'
    ];

    const currentNode = this.gameState?.currentNode || 'localhost';
    const currentDir = this.gameState?.currentDirectory || '/home/user';
    const files = this.fsManager.getFileSystem(currentNode, currentDir);
    const fileNames = files.map(f => f.name);

    const allSuggestions = [...commands, ...fileNames];
    
    return allSuggestions.filter(suggestion => 
      suggestion.toLowerCase().startsWith(input.toLowerCase())
    );
  }

  private canRunTool(toolName: string): { canRun: boolean; message?: string } {
    const resourceUsage = systemResourceManager.getResources();
    
    // Define resource requirements for each tool
    const toolRequirements = {
      'sshcrack': { ram: 512, cpu: 25 },
      'ftpbounce': { ram: 256, cpu: 15 },
      'webserverworm': { ram: 1024, cpu: 35 },
      'porthack': { ram: 384, cpu: 20 },
      'probe': { ram: 200, cpu: 10 }
    };

    const requirements = toolRequirements[toolName as keyof typeof toolRequirements];
    if (!requirements) return { canRun: true };

    const futureRam = resourceUsage.ram.current + requirements.ram;
    const futureCpu = resourceUsage.cpu.current + requirements.cpu;

    if (futureRam > resourceUsage.ram.max) {
      return { 
        canRun: false, 
        message: `Insufficient RAM. Required: ${requirements.ram}MB, Available: ${resourceUsage.ram.max - resourceUsage.ram.current}MB`
      };
    }

    if (futureCpu > 90) {
      return { 
        canRun: false, 
        message: `CPU overload risk. Current usage: ${resourceUsage.cpu.current}%, Tool requires: ${requirements.cpu}%`
      };
    }

    return { canRun: true };
  }

  private triggerIntrusionDetection(targetIp: string, toolUsed: string): boolean {
    const device = this.networkManager.getDevice(targetIp);
    if (!device) return false;

    // First device (192.168.1.50) has no intrusion detection
    if (targetIp === '192.168.1.50') return false;

    const detectionChance = {
      'low': 0.1,
      'medium': 0.3,
      'high': 0.6,
      'maximum': 0.9
    }[device.security] || 0.2;

    if (Math.random() < detectionChance) {
      const result = this.counterAttackSystem.initiateCounterAttack(device.security, toolUsed);
      
      if (this.gameStateUpdater) {
        this.gameStateUpdater({
          traceLevel: Math.min((this.gameState?.traceLevel || 0) + (result.effects.traceIncrease || 0), 100)
        });
      }
      
      return true;
    }
    
    return false;
  }

  private handleHelp(): string[] {
    return [
      'HackNet Terminal - Available Commands:',
      '',
      'Network Commands:',
      '  scan/probe           - Discover and analyze devices on the network',
      '  connect <ip>         - Connect to a remote device',
      '  disconnect/dc        - Disconnect from current device',
      '',
      'File System Commands:',
      '  ls [directory]       - List files in current or specified directory',
      '  cd <directory>       - Change to specified directory',
      '  cat <filename>       - Display file contents',
      '  mv <src> <dst>       - Move or rename files/directories',
      '  rm <file/dir>        - Delete files/directories',
      '  pwd                  - Show current directory',
      '',
      'File Transfer:',
      '  scp <file>           - Download file from target system',
      '  upload <file>        - Upload file to target system',
      '',
      'System Commands:',
      '  login                - Log in to system (if credentials required)',
      '  reboot               - Restart target system',
      '  replace <file> "old" "new" - Replace text in file',
      '  shell                - Access shell interface',
      '  exe                  - List available executable programs',
      '',
      'Security & Analysis:',
      '  analyze              - Analyze firewall properties',
      '  solve <password>     - Attempt to solve firewall',
      '  sshcrack <ip>        - Crack SSH passwords',
      '',
      'Utility Commands:',
      '  addNote <text>       - Add note to Notes.exe',
      '  forkbomb             - Saturate target RAM',
      '  openCDtray           - Open CD/DVD tray',
      '  closeCDtray          - Close CD/DVD tray',
      '',
      'Other:',
      '  help                 - Show this help message',
      '  clear                - Clear terminal screen'
    ];
  }

  private handleScan(): string[] {
    const currentNode = this.gameState?.currentNode || 'localhost';
    const devices = this.networkManager.scanNetwork(currentNode);
    
    const output = [
      'Scanning network...',
      'Probing for active devices...',
      '',
      'SCAN RESULTS:',
      '============================================',
      ''
    ];

    devices.forEach(device => {
      output.push(`Device Found: ${device.hostname}`);
      output.push(`IP Address: ${device.ip}`);
      output.push(`Type: ${device.type}`);
      output.push(`OS: ${device.os}`);
      output.push(`Security: ${device.security.toUpperCase()}`);
      output.push(`Status: ${device.compromised ? 'COMPROMISED' : 'SECURED'}`);
      output.push('--------------------------------------------');
    });

    output.push('');
    output.push(`Scan complete. Found ${devices.length} device(s).`);
    output.push('Use "connect <ip>" to attempt connection.');

    return output;
  }

  private handleConnect(args: string[]): string[] {
    if (args.length === 0) {
      return ['Usage: connect <target_ip>', 'Example: connect 192.168.1.50'];
    }

    const device = this.networkManager.getDevice(args[0]);
    
    if (!device) {
      return [
        `No route to host ${args[0]}`,
        'Device not found in discovered networks.',
        'Use "scan" to discover devices first.'
      ];
    }

    if (!device.discovered) {
      return [
        `Device ${args[0]} not yet discovered`,
        'Use "scan" to discover devices first.'
      ];
    }

    if (!device.compromised) {
      return [
        `Connection to ${args[0]} failed: Access denied`,
        `Target: ${device.hostname}`,
        `Security: ${device.security.toUpperCase()}`,
        '',
        'You need to compromise this system first.',
        'Try using: sshcrack <ip>'
      ];
    }

    // Update current node and reset directory for remote systems
    if (this.gameStateUpdater) {
      this.gameStateUpdater({ 
        currentNode: args[0],
        currentDirectory: '/'
      });
    }

    return [
      `Connected to ${args[0]}`,
      `Hostname: ${device.hostname}`,
      `OS: ${device.os}`,
      `Access Level: ROOT`,
      '',
      'Connection established successfully.'
    ];
  }

  private handleDisconnect(): string[] {
    if (this.gameStateUpdater) {
      this.gameStateUpdater({ 
        currentNode: 'localhost',
        currentDirectory: '/home/user'
      });
    }
    return [
      'Disconnected from remote system.',
      'Returned to localhost (127.0.0.1)'
    ];
  }

  private handleLs(args: string[]): string[] {
    const currentNode = this.gameState?.currentNode || 'localhost';
    const currentDir = this.gameState?.currentDirectory || '/home/user';
    
    let targetDir = currentDir;
    if (args.length > 0) {
      const arg = args[0];
      if (arg.startsWith('/')) {
        targetDir = arg;
      } else {
        targetDir = currentDir === '/' ? `/${arg}` : `${currentDir}/${arg}`;
      }
    }

    const files = this.fsManager.getFileSystem(currentNode, targetDir);
    
    if (files.length === 0) {
      return [`Directory '${targetDir}' is empty or does not exist`];
    }

    const result = [`Contents of ${targetDir}:`, ''];
    files.forEach(file => {
      const typeIndicator = file.type === 'directory' ? 'd' : '-';
      const permissions = file.permissions || '-rw-r--r--';
      const size = file.size ? file.size.toString().padStart(8) : '     dir';
      
      result.push(`${typeIndicator}${permissions.slice(1)} ${size} ${file.name}`);
    });

    return result;
  }

  private handleCd(args: string[]): string[] {
    if (args.length === 0) {
      return [`Current directory: ${this.gameState?.currentDirectory || '/home/user'}`];
    }

    const currentNode = this.gameState?.currentNode || 'localhost';
    const currentDir = this.gameState?.currentDirectory || '/home/user';
    const targetDir = args[0];
    let newPath: string;

    if (targetDir === '..') {
      const pathParts = currentDir.split('/').filter(p => p);
      pathParts.pop();
      newPath = pathParts.length > 0 ? '/' + pathParts.join('/') : '/';
    } else if (targetDir.startsWith('/')) {
      newPath = targetDir;
    } else {
      newPath = currentDir === '/' ? `/${targetDir}` : `${currentDir}/${targetDir}`;
    }

    const isValidDirectory = this.fsManager.isValidDirectory(currentNode, newPath);
    
    if (!isValidDirectory && newPath !== '/') {
      return [`cd: ${targetDir}: No such file or directory`];
    }

    if (this.gameStateUpdater) {
      this.gameStateUpdater({ currentDirectory: newPath });
    }

    return [`Changed to directory: ${newPath}`];
  }

  private handleCat(args: string[]): string[] {
    if (args.length === 0) {
      return ['Usage: cat <filename>'];
    }

    const currentNode = this.gameState?.currentNode || 'localhost';
    const currentDir = this.gameState?.currentDirectory || '/home/user';
    const fileName = args[0];

    const file = this.fsManager.getFile(currentNode, currentDir, fileName);
    
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

    return [`File ${fileName} appears to be empty.`];
  }

  private handleMv(args: string[]): string[] {
    if (args.length < 2) {
      return ['Usage: mv <source> <destination>', 'Example: mv file.txt /bin/newname.txt'];
    }

    return [`mv: Moving ${args[0]} to ${args[1]} - Feature not yet implemented`];
  }

  private handleRm(args: string[]): string[] {
    if (args.length === 0) {
      return ['Usage: rm <filename>'];
    }

    const currentNode = this.gameState?.currentNode || 'localhost';
    const currentDir = this.gameState?.currentDirectory || '/home/user';
    const fileName = args[0];

    const file = this.fsManager.getFile(currentNode, currentDir, fileName);
    
    if (!file) {
      return [`rm: cannot remove '${fileName}': No such file or directory`];
    }

    if (file.type === 'directory') {
      return [`rm: cannot remove '${fileName}': Is a directory`];
    }

    const removed = this.fsManager.removeFile(currentNode, currentDir, fileName);
    
    if (!removed) {
      return [`rm: cannot remove '${fileName}': Operation failed`];
    }
    
    // Track deletion for missions
    if (this.gameStateUpdater) {
      const deletedFiles = this.gameState?.deletedFiles || [];
      this.gameStateUpdater({
        deletedFiles: [...deletedFiles, `${currentNode}:${currentDir}/${fileName}`]
      });
    }

    return [`File '${fileName}' deleted successfully.`];
  }

  private handleScp(args: string[]): string[] {
    if (args.length === 0) {
      return ['Usage: scp <filename>', 'Downloads file from current system to localhost'];
    }

    const currentNode = this.gameState?.currentNode || 'localhost';
    const currentDir = this.gameState?.currentDirectory || '/home/user';
    const fileName = args[0];

    // Check if file exists on current system
    const file = this.fsManager.getFile(currentNode, currentDir, fileName);
    
    if (!file) {
      return [`scp: ${fileName}: No such file or directory`];
    }

    // Update game state to track downloaded file
    if (this.gameStateUpdater) {
      const downloadedFiles = this.gameState?.downloadedFiles || [];
      this.gameStateUpdater({
        downloadedFiles: [...downloadedFiles, fileName]
      });
    }

    // Add file to localhost Downloads directory
    this.fsManager.addFile('localhost', '/home/user/Downloads', {
      name: fileName,
      type: 'file',
      size: file.size || 1024,
      modified: new Date().toLocaleString(),
      permissions: '-rw-r--r--',
      content: file.content || `Downloaded from ${currentNode}`
    });

    return [
      `Downloading ${fileName}...`,
      'Transfer complete.',
      `File saved to localhost:/home/user/Downloads/${fileName}`
    ];
  }

  private handleUpload(args: string[]): string[] {
    if (args.length === 0) {
      return ['Usage: upload <local_file_path>', 'Uploads file from localhost to current system'];
    }

    const fileName = args[0];
    return [
      `Uploading ${fileName}...`,
      'Transfer complete.',
      `File uploaded to current directory.`
    ];
  }

  private handleLogin(): string[] {
    return [
      'Login prompt:',
      'Username: [auto-filled based on compromised credentials]',
      'Password: [auto-filled based on compromised credentials]',
      '',
      'Login successful.'
    ];
  }

  private handleReboot(): string[] {
    const currentNode = this.gameState?.currentNode || 'localhost';
    
    if (currentNode === 'localhost') {
      return ['Cannot reboot localhost system.'];
    }

    return [
      `Rebooting ${currentNode}...`,
      'System restart initiated.',
      'Connection will be lost.',
      '',
      'Reboot complete.'
    ];
  }

  private handleReplace(args: string[]): string[] {
    if (args.length < 3) {
      return [
        'Usage: replace <file> "<original_text>" "<new_text>"',
        'Example: replace config.sys "Offline" "Online"'
      ];
    }

    const fileName = args[0];
    const originalText = args[1];
    const newText = args[2];

    return [
      `Replacing text in ${fileName}...`,
      `"${originalText}" -> "${newText}"`,
      'Text replacement complete.'
    ];
  }

  private handleAnalyze(): string[] {
    return [
      'Analyzing firewall properties...',
      '',
      'Firewall Status: ACTIVE',
      'Security Level: MEDIUM',
      'Encryption: AES-256',
      'Required Tools: FirewallAnalysis.exe',
      '',
      'Analysis complete.'
    ];
  }

  private handleSolve(args: string[]): string[] {
    if (args.length === 0) {
      return ['Usage: solve <firewall_password>'];
    }

    const password = args[0];
    return [
      `Attempting to solve firewall with password: ${password}`,
      'Processing...',
      'Firewall bypass: FAILED',
      'Incorrect password or insufficient tools.'
    ];
  }

  private handleExe(): string[] {
    return [
      'Executable programs in /bin:',
      '',
      'Available tools:',
      '- ls (List directory contents)',
      '- cd (Change directory)',
      '- cat (Display file contents)',
      '',
      'Note: Additional .exe tools must be obtained through missions or contracts.'
    ];
  }

  private handleShell(): string[] {
    return [
      'Entering shell interface...',
      '',
      'Shell commands available:',
      '  activate trap - Activate security trap',
      '  ps           - List running processes',
      '  kill <pid>   - Terminate process by ID',
      '',
      'Type "exit" to leave shell mode.'
    ];
  }

  private handleAddNote(args: string[]): string[] {
    if (args.length === 0) {
      return ['Usage: addNote <text>', 'Adds note to Notes.exe program'];
    }

    const noteText = args.join(' ');
    return [
      `Note added: "${noteText}"`,
      'Note saved to Notes.exe'
    ];
  }

  private handleForkbomb(): string[] {
    const currentNode = this.gameState?.currentNode || 'localhost';
    
    if (currentNode === 'localhost') {
      return ['Cannot execute forkbomb on localhost.'];
    }

    return [
      'Executing forkbomb...',
      'RAM saturation: 10%... 25%... 50%... 75%... 100%',
      `Target system ${currentNode} overwhelmed.`,
      'System frozen - forkbomb successful.'
    ];
  }

  private handleOpenCDTray(): string[] {
    return [
      'Opening CD/DVD tray...',
      'Tray opened successfully.',
      '(Physical tray operation - if hardware supports it)'
    ];
  }

  private handleCloseCDTray(): string[] {
    return [
      'Closing CD/DVD tray...',
      'Tray closed successfully.',
      '(Physical tray operation - if hardware supports it)'
    ];
  }

  private handleSshCrack(args: string[]): string[] {
    if (args.length === 0) {
      return ['Usage: sshcrack.exe <target_ip>', 'Example: sshcrack.exe 192.168.1.50'];
    }

    const targetIp = args[0];
    const device = this.networkManager.getDevice(targetIp);
    
    if (!device) {
      return [`Target ${targetIp} not found.`, 'Use "scan" to discover devices first.'];
    }

    if (!device.discovered) {
      return [`Target ${targetIp} not yet discovered.`, 'Use "scan" to discover devices first.'];
    }

    // Check hardware limitations
    const resourceCheck = this.canRunTool('sshcrack');
    if (!resourceCheck.canRun) {
      return [`Error: ${resourceCheck.message}`];
    }

    if (device.compromised) {
      return [`${targetIp} is already compromised.`];
    }

    // Check for intrusion detection (except for first device)
    if (this.triggerIntrusionDetection(targetIp, 'sshcrack')) {
      return [
        'INTRUSION DETECTED!',
        'Counter-attack measures activated.',
        'SSH crack operation aborted.',
        'Consider using defensive tools.'
      ];
    }

    // Start process with resource usage
    const processId = `sshcrack_${Date.now()}`;
    const success = systemResourceManager.startProcess({
      id: processId,
      name: `SSH Crack ${targetIp}`,
      cpuUsage: 25,
      ramUsage: 512,
      networkUsage: 50,
      startTime: Date.now(),
      duration: 15,
      target: targetIp
    });

    if (!success) {
      return ['Error: Could not start SSH crack process.'];
    }

    // Simple success for first device (192.168.1.50) and low security devices
    if (targetIp === '192.168.1.50' || device.security === 'low') {
      this.networkManager.compromiseDevice(targetIp);
      
      // For the first device, add SSHcrack.exe to their file system
      if (targetIp === '192.168.1.50') {
        this.fsManager.addFile(targetIp, '/bin', {
          name: 'SSHcrack.exe',
          type: 'file',
          size: 2048,
          modified: new Date().toLocaleString(),
          permissions: '-rwxr-xr-x',
          content: 'SSH Password Cracking Tool v2.1\nUsage: SSHcrack.exe <target_ip>'
        });
      }
      
      return [
        'SSH Crack successful!',
        `Cracked SSH login for ${device.hostname}`,
        'Password found: admin123',
        'Device compromised successfully.',
        targetIp === '192.168.1.50' ? 'SSHcrack.exe tool acquired!' : '',
        'You can now connect to this device.'
      ].filter(line => line);
    }

    return [
      'SSH Crack failed.',
      `Security level ${device.security.toUpperCase()} too high.`,
      'Need additional tools or vulnerabilities.'
    ];
  }

  private handleFtpBounce(args: string[]): string[] {
    if (args.length === 0) {
      return ['Usage: ftpbounce.exe <target_ip>'];
    }

    const resourceCheck = this.canRunTool('ftpbounce');
    if (!resourceCheck.canRun) {
      return [`Error: ${resourceCheck.message}`];
    }

    const targetIp = args[0];
    
    if (this.triggerIntrusionDetection(targetIp, 'ftpbounce')) {
      return ['INTRUSION DETECTED! FTP bounce attack blocked.'];
    }

    const processId = `ftpbounce_${Date.now()}`;
    systemResourceManager.startProcess({
      id: processId,
      name: `FTP Bounce ${targetIp}`,
      cpuUsage: 15,
      ramUsage: 256,
      networkUsage: 75,
      startTime: Date.now(),
      duration: 20,
      target: targetIp
    });

    return [
      `Initiating FTP bounce attack on ${targetIp}...`,
      'Exploiting FTP service vulnerabilities...',
      'Use "ps" to monitor progress.'
    ];
  }

  private handleWebServerWorm(args: string[]): string[] {
    if (args.length === 0) {
      return ['Usage: webserverworm.exe <target_ip>'];
    }

    const resourceCheck = this.canRunTool('webserverworm');
    if (!resourceCheck.canRun) {
      return [`Error: ${resourceCheck.message}`];
    }

    const targetIp = args[0];
    
    if (this.triggerIntrusionDetection(targetIp, 'webserverworm')) {
      return ['INTRUSION DETECTED! Web server worm deployment blocked.'];
    }

    const processId = `webworm_${Date.now()}`;
    systemResourceManager.startProcess({
      id: processId,
      name: `Web Worm ${targetIp}`,
      cpuUsage: 30,
      ramUsage: 1024,
      networkUsage: 100,
      startTime: Date.now(),
      duration: 25,
      target: targetIp
    });

    return [
      `Deploying web server worm to ${targetIp}...`,
      'Scanning for web vulnerabilities...',
      'Injecting payload...',
      'Use "ps" to monitor progress.'
    ];
  }

  private handlePortHack(args: string[]): string[] {
    if (args.length === 0) {
      return ['Usage: porthack.exe <target_ip>'];
    }

    const resourceCheck = this.canRunTool('porthack');
    if (!resourceCheck.canRun) {
      return [`Error: ${resourceCheck.message}`];
    }

    const targetIp = args[0];
    
    if (this.triggerIntrusionDetection(targetIp, 'porthack')) {
      return ['INTRUSION DETECTED! Port hack attempt blocked.'];
    }

    const processId = `porthack_${Date.now()}`;
    systemResourceManager.startProcess({
      id: processId,
      name: `Port Hack ${targetIp}`,
      cpuUsage: 20,
      ramUsage: 384,
      networkUsage: 60,
      startTime: Date.now(),
      duration: 18,
      target: targetIp
    });

    return [
      `Starting port scan and exploitation on ${targetIp}...`,
      'Identifying open ports...',
      'Attempting buffer overflow attacks...',
      'Use "ps" to monitor progress.'
    ];
  }

  private handleFirewall(): string[] {
    const result = defenseSystem.executeDefense('firewall');
    
    if (result.success) {
      return [
        '🛡️ FIREWALL ACTIVADO',
        '════════════════════',
        result.message,
        `Duración: ${Math.ceil((result.duration || 0) / 1000)}s`,
        `Recursos: CPU ${result.resourceCost?.cpu}% | RAM ${result.resourceCost?.ram}MB`,
        '',
        '✅ Protección activa contra reconocimiento y ataques básicos'
      ];
    } else {
      return [
        '❌ ERROR DE FIREWALL',
        '════════════════════',
        result.message
      ];
    }
  }

  private handleProxy(): string[] {
    const result = defenseSystem.executeDefense('proxy');
    
    if (result.success) {
      return [
        '🔀 PROXY ACTIVADO',
        '═══════════════════',
        result.message,
        `Recursos: CPU ${result.resourceCost?.cpu}% | RAM ${result.resourceCost?.ram}MB`,
        '',
        '🌐 Conexiones enrutadas a través de servidores intermedios'
      ];
    } else {
      return [
        '❌ ERROR DE PROXY',
        '══════════════════',
        result.message
      ];
    }
  }

  private handleScramble(): string[] {
    const result = defenseSystem.executeDefense('scramble');
    
    if (result.success) {
      return [
        '🔀 OFUSCADOR ACTIVADO',
        '════════════════════',
        result.message,
        `Duración: ${Math.ceil((result.duration || 0) / 1000)}s`,
        `Recursos: CPU ${result.resourceCost?.cpu}% | RAM ${result.resourceCost?.ram}MB`
      ];
    } else {
      return [
        '❌ ERROR DE OFUSCACIÓN',
        '═══════════════════════',
        result.message
      ];
    }
  }

  private handleDeflect(): string[] {
    const result = defenseSystem.executeDefense('deflect');
    
    if (result.success) {
      return [
        '↩️ DEFLECTOR ACTIVADO',
        '════════════════════',
        result.message,
        `Duración: ${Math.ceil((result.duration || 0) / 1000)}s`,
        `Recursos: CPU ${result.resourceCost?.cpu}% | RAM ${result.resourceCost?.ram}MB`
      ];
    } else {
      return [
        '❌ ERROR DE DEFLECCIÓN',
        '══════════════════════',
        result.message
      ];
    }
  }

  private handleCounterhack(): string[] {
    const result = defenseSystem.executeDefense('counterhack');
    
    if (result.success) {
      return [
        '⚔️ CONTRAATAQUE INICIADO',
        '═══════════════════════',
        result.message,
        `Recursos: CPU ${result.resourceCost?.cpu}% | RAM ${result.resourceCost?.ram}MB`
      ];
    } else {
      return [
        '❌ ERROR DE CONTRAATAQUE',
        '═══════════════════════',
        result.message
      ];
    }
  }

  private handleIsolate(): string[] {
    const result = defenseSystem.executeDefense('isolate');
    
    if (result.success) {
      return [
        '🔒 SISTEMA AISLADO',
        '═══════════════════',
        result.message,
        `Recursos: CPU ${result.resourceCost?.cpu}% | RAM ${result.resourceCost?.ram}MB`
      ];
    } else {
      return [
        '❌ ERROR DE AISLAMIENTO',
        '══════════════════════',
        result.message
      ];
    }
  }

  private handleRestore(): string[] {
    const result = defenseSystem.executeDefense('restore');
    
    if (result.success) {
      return [
        '🔄 RESTAURACIÓN INICIADA',
        '═══════════════════════',
        result.message,
        `Duración: ${Math.ceil((result.duration || 0) / 1000)}s`,
        `Recursos: CPU ${result.resourceCost?.cpu}% | RAM ${result.resourceCost?.ram}MB`
      ];
    } else {
      return [
        '❌ ERROR DE RESTAURACIÓN',
        '════════════════════════',
        result.message
      ];
    }
  }

  private handlePanic(): string[] {
    const result = defenseSystem.executeDefense('panic');
    
    if (result.success) {
      // Force disconnect and return to localhost
      if (this.gameStateUpdater) {
        this.gameStateUpdater({ 
          currentNode: 'localhost',
          currentDirectory: '/home/user'
        });
      }
      
      return [
        '🚨🚨🚨 PÁNICO ACTIVADO 🚨🚨🚨',
        '═══════════════════════════',
        '',
        '⚡ DESCONEXIÓN INMEDIATA EJECUTADA',
        '✅ Retornado a localhost con seguridad',
        '',
        `⏱️ Cooldown: ${Math.ceil((result.cooldown || 0) / 1000 / 60)} minutos`
      ];
    } else {
      return [
        '❌ ERROR DE PÁNICO',
        '══════════════════',
        result.message
      ];
    }
  }
}
