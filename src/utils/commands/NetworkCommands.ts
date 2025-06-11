import { NetworkScanner } from '../NetworkScanner';
import { FileSystemManager } from '../FileSystemManager';

export class NetworkCommands {
  private gameStateUpdater: ((updates: any) => void) | null = null;
  private deviceDiscoverer: ((device: any) => void) | null = null;

  setGameStateFunctions(updateGameState: (updates: any) => void, discoverDevice: (device: any) => void) {
    this.gameStateUpdater = updateGameState;
    this.deviceDiscoverer = discoverDevice;
  }

  async handleScan(args: string[], currentNode: string = 'localhost', discoveredDevices: any[] = []): Promise<string[]> {
    console.log('[NetworkCommands] Starting scan from node:', currentNode);
    console.log('[NetworkCommands] Currently discovered devices:', discoveredDevices);
    
    // Perform network scan
    const scanResults = NetworkScanner.performScan(currentNode, discoveredDevices);
    const fsManager = FileSystemManager.getInstance();
    
    // Add discovered devices to game state and ensure they have file systems
    if (this.deviceDiscoverer) {
      scanResults.forEach(device => {
        console.log(`[NetworkCommands] Adding device: ${device.hostname} (${device.ip})`);
        
        // Initialize file system for the device
        fsManager.getFileSystem(device.ip, '/');
        
        this.deviceDiscoverer!({
          ip: device.ip,
          hostname: device.hostname,
          type: device.type,
          security: device.security,
          os: device.os,
          discovered: true,
          compromised: device.compromised
        });
      });
    }

    // Update scanned nodes list
    if (this.gameStateUpdater) {
      const newScannedNodes = scanResults.map(device => device.ip);
      const allScannedNodes = [...new Set([...discoveredDevices.map(d => d.ip), ...newScannedNodes])];
      console.log('[NetworkCommands] Updating scanned nodes:', allScannedNodes);
      
      this.gameStateUpdater({
        scannedNodes: allScannedNodes
      });
    }

    // Return formatted output
    const output = NetworkScanner.formatScanOutput(scanResults);
    console.log('[NetworkCommands] Scan completed, found', scanResults.length, 'devices');
    return output;
  }

  async handleProbe(args: string[], discoveredDevices: any[] = []): Promise<string[]> {
    if (args.length === 0) {
      return ['Usage: probe <target_ip>', 'Example: probe 192.168.1.50'];
    }

    const targetIp = args[0];
    const device = discoveredDevices.find(d => d.ip === targetIp);
    
    if (!device) {
      return [
        `No device found at ${targetIp}`,
        'Use "scan" to discover devices on the network.',
        'You can only probe devices that have been discovered.'
      ];
    }

    const output = [
      `Probing device: ${targetIp}`,
      `Hostname: ${device.hostname}`,
      `Type: ${device.type}`,
      `OS: ${device.os}`,
      `Security Level: ${device.security.toUpperCase()}`,
      `Status: ${device.compromised ? 'COMPROMISED' : 'SECURED'}`,
      '',
      'Port scan results:'
    ];

    // Simulate port scanning based on device type
    const ports = this.getDevicePorts(device.type);
    ports.forEach(port => {
      const service = this.getServiceForPort(port);
      output.push(`  Port ${port}/tcp: open (${service})`);
    });

    output.push('');
    output.push('Use "connect <ip>" to attempt connection.');
    if (!device.compromised) {
      output.push('Use hacking tools like "sshcrack", "ftpbounce", etc. to gain access.');
    }

    return output;
  }

  async handleConnect(args: string[], discoveredDevices: any[] = []): Promise<string[]> {
    if (args.length === 0) {
      return ['Usage: connect <target_ip>', 'Example: connect 192.168.1.50'];
    }

    const targetIp = args[0];
    const device = discoveredDevices.find(d => d.ip === targetIp);
    
    if (!device) {
      return [
        `No route to host ${targetIp}`,
        'Device not found in discovered networks.',
        'Use "scan" to discover devices first.'
      ];
    }

    if (!device.compromised) {
      return [
        `Connection to ${targetIp} failed: Access denied`,
        `Target: ${device.hostname}`,
        `Security: ${device.security.toUpperCase()}`,
        '',
        'You need to compromise this system first.',
        'Try using: sshcrack, ftpbounce, webserverworm, or porthack'
      ];
    }
    
    // Update current node in game state
    if (this.gameStateUpdater) {
      this.gameStateUpdater({ currentNode: targetIp });
    }
    
    return [
      `Connected to ${targetIp}`,
      `Hostname: ${device.hostname}`,
      `OS: ${device.os}`,
      `Access Level: ROOT`,
      '',
      'Connection established successfully.',
      'You can now execute commands on this system.'
    ];
  }

  handleDisconnect(): string[] {
    // Return to localhost
    if (this.gameStateUpdater) {
      this.gameStateUpdater({ currentNode: 'localhost' });
    }
    return [
      'Disconnected from remote system.',
      'Returned to localhost (127.0.0.1)',
      'Connection terminated.'
    ];
  }

  private getDevicePorts(type: string): number[] {
    const portMap = {
      'Server': [22, 21, 80, 443, 25, 53],
      'Workstation': [22, 80, 3389],
      'Router': [22, 23, 80, 161],
      'Firewall': [22, 80, 443, 514],
      'Personal Computer': [22, 80, 443]
    };
    return portMap[type as keyof typeof portMap] || [22, 80];
  }

  private getServiceForPort(port: number): string {
    const serviceMap: { [key: number]: string } = {
      21: 'FTP',
      22: 'SSH',
      23: 'TELNET',
      25: 'SMTP',
      53: 'DNS',
      80: 'HTTP',
      110: 'POP3',
      143: 'IMAP',
      161: 'SNMP',
      443: 'HTTPS',
      514: 'SYSLOG',
      3389: 'RDP',
      5900: 'VNC'
    };
    return serviceMap[port] || 'UNKNOWN';
  }
}
