
import { HACKNET_TOOLS } from '../HackingToolsEnhanced';
import { getDeviceByIp, getAllHacknetDevices } from '../HacknetDevices';

export class HacknetCommands {
  private gameStateUpdater: ((updates: any) => void) | null = null;
  private gameState: any = null;

  setGameState(gameState: any, updateGameState: (updates: any) => void) {
    this.gameState = gameState;
    this.gameStateUpdater = updateGameState;
  }

  async handleToolExecution(toolName: string, args: string[]): Promise<string[]> {
    const tool = HACKNET_TOOLS[toolName];
    if (!tool) {
      return [`Error: ${toolName} not found`];
    }

    if (!tool.acquired) {
      return [`Error: ${toolName} not acquired. Find it on a compromised system.`];
    }

    const target = args[0];
    if (!target && tool.type === 'port_cracking') {
      return [`Usage: ${toolName} <target_ip>`];
    }

    // Check RAM requirements
    const currentRam = this.gameState?.usedRAM || 0;
    const totalRam = this.gameState?.totalRAM || 8;
    const ramNeeded = tool.ramUsage / 1000; // Convert MB to GB

    if (currentRam + ramNeeded > totalRam) {
      return [`Error: Insufficient RAM. Need ${ramNeeded}GB, have ${totalRam - currentRam}GB available`];
    }

    // Execute tool based on type
    switch (tool.type) {
      case 'port_cracking':
        return this.executePortCrackingTool(tool, target);
      case 'defense':
        return this.executeDefenseTool(tool);
      case 'mobile_scanning':
        return this.executeMobileScanningTool(tool);
      case 'file_processing':
        return this.executeFileProcessingTool(tool, args);
      default:
        return this.executeGenericTool(tool, args);
    }
  }

  private async executePortCrackingTool(tool: any, target: string): Promise<string[]> {
    const device = getDeviceByIp(target);
    if (!device) {
      return [`Error: No device found at ${target}`];
    }

    if (!device.ports.includes(tool.target)) {
      return [`Error: ${device.name} does not have ${tool.target} service running`];
    }

    // Update game state to track cracked ports
    if (this.gameStateUpdater) {
      this.gameStateUpdater({
        crackedPorts: [
          ...(this.gameState.crackedPorts || []),
          `${target}:${tool.target}`
        ],
        usedRAM: (this.gameState.usedRAM || 0) + (tool.ramUsage / 1000)
      });
    }

    return [
      `Executing ${tool.name} on ${target}:${tool.port}...`,
      `Targeting ${tool.target} service`,
      'Use "ps" to monitor progress'
    ];
  }

  private async executeDefenseTool(tool: any): Promise<string[]> {
    switch (tool.function) {
      case 'stop_all_traces':
        if (this.gameStateUpdater) {
          this.gameStateUpdater({
            traceLevel: 0
          });
        }
        return [
          'TraceKill.exe executed successfully',
          'All active traces terminated',
          'Trace level reset to 0'
        ];
      default:
        return [`${tool.name} executed`];
    }
  }

  private async executeMobileScanningTool(tool: any): Promise<string[]> {
    const currentDevice = this.gameState?.currentNode;
    if (!currentDevice || currentDevice === 'localhost') {
      return ['Error: Must be connected to a device to scan for mobile devices'];
    }

    // Simulate finding eOS devices
    const eosDevices = [
      "Jason's ePhone 4S - admin:alpine",
      "Mica's ePhone 4S - admin:alpine"
    ];

    return [
      'Scanning for eOS devices...',
      'eOS Device Scanner v3.2 - Scanning network...',
      '',
      'Found eOS devices:',
      ...eosDevices.map(device => `  - ${device}`),
      '',
      'Use: connect <device_name> to access eOS device'
    ];
  }

  private async executeFileProcessingTool(tool: any, args: string[]): Promise<string[]> {
    const filename = args[0];
    if (!filename) {
      return [`Usage: ${tool.name} <filename>`];
    }

    switch (tool.function) {
      case 'decrypt_dec_files':
        if (!filename.endsWith('.enc')) {
          return ['Error: File is not encrypted or wrong format'];
        }

        // Simulate decryption process
        const decryptedName = filename.replace('.enc', '.dec');
        
        if (this.gameStateUpdater) {
          this.gameStateUpdater({
            decryptedFiles: [
              ...(this.gameState.decryptedFiles || []),
              decryptedName
            ]
          });
        }

        return [
          `Decrypting ${filename}...`,
          'Decryption successful',
          `File saved as: ${decryptedName}`
        ];
      default:
        return [`${tool.name} processing ${filename}...`];
    }
  }

  private async executeGenericTool(tool: any, args: string[]): Promise<string[]> {
    return [
      `Executing ${tool.name}...`,
      `Function: ${tool.function || 'Generic execution'}`,
      'Process completed'
    ];
  }

  async handleSolveCommand(args: string[]): Promise<string[]> {
    const password = args[0];
    if (!password) {
      return ['Usage: solve <password>'];
    }

    const currentDevice = getDeviceByIp(this.gameState?.currentNode);
    if (!currentDevice) {
      return ['Error: Not connected to any device'];
    }

    if (!currentDevice.security?.firewall) {
      return ['Error: No firewall to solve on this device'];
    }

    if (password === currentDevice.security.firewallPassword) {
      if (this.gameStateUpdater) {
        this.gameStateUpdater({
          bypassedFirewalls: [
            ...(this.gameState.bypassedFirewalls || []),
            currentDevice.ip
          ]
        });
      }

      return [
        'Firewall bypassed successfully!',
        'Root access granted',
        'All system functions now available'
      ];
    } else {
      return [
        'Error: Incorrect password',
        'Firewall remains active',
        'Try again with correct password'
      ];
    }
  }

  async handleShellCommand(args: string[]): Promise<string[]> {
    const currentDevice = getDeviceByIp(this.gameState?.currentNode);
    if (!currentDevice) {
      return ['Error: Must be connected to a device'];
    }

    if (!currentDevice.security?.proxy) {
      return ['No proxy detected on this device'];
    }

    const activeShells = (this.gameState?.activeShells || 0) + 1;
    const requiredShells = currentDevice.proxyBypass?.shellsRequired || 3;

    if (this.gameStateUpdater) {
      this.gameStateUpdater({
        activeShells: activeShells
      });
    }

    const output = [
      `Shell executed successfully`,
      `Active shells: ${activeShells}/${requiredShells}`
    ];

    if (activeShells >= requiredShells) {
      output.push('Proxy bypassed! Device access granted');
    } else {
      output.push(`Need ${requiredShells - activeShells} more shells to bypass proxy`);
    }

    return output;
  }

  async handleDatabaseCommands(command: string, args: string[]): Promise<string[]> {
    const currentDevice = getDeviceByIp(this.gameState?.currentNode);
    if (!currentDevice) {
      return ['Error: Not connected to any device'];
    }

    switch (currentDevice.type) {
      case 'medical_database':
        return this.handleMedicalDatabaseCommands(command, args);
      case 'criminal_database':
        return this.handleCriminalDatabaseCommands(command, args);
      case 'academic_database':
        return this.handleAcademicDatabaseCommands(command, args);
      default:
        return ['Error: Current device does not support database commands'];
    }
  }

  private async handleMedicalDatabaseCommands(command: string, args: string[]): Promise<string[]> {
    switch (command) {
      case 'searchPatient':
        const patientName = args.join(' ');
        if (!patientName) return ['Usage: searchPatient <patient_name>'];
        
        return [
          `Searching for patient: ${patientName}`,
          'Search Results:',
          '  John Doe - ID: 12345 - Condition: Classified',
          '  Jane Smith - ID: 67890 - Condition: Classified',
          'Use: sendRecords <patient_id> to transmit'
        ];
      
      case 'sendRecords':
        const patientId = args[0];
        if (!patientId) return ['Usage: sendRecords <patient_id>'];
        
        return [
          `Transmitting records for patient ID: ${patientId}`,
          'Records sent successfully',
          'Transmission logged'
        ];
      
      default:
        return [`Unknown medical database command: ${command}`];
    }
  }

  private async handleCriminalDatabaseCommands(command: string, args: string[]): Promise<string[]> {
    switch (command) {
      case 'searchInmate':
        const inmateId = args[0];
        if (!inmateId) return ['Usage: searchInmate <inmate_id>'];
        
        return [
          `Searching for inmate ID: ${inmateId}`,
          'Search Results:',
          '  Inmate ID: 00123 - Name: CLASSIFIED - Status: Death Row',
          '  Inmate ID: 00456 - Name: CLASSIFIED - Status: Life Sentence'
        ];
      
      case 'deleteRecord':
        const recordId = args[0];
        if (!recordId) return ['Usage: deleteRecord <record_id>'];
        
        return [
          `Deleting record: ${recordId}`,
          'Record permanently deleted from database',
          'Deletion logged and irreversible'
        ];
      
      default:
        return [`Unknown criminal database command: ${command}`];
    }
  }

  private async handleAcademicDatabaseCommands(command: string, args: string[]): Promise<string[]> {
    switch (command) {
      case 'addDegree':
        const [student, degree] = args;
        if (!student || !degree) return ['Usage: addDegree <student_name> <degree>'];
        
        return [
          `Adding degree "${degree}" for student "${student}"`,
          'Degree added successfully',
          'Academic record updated'
        ];
      
      case 'modifyGpa':
        const [studentName, newGpa] = args;
        if (!studentName || !newGpa) return ['Usage: modifyGpa <student_name> <new_gpa>'];
        
        return [
          `Modifying GPA for ${studentName} to ${newGpa}`,
          'GPA updated successfully',
          'Academic record modified'
        ];
      
      default:
        return [`Unknown academic database command: ${command}`];
    }
  }
}

export const hacknetCommands = new HacknetCommands();
