
// Complete HackNet network system
import { NetworkNode, Port, FileEntry, Service } from '../types/HackNetTypes';

export class NetworkSystem {
  private static instance: NetworkSystem;
  private networkNodes: Map<string, NetworkNode> = new Map();

  static getInstance(): NetworkSystem {
    if (!NetworkSystem.instance) {
      NetworkSystem.instance = new NetworkSystem();
    }
    return NetworkSystem.instance;
  }

  constructor() {
    this.initializeHackNetNetwork();
  }

  private initializeHackNetNetwork(): void {
    // Player's home system
    this.addNode({
      ip: '127.0.0.1',
      hostname: 'localhost',
      type: 'personal',
      security: 'none',
      os: 'Linux',
      ports: [
        { number: 22, service: 'SSH', open: true, cracked: true }
      ],
      files: [
        { name: 'home', path: '/', type: 'directory', size: 0, permissions: 'drwxr-xr-x' },
        { name: 'bin', path: '/', type: 'directory', size: 0, permissions: 'drwxr-xr-x' },
        { name: 'log', path: '/', type: 'directory', size: 0, permissions: 'drwxr-xr-x' },
        { name: 'sys', path: '/', type: 'directory', size: 0, permissions: 'drwxr-xr-x' },
        { name: 'SecurityTracer.exe', path: '/bin', type: 'file', size: 2048, permissions: '-rwxr--r--' },
        { name: 'x-server.sys', path: '/sys', type: 'file', size: 4096, permissions: '-rw-r--r--' }
      ],
      services: [
        { name: 'SSH', port: 22, vulnerable: false }
      ],
      discovered: true,
      compromised: true,
      links: ['192.168.1.50']
    });

    // Viper Battlestation - Tutorial target
    this.addNode({
      ip: '192.168.1.50',
      hostname: 'viper-battlestation',
      type: 'personal',
      security: 'basic',
      os: 'Windows',
      ports: [
        { number: 22, service: 'SSH', open: true, cracked: false }
      ],
      files: [
        { name: 'bin', path: '/', type: 'directory', size: 0, permissions: 'drwxr-xr-x' },
        { name: 'SSHcrack.exe', path: '/bin', type: 'file', size: 1024, permissions: '-rwxr--r--' }
      ],
      services: [
        { name: 'SSH', port: 22, vulnerable: true, exploitRequired: 'SSHcrack.exe' }
      ],
      discovered: false,
      compromised: false,
      links: ['10.0.0.25', '127.0.0.1']
    });

    // Bitwise Test PC
    this.addNode({
      ip: '10.0.0.25',
      hostname: 'bitwise-test-pc',
      type: 'personal',
      security: 'basic',
      os: 'Linux',
      ports: [
        { number: 22, service: 'SSH', open: true, cracked: false }
      ],
      files: [
        { name: 'home', path: '/', type: 'directory', size: 0, permissions: 'drwxr-xr-x' },
        { name: 'test_data.txt', path: '/home', type: 'file', size: 512, permissions: '-rw-r--r--' }
      ],
      services: [
        { name: 'SSH', port: 22, vulnerable: true, exploitRequired: 'SSHcrack.exe' }
      ],
      discovered: false,
      compromised: false,
      links: ['172.16.0.10', '192.168.1.50']
    });

    // P.Anderson PC
    this.addNode({
      ip: '172.16.0.10',
      hostname: 'panderson-pc',
      type: 'personal',
      security: 'standard',
      os: 'Windows',
      ports: [
        { number: 22, service: 'SSH', open: true, cracked: false },
        { number: 21, service: 'FTP', open: true, cracked: false }
      ],
      files: [
        { name: 'log', path: '/', type: 'directory', size: 0, permissions: 'drwxr-xr-x' },
        { name: 'Documents', path: '/', type: 'directory', size: 0, permissions: 'drwxr-xr-x' },
        { name: 'access.log', path: '/log', type: 'file', size: 1024, permissions: '-rw-r--r--' },
        { name: 'system.log', path: '/log', type: 'file', size: 2048, permissions: '-rw-r--r--' },
        { name: 'security.log', path: '/log', type: 'file', size: 1536, permissions: '-rw-r--r--' }
      ],
      services: [
        { name: 'SSH', port: 22, vulnerable: true, exploitRequired: 'SSHcrack.exe' },
        { name: 'FTP', port: 21, vulnerable: true, exploitRequired: 'FTPBounce.exe' }
      ],
      discovered: false,
      compromised: false,
      links: ['203.0.113.15', '10.0.0.25']
    });

    // Entropy Server
    this.addNode({
      ip: '203.0.113.15',
      hostname: 'entropy-server',
      type: 'server',
      security: 'high',
      os: 'Unix',
      ports: [
        { number: 22, service: 'SSH', open: true, cracked: false },
        { number: 21, service: 'FTP', open: true, cracked: false },
        { number: 25, service: 'SMTP', open: true, cracked: false }
      ],
      files: [
        { name: 'home', path: '/', type: 'directory', size: 0, permissions: 'drwxr-xr-x' },
        { name: 'test', path: '/home', type: 'directory', size: 0, permissions: 'drwxr-xr-x' },
        { name: 'Entropy_Test.exe', path: '/home/test', type: 'file', size: 4096, permissions: '-rwxr--r--' }
      ],
      services: [
        { name: 'SSH', port: 22, vulnerable: true, exploitRequired: 'SSHcrack.exe' },
        { name: 'FTP', port: 21, vulnerable: true, exploitRequired: 'FTPBounce.exe' },
        { name: 'SMTP', port: 25, vulnerable: true, exploitRequired: 'relaySMTP.exe' }
      ],
      discovered: false,
      compromised: false,
      adminPassword: 'entropy123',
      links: ['192.0.2.100', '172.16.0.10']
    });

    // Entropy Assets Server
    this.addNode({
      ip: '192.0.2.100',
      hostname: 'entropy-assets',
      type: 'server',
      security: 'standard',
      os: 'Linux',
      ports: [
        { number: 22, service: 'SSH', open: true, cracked: false },
        { number: 21, service: 'FTP', open: true, cracked: false }
      ],
      files: [
        { name: 'bin', path: '/', type: 'directory', size: 0, permissions: 'drwxr-xr-x' },
        { name: 'FTPBounce.exe', path: '/bin', type: 'file', size: 1536, permissions: '-rwxr--r--' }
      ],
      services: [
        { name: 'SSH', port: 22, vulnerable: true, exploitRequired: 'SSHcrack.exe' },
        { name: 'FTP', port: 21, vulnerable: true, exploitRequired: 'FTPBounce.exe' }
      ],
      discovered: false,
      compromised: false,
      links: ['203.0.113.15']
    });
  }

  private addNode(node: NetworkNode): void {
    this.networkNodes.set(node.ip, node);
  }

  getNode(ip: string): NetworkNode | undefined {
    return this.networkNodes.get(ip);
  }

  getAllNodes(): NetworkNode[] {
    return Array.from(this.networkNodes.values());
  }

  getDiscoveredNodes(): NetworkNode[] {
    return Array.from(this.networkNodes.values()).filter(node => node.discovered);
  }

  discoverNode(ip: string): boolean {
    const node = this.networkNodes.get(ip);
    if (node) {
      node.discovered = true;
      return true;
    }
    return false;
  }

  compromiseNode(ip: string): boolean {
    const node = this.networkNodes.get(ip);
    if (node) {
      node.compromised = true;
      return true;
    }
    return false;
  }

  crackPort(ip: string, port: number): boolean {
    const node = this.networkNodes.get(ip);
    if (node) {
      const portObj = node.ports.find(p => p.number === port);
      if (portObj) {
        portObj.cracked = true;
        return true;
      }
    }
    return false;
  }

  getConnectedNodes(currentIp: string): string[] {
    const node = this.networkNodes.get(currentIp);
    return node ? node.links : [];
  }

  // Scan for nodes connected to current node
  scanNetwork(currentIp: string): string[] {
    const node = this.networkNodes.get(currentIp);
    if (!node) return [];

    const connectedIps: string[] = [];
    node.links.forEach(ip => {
      const connectedNode = this.networkNodes.get(ip);
      if (connectedNode) {
        connectedNode.discovered = true;
        connectedIps.push(ip);
      }
    });

    return connectedIps;
  }

  // Probe a specific node for open ports
  probeNode(ip: string): Port[] {
    const node = this.networkNodes.get(ip);
    if (!node || !node.discovered) return [];

    return node.ports.filter(port => port.open);
  }

  // Get files in a directory
  getFiles(ip: string, path: string = '/'): FileEntry[] {
    const node = this.networkNodes.get(ip);
    if (!node || !node.compromised) return [];

    return node.files.filter(file => {
      if (path === '/') {
        return file.path === '/' || file.path === '';
      }
      return file.path === path;
    });
  }

  // Delete a file
  deleteFile(ip: string, path: string, filename: string): boolean {
    const node = this.networkNodes.get(ip);
    if (!node || !node.compromised) return false;

    const fileIndex = node.files.findIndex(file => 
      file.name === filename && (file.path === path || file.path + '/' === path)
    );

    if (fileIndex !== -1) {
      node.files.splice(fileIndex, 1);
      return true;
    }

    return false;
  }

  // Download a file
  downloadFile(ip: string, filename: string): FileEntry | null {
    const node = this.networkNodes.get(ip);
    if (!node || !node.compromised) return null;

    const file = node.files.find(f => f.name === filename);
    return file || null;
  }
}

export const networkSystem = NetworkSystem.getInstance();
