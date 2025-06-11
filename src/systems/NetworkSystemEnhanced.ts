
import { NetworkNode } from './network/NetworkNode';
import { FileSystemInitializer } from './network/FileSystemInitializer';
import { NetworkScanner } from './network/NetworkScanner';
import { SecurityManager } from './network/SecurityManager';
import { gameCore } from '../core/GameCore';

export class NetworkSystemEnhanced {
  private static instance: NetworkSystemEnhanced;
  private nodes: Map<string, NetworkNode> = new Map();
  private gameStateUpdater: ((updates: any) => void) | null = null;

  static getInstance(): NetworkSystemEnhanced {
    if (!NetworkSystemEnhanced.instance) {
      NetworkSystemEnhanced.instance = new NetworkSystemEnhanced();
      NetworkSystemEnhanced.instance.initializeNetwork();
    }
    return NetworkSystemEnhanced.instance;
  }

  setGameStateUpdater(updater: (updates: any) => void) {
    this.gameStateUpdater = updater;
    // También configurar el GameCore
    const gameState = gameCore.getGameState();
    if (gameState) {
      gameCore.setGameState(gameState, updater);
    }
  }

  private initializeNetwork() {
    // Initialize localhost as fully compromised
    this.addNode({
      ip: '127.0.0.1',
      hostname: 'localhost',
      type: 'Personal Computer',
      security: 'none',
      os: 'Linux',
      discovered: true,
      compromised: true,
      ports: [
        { number: 22, service: 'SSH', cracked: true },
        { number: 80, service: 'HTTP', cracked: true }
      ],
      fileSystem: new Map()
    });

    // Initialize standard network devices that should be found on first scan
    const defaultNodes = [
      {
        ip: '192.168.1.50',
        hostname: 'viper-battlestation',
        type: 'Workstation',
        security: 'basic',
        os: 'Windows',
        discovered: false,
        compromised: false,
        ports: [
          { number: 22, service: 'SSH', cracked: false },
          { number: 21, service: 'FTP', cracked: false },
          { number: 80, service: 'HTTP', cracked: false }
        ]
      },
      {
        ip: '10.0.0.25',
        hostname: 'bitwise-test-pc',
        type: 'Server',
        security: 'basic',
        os: 'Linux',
        discovered: false,
        compromised: false,
        ports: [
          { number: 22, service: 'SSH', cracked: false },
          { number: 80, service: 'HTTP', cracked: false },
          { number: 25, service: 'SMTP', cracked: false }
        ]
      },
      {
        ip: '172.16.0.10',
        hostname: 'p-anderson-pc',
        type: 'Workstation',
        security: 'standard',
        os: 'Windows',
        discovered: false,
        compromised: false,
        ports: [
          { number: 22, service: 'SSH', cracked: false },
          { number: 21, service: 'FTP', cracked: false },
          { number: 3389, service: 'RDP', cracked: false }
        ]
      }
    ];

    defaultNodes.forEach(nodeData => {
      this.addNode({
        ...nodeData,
        fileSystem: new Map()
      });
    });

    console.log('[NetworkSystemEnhanced] Network initialized with', this.nodes.size, 'nodes');
  }

  private addNode(nodeData: Omit<NetworkNode, 'fileSystem'> & { fileSystem?: Map<string, any[]> }) {
    const node: NetworkNode = {
      ...nodeData,
      fileSystem: nodeData.fileSystem || new Map()
    };

    // Initialize default file system structure
    FileSystemInitializer.initializeNodeFileSystem(node);
    this.nodes.set(node.ip, node);
  }

  scanNetwork(currentNodeIp: string = '127.0.0.1'): string[] {
    console.log(`[NetworkSystemEnhanced] Scanning from: ${currentNodeIp}`);
    const discoveredIps = NetworkScanner.scanNetwork(currentNodeIp, this.nodes);
    
    // Obtener dispositivos descubiertos para el evento
    const discoveredDevices = this.getDiscoveredNodes().map(node => ({
      ip: node.ip,
      hostname: node.hostname,
      type: node.type,
      security: node.security,
      os: node.os,
      discovered: node.discovered,
      compromised: node.compromised
    }));

    // Emitir evento de scan completado
    gameCore.notifyScanCompleted(discoveredDevices);
    
    this.updateGameState();
    return discoveredIps;
  }

  getNode(ip: string): NetworkNode | null {
    return this.nodes.get(ip) || null;
  }

  getAllNodes(): NetworkNode[] {
    return Array.from(this.nodes.values());
  }

  getDiscoveredNodes(): NetworkNode[] {
    return Array.from(this.nodes.values()).filter(node => node.discovered);
  }

  probeNode(ip: string): Array<{ number: number; service: string; cracked: boolean }> {
    const node = this.nodes.get(ip);
    if (!node || !node.discovered) {
      return [];
    }
    return node.ports;
  }

  crackPort(ip: string, port: number): boolean {
    const node = this.nodes.get(ip);
    if (!node) return false;

    const portObj = node.ports.find(p => p.number === port);
    if (!portObj) return false;

    portObj.cracked = true;
    console.log(`[NetworkSystemEnhanced] Cracked port ${port} on ${ip}`);
    
    this.updateGameState();
    return true;
  }

  canCompromiseNode(ip: string): boolean {
    const node = this.nodes.get(ip);
    if (!node) return false;

    return SecurityManager.canCompromiseNode(node);
  }

  compromiseNode(ip: string): boolean {
    const node = this.nodes.get(ip);
    if (!node || !this.canCompromiseNode(ip)) return false;

    node.compromised = true;
    
    // Add hacking tools to compromised system
    FileSystemInitializer.addHackingToolsToNode(node);
    
    // Emitir evento de nodo comprometido
    gameCore.notifyNodeCompromised(ip);
    
    console.log(`[NetworkSystemEnhanced] Compromised: ${node.hostname} (${ip})`);
    this.updateGameState();
    return true;
  }

  getFiles(ip: string, path: string): Array<{ name: string; type: 'file' | 'directory'; content?: string; size: number; permissions: string; modified: string; encrypted?: boolean }> {
    const node = this.nodes.get(ip);
    if (!node) {
      console.log(`[NetworkSystemEnhanced] Node not found: ${ip}`);
      return [];
    }

    // Para localhost, permitir acceso siempre
    if (ip === '127.0.0.1' || ip === 'localhost') {
      const files = node.fileSystem.get(path);
      if (!files) {
        console.log(`[NetworkSystemEnhanced] Path not found: ${path} on ${ip}`);
        return [];
      }
      console.log(`[NetworkSystemEnhanced] Retrieved ${files.length} files from ${ip}:${path}`);
      return files;
    }

    // Para otros nodos, verificar si están comprometidos
    if (!node.compromised) {
      console.log(`[NetworkSystemEnhanced] Access denied to ${ip} - node not compromised`);
      return [];
    }

    const files = node.fileSystem.get(path);
    if (!files) {
      console.log(`[NetworkSystemEnhanced] Path not found: ${path} on ${ip}`);
      return [];
    }

    console.log(`[NetworkSystemEnhanced] Retrieved ${files.length} files from ${ip}:${path}`);
    return files;
  }

  deleteFile(ip: string, path: string, fileName: string): boolean {
    const node = this.nodes.get(ip);
    if (!node || (!node.compromised && ip !== '127.0.0.1')) return false;

    const files = node.fileSystem.get(path);
    if (!files) return false;

    const fileIndex = files.findIndex(f => f.name === fileName);
    if (fileIndex === -1) return false;

    files.splice(fileIndex, 1);
    node.fileSystem.set(path, files);
    
    // Emitir evento de cambio en sistema de archivos
    gameCore.notifyFileSystemChanged(ip, path);
    
    this.updateGameState();
    console.log(`[NetworkSystemEnhanced] Deleted file: ${fileName} from ${ip}:${path}`);
    return true;
  }

  downloadFile(ip: string, fileName: string): { size: number; content: string } | null {
    const node = this.nodes.get(ip);
    if (!node || (!node.compromised && ip !== '127.0.0.1')) return null;

    // Search for file in all directories
    for (const [path, files] of node.fileSystem.entries()) {
      const file = files.find(f => f.name === fileName && f.type === 'file');
      if (file) {
        return {
          size: file.size,
          content: file.content || 'Binary file'
        };
      }
    }

    return null;
  }

  private updateGameState() {
    if (this.gameStateUpdater) {
      const discoveredDevices = this.getDiscoveredNodes().map(node => ({
        ip: node.ip,
        hostname: node.hostname,
        type: node.type,
        security: node.security,
        os: node.os,
        discovered: node.discovered,
        compromised: node.compromised
      }));

      this.gameStateUpdater({
        discoveredDevices,
        scannedNodes: discoveredDevices.map(d => d.ip),
        compromisedNodes: discoveredDevices.filter(d => d.compromised).map(d => d.ip)
      });

      // Emitir evento de actualización de red
      gameCore.notifyNetworkUpdated();
    }
  }
}

export const networkSystemEnhanced = NetworkSystemEnhanced.getInstance();
export type { NetworkNode };
