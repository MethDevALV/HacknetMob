
import { GameState, NetworkNode } from '../types/CoreTypes';

interface Port {
  port: number;
  service: string;
  version: string;
}

class HackNetEngineNative {
  private gameState: GameState | null = null;
  private updateGameState: ((updates: Partial<GameState>) => void) | null = null;

  initialize(gameState: GameState, updateGameState: (updates: Partial<GameState>) => void) {
    this.gameState = gameState;
    this.updateGameState = updateGameState;
    console.log('[HackNetEngineNative] Initialized');
  }

  async executeCommand(input: string): Promise<string[]> {
    if (!this.gameState || !this.updateGameState) {
      return ['Error: Engine not initialized'];
    }

    const args = input.trim().split(' ');
    const command = args[0].toLowerCase();
    const output: string[] = [];

    try {
      switch (command) {
        case 'help':
          output.push('Available Commands:');
          output.push('─────────────────');
          output.push('help          - Show this help');
          output.push('scan          - Discover nearby devices');
          output.push('probe <ip>    - Analyze target ports');
          output.push('connect <ip>  - Connect to compromised node');
          output.push('ls            - List directory contents');
          output.push('cat <file>    - Display file contents');
          output.push('pwd           - Show current directory');
          output.push('cd <dir>      - Change directory');
          output.push('clear         - Clear terminal');
          output.push('netmap        - Show network topology');
          output.push('sshcrack <ip> - Exploit SSH vulnerabilities');
          output.push('disconnect    - Return to localhost');
          break;

        case 'scan':
          output.push('Scanning local network...');
          output.push('');
          await this.simulateDelay(1500);
          
          const discoveredDevices = this.generateNetworkDevices();
          this.updateGameState({ discoveredDevices });
          
          output.push('Devices discovered:');
          discoveredDevices.forEach(device => {
            const status = device.compromised ? '[COMPROMISED]' : '[SECURED]';
            output.push(`${device.ip.padEnd(15)} ${device.hostname.padEnd(20)} ${status}`);
          });
          output.push('');
          output.push(`Total devices found: ${discoveredDevices.length}`);
          break;

        case 'probe':
          if (args.length < 2) {
            output.push('Usage: probe <ip_address>');
            break;
          }
          
          const targetIp = args[1];
          const targetDevice = this.gameState.discoveredDevices?.find(d => d.ip === targetIp);
          
          if (!targetDevice) {
            output.push(`Error: Device ${targetIp} not found. Run 'scan' first.`);
            break;
          }

          output.push(`Probing ${targetIp}...`);
          output.push('');
          await this.simulateDelay(1000);
          
          output.push(`Host: ${targetDevice.hostname}`);
          output.push(`IP: ${targetDevice.ip}`);
          output.push(`OS: ${targetDevice.os}`);
          output.push(`Type: ${targetDevice.type}`);
          output.push(`Security Level: ${targetDevice.security.toUpperCase()}`);
          output.push('');
          output.push('Open Ports:');
          
          // Get port details from the device's ports array
          targetDevice.ports?.forEach(port => {
            if (port.open) {
              output.push(`  ${port.number}/tcp    ${port.service.padEnd(10)} ${port.version}`);
            }
          });
          
          if (targetDevice.compromised) {
            output.push('');
            output.push('Status: COMPROMISED - Ready for connection');
          }
          break;

        case 'connect':
          if (args.length < 2) {
            output.push('Usage: connect <ip_address>');
            break;
          }
          
          const connectIp = args[1];
          const connectDevice = this.gameState.discoveredDevices?.find(d => d.ip === connectIp);
          
          if (!connectDevice) {
            output.push(`Error: Device ${connectIp} not found.`);
            break;
          }
          
          if (!connectDevice.compromised) {
            output.push(`Error: Device ${connectIp} is not compromised. Use attack tools first.`);
            break;
          }

          output.push(`Connecting to ${connectIp}...`);
          await this.simulateDelay(800);
          output.push('Connection established.');
          
          this.updateGameState({
            currentNode: connectDevice.hostname,
            currentDirectory: '/root'
          });
          break;

        case 'sshcrack':
          if (args.length < 2) {
            output.push('Usage: sshcrack <ip_address>');
            break;
          }

          if (!this.gameState.unlockedTools.includes('SSHcrack')) {
            output.push('Error: SSHcrack tool not available. Check your toolkit.');
            break;
          }
          
          const sshTargetIp = args[1];
          const sshTarget = this.gameState.discoveredDevices?.find(d => d.ip === sshTargetIp);
          
          if (!sshTarget) {
            output.push(`Error: Device ${sshTargetIp} not found.`);
            break;
          }

          const sshPort = sshTarget.ports?.find(p => p.number === 22 && p.open);
          if (!sshPort) {
            output.push(`Error: SSH service not found on ${sshTargetIp}`);
            break;
          }

          output.push(`Launching SSH attack on ${sshTargetIp}...`);
          output.push('Attempting brute force...');
          await this.simulateDelay(2000);
          
          const success = Math.random() > 0.3; // 70% success rate
          if (success) {
            output.push('SSH credentials cracked!');
            output.push('Root access obtained.');
            
            // Update device as compromised
            const updatedDevices = this.gameState.discoveredDevices?.map(d => 
              d.ip === sshTargetIp ? { ...d, compromised: true } : d
            ) || [];
            
            this.updateGameState({ 
              discoveredDevices: updatedDevices,
              compromisedNodes: [...(this.gameState.compromisedNodes || []), sshTargetIp]
            });
          } else {
            output.push('SSH attack failed. Target may have updated security.');
            // Increase trace level
            const newTraceLevel = Math.min((this.gameState.traceLevel || 0) + 15, 100);
            this.updateGameState({ traceLevel: newTraceLevel });
            output.push(`Warning: Trace level increased to ${newTraceLevel}%`);
          }
          break;

        case 'ls':
          output.push('Listing directory contents...');
          output.push('');
          if (this.gameState.currentNode === 'localhost') {
            output.push('Desktop/');
            output.push('Documents/');
            output.push('Downloads/');
            output.push('hacknet_tools/');
            output.push('readme.txt');
            output.push('login.txt');
          } else {
            output.push('bin/');
            output.push('etc/');
            output.push('home/');
            output.push('var/');
            output.push('shadow.db');
            output.push('system.log');
          }
          break;

        case 'pwd':
          output.push(this.gameState.currentDirectory || '/home/user');
          break;

        case 'netmap':
          output.push('Network Topology:');
          output.push('═══════════════');
          output.push('');
          this.gameState.discoveredDevices?.forEach(device => {
            const status = device.compromised ? '●' : '○';
            const security = device.security === 'high' ? '🔒' : device.security === 'medium' ? '🔐' : '🔓';
            output.push(`${status} ${device.ip} - ${device.hostname} ${security}`);
          });
          break;

        case 'disconnect':
          if (this.gameState.currentNode === 'localhost') {
            output.push('Already on localhost.');
            break;
          }
          
          output.push('Disconnecting...');
          await this.simulateDelay(500);
          output.push('Returned to localhost.');
          
          this.updateGameState({
            currentNode: 'localhost',
            currentDirectory: '/home/user'
          });
          break;

        default:
          output.push(`Command not found: ${command}`);
          output.push('Type "help" for available commands.');
          break;
      }
    } catch (error) {
      output.push(`Error executing command: ${error}`);
    }

    return output;
  }

  private generateNetworkDevices(): NetworkNode[] {
    const devices: NetworkNode[] = [
      {
        id: 'gateway-1',
        name: 'gateway.local',
        ip: '192.168.1.1',
        hostname: 'gateway.local',
        type: 'router',
        os: 'RouterOS 6.47',
        security: 'medium',
        openPorts: [22, 80, 443],
        services: ['ssh', 'http', 'https'],
        ports: [
          { number: 22, service: 'ssh', open: true, cracked: false, version: 'OpenSSH 8.0' },
          { number: 80, service: 'http', open: true, cracked: false, version: 'nginx 1.18' },
          { number: 443, service: 'https', open: true, cracked: false, version: 'nginx 1.18' }
        ],
        compromised: false,
        discovered: true,
        x: 100,
        y: 100,
        connections: ['192.168.1.10', '192.168.1.50'],
        links: ['192.168.1.10', '192.168.1.50'],
        difficulty: 'medium',
        organization: 'Local Network'
      },
      {
        id: 'fileserver-1',
        name: 'fileserver',
        ip: '192.168.1.10',
        hostname: 'fileserver',
        type: 'server',
        os: 'Ubuntu 20.04 LTS',
        security: 'low',
        openPorts: [21, 22, 445],
        services: ['ftp', 'ssh', 'smb'],
        ports: [
          { number: 21, service: 'ftp', open: true, cracked: false, version: 'vsftpd 3.0.3' },
          { number: 22, service: 'ssh', open: true, cracked: false, version: 'OpenSSH 8.2' },
          { number: 445, service: 'smb', open: true, cracked: false, version: 'Samba 4.11' }
        ],
        compromised: false,
        discovered: true,
        x: 200,
        y: 150,
        connections: ['192.168.1.1'],
        links: ['192.168.1.1'],
        difficulty: 'easy',
        organization: 'Local Network'
      },
      {
        id: 'workstation-1',
        name: 'workstation-01',
        ip: '192.168.1.50',
        hostname: 'workstation-01',
        type: 'workstation',
        os: 'Windows 10 Pro',
        security: 'medium',
        openPorts: [135, 445, 3389],
        services: ['rpc', 'smb', 'rdp'],
        ports: [
          { number: 135, service: 'rpc', open: true, cracked: false, version: 'Microsoft RPC' },
          { number: 445, service: 'smb', open: true, cracked: false, version: 'SMBv3' },
          { number: 3389, service: 'rdp', open: true, cracked: false, version: 'Microsoft RDP' }
        ],
        compromised: false,
        discovered: true,
        x: 300,
        y: 100,
        connections: ['192.168.1.1'],
        links: ['192.168.1.1'],
        difficulty: 'medium',
        organization: 'Local Network'
      }
    ];

    return devices;
  }

  private async simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const hackNetEngineNative = new HackNetEngineNative();
