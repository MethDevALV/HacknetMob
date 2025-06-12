
import { NetworkNode, FileEntry } from '../types/CoreTypes';

export class NetworkSystemEnhanced {
  private static instance: NetworkSystemEnhanced;
  private nodes: Map<string, NetworkNode> = new Map();
  private gameStateUpdater: ((updates: any) => void) | null = null;
  
  private defaultFiles: FileEntry[] = [
    { 
      name: 'system.log', 
      type: 'file', 
      size: 2048, 
      permissions: 'rw-r--r--', 
      modified: '2024-01-15 10:30', 
      content: 'System startup logs and events...', 
      hidden: false,
      lastModified: new Date(),
      path: '/var/log/system.log'
    },
    { 
      name: 'config.txt', 
      type: 'file', 
      size: 1024, 
      permissions: 'rw-r--r--', 
      modified: '2024-01-15 09:15', 
      content: 'Configuration settings for the system...', 
      hidden: false,
      lastModified: new Date(),
      path: '/etc/config.txt'
    },
    { 
      name: 'tmp', 
      type: 'directory', 
      size: 0, 
      permissions: 'rwxrwxrwx', 
      modified: '2024-01-15 08:00', 
      hidden: false,
      lastModified: new Date(),
      path: '/tmp'
    },
    { 
      name: 'secret.dat', 
      type: 'file', 
      size: 512, 
      permissions: 'rw-------', 
      modified: '2024-01-14 22:45', 
      content: 'Encrypted data file...', 
      hidden: false,
      lastModified: new Date(),
      path: '/home/user/secret.dat'
    },
    { 
      name: 'backup.zip', 
      type: 'file', 
      size: 4096, 
      permissions: 'rw-r-----', 
      modified: '2024-01-13 16:20', 
      content: 'Binary backup archive...', 
      hidden: false,
      lastModified: new Date(),
      path: '/backup/backup.zip'
    }
  ];

  private constructor() {
    this.initializeDefaultNodes();
  }

  static getInstance(): NetworkSystemEnhanced {
    if (!NetworkSystemEnhanced.instance) {
      NetworkSystemEnhanced.instance = new NetworkSystemEnhanced();
    }
    return NetworkSystemEnhanced.instance;
  }

  setGameStateUpdater(updater: (updates: any) => void) {
    this.gameStateUpdater = updater;
  }

  initializeFromGameState(devices: NetworkNode[]) {
    devices.forEach(device => {
      this.nodes.set(device.ip, device);
    });
  }

  private initializeDefaultNodes() {
    const mockNodes: NetworkNode[] = [
      {
        id: 'router_001',
        name: 'Home Router',
        ip: '192.168.1.1',
        hostname: 'home-router-001',
        type: 'router',
        security: 'medium',
        os: 'RouterOS v6.48',
        discovered: false,
        compromised: false,
        connections: ['192.168.1.50', '192.168.1.100'],
        x: 100,
        y: 100,
        ports: [
          { number: 22, service: 'SSH', open: true, cracked: false, version: '2.0' },
          { number: 80, service: 'HTTP', open: true, cracked: false, version: '1.1' }
        ],
        files: [],
        services: ['ssh', 'http'],
        links: [],
        openPorts: [22, 80],
        difficulty: 'medium'
      },
      {
        id: 'server_001',
        name: 'Corporate Server',
        ip: '10.0.0.25',
        hostname: 'corp-server-001',
        type: 'server',
        security: 'high',
        os: 'Ubuntu Server 20.04',
        discovered: false,
        compromised: false,
        connections: [],
        x: 200,
        y: 150,
        ports: [
          { number: 22, service: 'SSH', open: true, cracked: false, version: '2.0' },
          { number: 80, service: 'HTTP', open: true, cracked: false, version: '1.1' },
          { number: 443, service: 'HTTPS', open: true, cracked: false, version: '1.1' }
        ],
        files: [],
        services: ['ssh', 'http', 'https'],
        links: [],
        openPorts: [22, 80, 443],
        difficulty: 'hard'
      }
    ];

    mockNodes.forEach(node => {
      this.nodes.set(node.ip, node);
    });
  }

  scanNetwork(fromNodeIp: string): NetworkNode[] {
    const discovered: NetworkNode[] = [];
    
    this.nodes.forEach(node => {
      if (!node.discovered && Math.random() > 0.2) {
        node.discovered = true;
        discovered.push(node);
      }
    });

    if (this.gameStateUpdater && discovered.length > 0) {
      this.gameStateUpdater({
        discoveredDevices: Array.from(this.nodes.values()).filter(n => n.discovered)
      });
    }

    return discovered;
  }

  getNode(ip: string): NetworkNode | undefined {
    return this.nodes.get(ip);
  }

  getNodeByIp(ip: string): NetworkNode | undefined {
    return this.nodes.get(ip);
  }

  getAllNodes(): NetworkNode[] {
    return Array.from(this.nodes.values());
  }

  compromiseNode(ip: string): boolean {
    const node = this.nodes.get(ip);
    if (node) {
      node.compromised = true;
      return true;
    }
    return false;
  }

  canCompromiseNode(ip: string): boolean {
    const node = this.nodes.get(ip);
    if (!node) return false;
    
    // Check if all required ports are cracked
    const sshPort = node.ports.find(p => p.number === 22);
    return sshPort ? sshPort.cracked : false;
  }

  crackPort(ip: string, port: number): boolean {
    const node = this.nodes.get(ip);
    if (!node) return false;
    
    const portObj = node.ports.find(p => p.number === port);
    if (portObj) {
      portObj.cracked = true;
      return true;
    }
    return false;
  }

  addNode(node: NetworkNode): void {
    this.nodes.set(node.ip, node);
  }

  // File system operations
  getFiles(nodeIp: string, directory: string = '/'): FileEntry[] {
    const node = this.nodes.get(nodeIp);
    if (!node) return [];

    // Return files for the requested directory
    return this.defaultFiles.filter(file => {
      if (directory === '/') return true;
      return file.path?.startsWith(directory);
    });
  }

  getFileContent(nodeIp: string, filePath: string): string | null {
    const node = this.nodes.get(nodeIp);
    if (!node) return null;

    const file = this.defaultFiles.find(f => 
      f.path === filePath || f.name === filePath.split('/').pop()
    );
    
    return file?.content || null;
  }

  readFile(nodeIp: string, filePath: string): string | null {
    return this.getFileContent(nodeIp, filePath);
  }

  deleteFile(nodeIp: string, directory: string, fileName?: string): boolean {
    const node = this.nodes.get(nodeIp);
    if (!node || !node.compromised) return false;

    const targetPath = fileName ? `${directory}/${fileName}` : directory;
    const fileIndex = this.defaultFiles.findIndex(f => 
      f.path === targetPath || f.name === fileName
    );
    
    if (fileIndex !== -1) {
      this.defaultFiles.splice(fileIndex, 1);
      return true;
    }
    return false;
  }

  addFile(nodeIp: string, directory: string, fileName: string, fileData: Partial<FileEntry>): boolean {
    const node = this.nodes.get(nodeIp);
    if (!node) return false;

    const newFile: FileEntry = {
      name: fileName,
      type: fileData.type || 'file',
      size: fileData.size || 0,
      permissions: fileData.permissions || 'rw-r--r--',
      content: fileData.content || '',
      encrypted: fileData.encrypted || false,
      modified: new Date().toISOString(),
      hidden: false,
      lastModified: new Date(),
      path: `${directory}/${fileName}`
    };

    this.defaultFiles.push(newFile);
    return true;
  }

  createFile(nodeIp: string, directory: string, name: string, content: string): boolean {
    return this.addFile(nodeIp, directory, name, {
      type: 'file',
      content,
      size: content.length
    });
  }

  createDirectory(nodeIp: string, parentPath: string, name: string): boolean {
    return this.addFile(nodeIp, parentPath, name, {
      type: 'directory',
      size: 0,
      permissions: 'rwxr-xr-x'
    });
  }
}

export const networkSystemEnhanced = NetworkSystemEnhanced.getInstance();
