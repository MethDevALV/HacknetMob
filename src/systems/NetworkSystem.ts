
import { NetworkNode, FileEntry } from '../types/CoreTypes';

export class NetworkSystem {
  private nodes: Map<string, NetworkNode> = new Map();
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

  constructor() {
    this.initializeDefaultNetwork();
  }

  private initializeDefaultNetwork() {
    const defaultNode: NetworkNode = {
      id: 'router_main',
      name: 'Main Router',
      ip: '192.168.1.1',
      hostname: 'main-router',
      type: 'router',
      security: 'medium',
      os: 'RouterOS 6.48.6',
      discovered: false,
      compromised: false,
      connections: ['192.168.1.50', '192.168.1.100'],
      x: 300,
      y: 200,
      ports: [
        { number: 22, service: 'SSH', open: true, cracked: false, version: '2.0' },
        { number: 80, service: 'HTTP', open: true, cracked: false, version: '1.1' },
        { number: 443, service: 'HTTPS', open: false, cracked: false, version: '1.1' }
      ],
      files: [],
      services: ['ssh', 'http'],
      links: [],
      openPorts: [22, 80],
      difficulty: 'medium'
    };

    this.nodes.set(defaultNode.ip, defaultNode);
  }

  scanNetwork(fromNodeIp: string): NetworkNode[] {
    const discovered: NetworkNode[] = [];
    
    // Mock network scanning logic
    this.nodes.forEach(node => {
      if (!node.discovered && Math.random() > 0.3) {
        node.discovered = true;
        discovered.push(node);
      }
    });

    return discovered;
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

  getFiles(nodeIp: string, path: string = '/'): FileEntry[] {
    const node = this.nodes.get(nodeIp);
    if (!node || !node.compromised) {
      return [];
    }

    return this.defaultFiles.filter(file => 
      file.path?.startsWith(path) || path === '/'
    );
  }

  readFile(nodeIp: string, filePath: string): string | null {
    const node = this.nodes.get(nodeIp);
    if (!node || !node.compromised) {
      return null;
    }

    const file = this.defaultFiles.find(f => f.path === filePath || f.name === filePath);
    return file?.content || null;
  }

  deleteFile(nodeIp: string, filePath: string): boolean {
    const node = this.nodes.get(nodeIp);
    if (!node || !node.compromised) {
      return false;
    }

    const fileIndex = this.defaultFiles.findIndex(f => f.path === filePath || f.name === filePath);
    if (fileIndex !== -1) {
      this.defaultFiles.splice(fileIndex, 1);
      return true;
    }
    return false;
  }

  createDirectory(nodeIp: string, path: string, name: string): boolean {
    const node = this.nodes.get(nodeIp);
    if (!node || !node.compromised) {
      return false;
    }

    const newDir: FileEntry = {
      name,
      type: 'directory',
      size: 0,
      permissions: 'rwxr-xr-x',
      modified: new Date().toISOString(),
      hidden: false,
      lastModified: new Date(),
      path: `${path}/${name}`
    };

    this.defaultFiles.push(newDir);
    return true;
  }

  addNode(node: NetworkNode): void {
    this.nodes.set(node.ip, node);
  }

  updateNodeStatus(ip: string, updates: Partial<NetworkNode>): boolean {
    const node = this.nodes.get(ip);
    if (node) {
      Object.assign(node, updates);
      return true;
    }
    return false;
  }
}

export const networkSystem = new NetworkSystem();
