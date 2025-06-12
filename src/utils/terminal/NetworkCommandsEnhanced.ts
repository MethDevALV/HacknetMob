
import { systemResourcesEnhanced } from '../SystemResourcesEnhanced';
import { networkSystemEnhanced } from '../../systems/NetworkSystemEnhanced';
import { terminalCore } from './TerminalCore';
import { NetworkNode } from '../../types/CoreTypes';

export class NetworkCommandsEnhanced {
  static async handleScan(): Promise<string[]> {
    const processStarted = systemResourcesEnhanced.startProcess({
      name: 'Network Scan',
      cpuUsage: 15,
      ramUsage: 32,
      networkUsage: 50,
      duration: 3000
    });

    if (!processStarted) {
      return ['Error: Insufficient system resources for network scan.'];
    }

    const currentNode = terminalCore.getCurrentNode();
    const discoveredDevices = terminalCore.getDiscoveredDevices();
    
    // Create mock devices with proper NetworkNode interface
    const mockDevices: NetworkNode[] = [
      {
        id: 'dev001',
        name: 'DESKTOP-DEV001',
        ip: '192.168.1.50',
        hostname: 'DESKTOP-DEV001',
        type: 'workstation',
        os: 'Linux Ubuntu 20.04',
        security: 'medium',
        compromised: false,
        discovered: true,
        connections: [],
        x: 100,
        y: 100,
        services: ['ssh', 'http'],
        links: [],
        openPorts: [22, 80],
        difficulty: 'medium',
        ports: [
          { number: 22, service: 'SSH', open: true, cracked: false, version: '2.0' },
          { number: 80, service: 'HTTP', open: true, cracked: false, version: '1.1' }
        ]
      },
      {
        id: 'srv001',
        name: 'CORP-SERVER-01',
        ip: '10.0.0.25',
        hostname: 'CORP-SERVER-01',
        type: 'server',
        os: 'Windows Server 2019',
        security: 'high',
        compromised: false,
        discovered: true,
        connections: [],
        x: 200,
        y: 150,
        services: ['ssh', 'http', 'https'],
        links: [],
        openPorts: [22, 80, 443],
        difficulty: 'hard',
        ports: [
          { number: 22, service: 'SSH', open: true, cracked: false, version: '2.0' },
          { number: 80, service: 'HTTP', open: true, cracked: false, version: '1.1' },
          { number: 443, service: 'HTTPS', open: true, cracked: false, version: '1.1' }
        ]
      }
    ];
    
    mockDevices.forEach(device => {
      terminalCore.discoverDevice(device);
    });

    const allDevices = terminalCore.getDiscoveredDevices();
    
    const output = [
      'Scanning network...',
      'Probing for active devices...',
      '',
      'SCAN RESULTS:',
      '============================================',
      ''
    ];

    allDevices.forEach(device => {
      output.push(`Device Found: ${device.hostname}`);
      output.push(`IP Address: ${device.ip}`);
      output.push(`Type: ${device.type}`);
      output.push(`OS: ${device.os}`);
      output.push(`Security: ${device.security.toUpperCase()}`);
      output.push(`Status: ${device.compromised ? 'COMPROMISED' : 'SECURED'}`);
      output.push('--------------------------------------------');
    });

    output.push('');
    output.push(`Scan complete. Found ${allDevices.length} device(s).`);
    output.push('Use "connect <ip>" to attempt connection.');

    terminalCore.updateScannedNodes(allDevices.map(d => d.ip));

    return output;
  }

  static async handleProbe(args: string[]): Promise<string[]> {
    if (args.length === 0) {
      return ['Usage: probe <target_ip>', 'Example: probe 192.168.1.50'];
    }

    const targetIp = args[0];
    const discoveredDevices = terminalCore.getDiscoveredDevices();
    const device = discoveredDevices.find(d => d.ip === targetIp);

    if (!device) {
      return [
        `No device found at ${targetIp}`,
        'Use "scan" to discover devices first.'
      ];
    }

    const processStarted = systemResourcesEnhanced.startProcess({
      name: `Probe ${targetIp}`,
      cpuUsage: 10,
      ramUsage: 64,
      networkUsage: 25,
      duration: 5000
    });

    if (!processStarted) {
      return ['Error: Insufficient system resources for probe operation.'];
    }

    return [
      `Probing ${targetIp}...`,
      '',
      `Target: ${device.hostname}`,
      `IP: ${device.ip}`,
      `OS: ${device.os}`,
      `Type: ${device.type}`,
      `Security Level: ${device.security.toUpperCase()}`,
      `Status: ${device.compromised ? 'COMPROMISED' : 'SECURED'}`,
      '',
      'Open Ports:',
      '  22/tcp  SSH     (Secure Shell)',
      '  80/tcp  HTTP    (Web Server)',
      '  443/tcp HTTPS   (Secure Web)',
      '',
      device.compromised 
        ? 'Device is compromised - you can connect directly.'
        : 'Device requires penetration tools to access.'
    ];
  }

  static async handleConnect(args: string[]): Promise<string[]> {
    if (args.length === 0) {
      return ['Usage: connect <target_ip>', 'Example: connect 192.168.1.50'];
    }

    const targetIp = args[0];
    const discoveredDevices = terminalCore.getDiscoveredDevices();
    const device = discoveredDevices.find(d => d.ip === targetIp);

    if (!device) {
      return [
        `No route to host ${targetIp}`,
        'Device not found in discovered networks.',
        'Use "scan" to discover devices first.'
      ];
    }

    if (!device.discovered) {
      return [
        `Device ${targetIp} not yet discovered`,
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
        'Try using: sshcrack <ip>'
      ];
    }

    terminalCore.setCurrentNode(targetIp);
    terminalCore.setCurrentDirectory('/');

    return [
      `Connected to ${targetIp}`,
      `Hostname: ${device.hostname}`,
      `OS: ${device.os}`,
      `Access Level: ROOT`,
      '',
      'Connection established successfully.'
    ];
  }

  static async handleDisconnect(): Promise<string[]> {
    terminalCore.setCurrentNode('localhost');
    terminalCore.setCurrentDirectory('/home/user');
    
    return [
      'Disconnected from remote system.',
      'Returned to localhost (127.0.0.1)'
    ];
  }
}

export const networkCommandsEnhanced = new NetworkCommandsEnhanced();
