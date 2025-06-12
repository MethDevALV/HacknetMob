import { BrowserEventEmitter } from '../utils/BrowserEventEmitter';
import { NetworkNode } from '../types/CoreTypes';

interface Port {
  number: number;
  service: string;
  open: boolean;
  cracked: boolean;
  version: string;
}

export class NetworkManager extends BrowserEventEmitter {
  private nodes: Map<string, NetworkNode> = new Map();
  private topology: Map<string, string[]> = new Map(); // ip -> connected ips

  constructor() {
    super();
  }

  initialize(existingNodes: NetworkNode[]) {
    this.nodes.clear();
    this.topology.clear();
    
    // Add existing nodes
    existingNodes.forEach(node => {
      this.nodes.set(node.ip, node);
      this.topology.set(node.ip, node.connections || []);
    });
    
    // Initialize default network if empty
    if (this.nodes.size === 0) {
      this.createDefaultNetwork();
    }
    
    console.log('[NetworkManager] Initialized with', this.nodes.size, 'nodes');
  }

  private createDefaultNetwork() {
    const defaultNodes: NetworkNode[] = [
      // Localhost
      {
        id: 'localhost',
        name: 'localhost',
        ip: '127.0.0.1',
        hostname: 'localhost',
        type: 'workstation',
        security: 'low',
        os: 'Linux Ubuntu 20.04',
        discovered: true,
        compromised: true,
        connections: ['192.168.1.1', '192.168.1.50', '10.0.0.25'],
        x: 400,
        y: 300,
        openPorts: [22],
        services: ['SSH'],
        difficulty: 'easy',
        ports: [
          { number: 22, service: 'SSH', open: true, cracked: true, version: '1.0' }
        ],
        links: [],
        files: []
      },
      // Router
      {
        id: 'home_router',
        name: 'Home Router',
        ip: '192.168.1.1',
        hostname: 'linksys-router',
        type: 'router',
        security: 'medium',
        os: 'RouterOS 6.48',
        discovered: false,
        compromised: false,
        connections: ['127.0.0.1', '192.168.1.50'],
        x: 200,
        y: 150,
        openPorts: [22, 80, 23],
        services: ['SSH', 'HTTP', 'Telnet'],
        difficulty: 'medium',
        ports: [
          { number: 22, service: 'SSH', open: true, cracked: false, version: '2.0' },
          { number: 80, service: 'HTTP', open: true, cracked: false, version: '1.1' }
        ],
        links: [],
        files: []
      },
      // Vulnerable workstation
      {
        id: 'viper_battlestation',
        name: 'Viper Battlestation',
        ip: '192.168.1.50',
        hostname: 'viper-pc',
        type: 'workstation',
        security: 'low',
        os: 'Windows 10 Pro',
        discovered: false,
        compromised: false,
        connections: ['192.168.1.1'],
        x: 600,
        y: 450,
        openPorts: [22, 21, 80],
        services: ['SSH', 'FTP', 'HTTP'],
        difficulty: 'easy',
        ports: [
          { number: 22, service: 'SSH', open: true, cracked: false, version: '2.0' },
          { number: 21, service: 'FTP', open: true, cracked: false, version: '1.0' }
        ],
        links: [],
        files: []
      },
      // Corporate server
      {
        id: 'corp_server',
        name: 'Corporate Server',
        ip: '10.0.0.25',
        hostname: 'corp-srv-001',
        type: 'server',
        security: 'high',
        os: 'Ubuntu Server 22.04',
        discovered: false,
        compromised: false,
        connections: ['127.0.0.1'],
        x: 100,
        y: 500,
        openPorts: [22, 80, 443, 3306],
        services: ['SSH', 'HTTP', 'HTTPS', 'MySQL'],
        difficulty: 'hard',
        ports: [
          { number: 22, service: 'SSH', open: true, cracked: false, version: '2.0' },
          { number: 80, service: 'HTTP', open: true, cracked: false, version: '1.1' },
          { number: 443, service: 'HTTPS', open: true, cracked: false, version: '1.1' },
          { number: 3306, service: 'MySQL', open: true, cracked: false, version: '8.0' }
        ],
        links: [],
        files: []
      },
      // IoT Device - Fixed type to match allowed types
      {
        id: 'smart_cam',
        name: 'Smart Camera',
        ip: '192.168.1.100',
        hostname: 'smartcam-kitchen',
        type: 'personal',
        security: 'low',
        os: 'Embedded Linux',
        discovered: false,
        compromised: false,
        connections: ['192.168.1.1'],
        x: 700,
        y: 200,
        openPorts: [23, 80, 554],
        services: ['Telnet', 'HTTP', 'RTSP'],
        difficulty: 'easy',
        ports: [
          { number: 23, service: 'Telnet', open: true, cracked: false, version: '1.0' },
          { number: 80, service: 'HTTP', open: true, cracked: false, version: '1.0' }
        ],
        links: [],
        files: []
      }
    ];

    defaultNodes.forEach(node => {
      this.nodes.set(node.ip, node);
      this.topology.set(node.ip, node.connections || []);
    });

    console.log('[NetworkManager] Created default network with', defaultNodes.length, 'nodes');
  }

  scanNetwork(fromNodeIp: string): NetworkNode[] {
    console.log(`[NetworkManager] Scanning from: ${fromNodeIp}`);
    
    const sourceNode = this.nodes.get(fromNodeIp);
    if (!sourceNode) {
      console.log('[NetworkManager] Source node not found');
      return [];
    }

    // If scanning from localhost, discover connected devices
    if (fromNodeIp === '127.0.0.1' || fromNodeIp === 'localhost') {
      const connectedIps = this.topology.get(fromNodeIp) || [];
      const discoveredNodes: NetworkNode[] = [];

      connectedIps.forEach(ip => {
        const node = this.nodes.get(ip);
        if (node && !node.discovered) {
          node.discovered = true;
          discoveredNodes.push(node);
          console.log(`[NetworkManager] Discovered: ${node.hostname} (${node.ip})`);
        }
      });

      this.emit('networkScanned', { from: fromNodeIp, discovered: discoveredNodes });
      return discoveredNodes;
    }

    // If scanning from compromised node, discover their connections
    if (sourceNode.compromised) {
      const connectedIps = this.topology.get(fromNodeIp) || [];
      const discoveredNodes: NetworkNode[] = [];

      connectedIps.forEach(ip => {
        const node = this.nodes.get(ip);
        if (node && !node.discovered) {
          node.discovered = true;
          discoveredNodes.push(node);
          console.log(`[NetworkManager] Discovered from ${fromNodeIp}: ${node.hostname} (${node.ip})`);
        }
      });

      // Random chance to discover additional nodes in the same subnet
      const subnet = fromNodeIp.split('.').slice(0, 3).join('.');
      Array.from(this.nodes.values()).forEach(node => {
        if (!node.discovered && node.ip.startsWith(subnet) && Math.random() < 0.4) {
          node.discovered = true;
          discoveredNodes.push(node);
          console.log(`[NetworkManager] Subnet discovery: ${node.hostname} (${node.ip})`);
        }
      });

      this.emit('networkScanned', { from: fromNodeIp, discovered: discoveredNodes });
      return discoveredNodes;
    }

    console.log('[NetworkManager] Cannot scan from non-compromised node');
    return [];
  }

  connectToNode(targetIp: string): boolean {
    const targetNode = this.nodes.get(targetIp);
    if (!targetNode) return false;
    if (!targetNode.discovered) return false;
    if (!targetNode.compromised) return false;

    this.emit('nodeConnected', targetIp);
    return true;
  }

  compromiseNode(nodeIp: string): boolean {
    const node = this.nodes.get(nodeIp);
    if (!node) return false;

    node.compromised = true;
    this.emit('nodeCompromised', nodeIp);
    console.log('[NetworkManager] Node compromised:', node.hostname);
    return true;
  }

  crackPort(nodeIp: string, portNumber: number): boolean {
    const node = this.nodes.get(nodeIp);
    if (!node) return false;

    if (!node.openPorts.includes(portNumber)) return false;

    // Check if node can be compromised (requires SSH port 22 cracked)
    if (portNumber === 22) {
      node.compromised = true;
      this.emit('nodeCompromised', nodeIp);
    }

    console.log('[NetworkManager] Port cracked:', nodeIp, portNumber);
    return true;
  }

  getNode(nodeIp: string): NetworkNode | undefined {
    return this.nodes.get(nodeIp);
  }

  getAllNodes(): NetworkNode[] {
    return Array.from(this.nodes.values());
  }

  getDiscoveredNodes(): NetworkNode[] {
    return Array.from(this.nodes.values()).filter(node => node.discovered);
  }

  getCompromisedNodes(): NetworkNode[] {
    return Array.from(this.nodes.values()).filter(node => node.compromised);
  }

  getConnectedNodes(fromNodeIp: string): NetworkNode[] {
    const connectedIps = this.topology.get(fromNodeIp) || [];
    return connectedIps.map(ip => this.nodes.get(ip)).filter(Boolean) as NetworkNode[];
  }
}
