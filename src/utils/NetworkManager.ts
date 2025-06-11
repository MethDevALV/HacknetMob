
interface Device {
  ip: string;
  hostname: string;
  type: string;
  security: string;
  os: string;
  ports: number[];
  services: string[];
  discovered: boolean;
  compromised: boolean;
}

export class NetworkManager {
  private static instance: NetworkManager;
  private devices: Map<string, Device> = new Map();
  private gameStateUpdater: ((updates: any) => void) | null = null;

  static getInstance(): NetworkManager {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager();
    }
    return NetworkManager.instance;
  }

  setGameStateUpdater(updater: (updates: any) => void) {
    this.gameStateUpdater = updater;
  }

  initializeFromGameState(discoveredDevices: any[]) {
    console.log('[NetworkManager] Initializing from game state:', discoveredDevices);
    
    // Clear existing devices and reload from game state
    this.devices.clear();
    
    // Add localhost first
    this.devices.set('127.0.0.1', {
      ip: '127.0.0.1',
      hostname: 'localhost',
      type: 'Personal Computer',
      security: 'none',
      os: 'Linux',
      ports: [22, 80, 443],
      services: ['SSH', 'HTTP', 'HTTPS'],
      discovered: true,
      compromised: true
    });

    // Add devices from game state
    if (discoveredDevices && Array.isArray(discoveredDevices)) {
      discoveredDevices.forEach(device => {
        if (device.ip !== '127.0.0.1') {
          this.devices.set(device.ip, {
            ip: device.ip,
            hostname: device.hostname,
            type: device.type,
            security: device.security,
            os: device.os,
            ports: device.ports || [22, 80],
            services: device.services || ['SSH', 'HTTP'],
            discovered: device.discovered,
            compromised: device.compromised
          });
        }
      });
    }

    // Initialize default devices if none exist
    if (this.devices.size === 1) {
      this.initializeDefaultDevices();
    }

    console.log('[NetworkManager] Devices initialized:', Array.from(this.devices.values()));
  }

  initializeDefaultDevices() {
    // Add initial scannable devices
    const initialDevices = [
      {
        ip: '192.168.1.50',
        hostname: 'viper-battlestation',
        type: 'Workstation',
        security: 'low',
        os: 'Windows',
        ports: [22, 21, 80],
        services: ['SSH', 'FTP', 'HTTP'],
        discovered: false,
        compromised: false
      },
      {
        ip: '10.0.0.25',
        hostname: 'bitwise-test-pc',
        type: 'Server',
        security: 'low',
        os: 'Linux',
        ports: [22, 80],
        services: ['SSH', 'HTTP'],
        discovered: false,
        compromised: false
      },
      {
        ip: '172.16.0.10',
        hostname: 'p-anderson-pc',
        type: 'Workstation',
        security: 'medium',
        os: 'Windows',
        ports: [22, 3389],
        services: ['SSH', 'RDP'],
        discovered: false,
        compromised: false
      }
    ];

    initialDevices.forEach(device => {
      if (!this.devices.has(device.ip)) {
        this.devices.set(device.ip, device);
      }
    });

    console.log('[NetworkManager] Default devices initialized');
  }

  scanNetwork(currentNode: string): Device[] {
    console.log(`[NetworkManager] Scanning from: ${currentNode}`);
    
    const discoveredDevices: Device[] = [];
    const deviceCount = Math.floor(Math.random() * 3) + 2; // 2-4 devices
    let found = 0;

    // Find undiscovered devices and mark them as discovered
    for (const [ip, device] of this.devices.entries()) {
      if (!device.discovered && device.ip !== currentNode && device.ip !== '127.0.0.1' && found < deviceCount) {
        device.discovered = true;
        discoveredDevices.push({ ...device });
        found++;
      }
    }

    // Update game state with discovered devices
    if (this.gameStateUpdater) {
      const allDiscovered = Array.from(this.devices.values()).filter(d => d.discovered);
      console.log(`[NetworkManager] Updating game state with devices:`, allDiscovered);
      
      this.gameStateUpdater({
        discoveredDevices: allDiscovered,
        scannedNodes: allDiscovered.map(d => d.ip)
      });
    }

    console.log(`[NetworkManager] Scan result:`, discoveredDevices);
    return discoveredDevices;
  }

  getDevice(ip: string): Device | undefined {
    const device = this.devices.get(ip);
    console.log(`[NetworkManager] Getting device ${ip}:`, device);
    return device;
  }

  getAllDiscoveredDevices(): Device[] {
    return Array.from(this.devices.values()).filter(d => d.discovered);
  }

  compromiseDevice(ip: string): boolean {
    const device = this.devices.get(ip);
    if (device) {
      device.compromised = true;
      
      // Update game state
      if (this.gameStateUpdater) {
        const allDiscovered = Array.from(this.devices.values()).filter(d => d.discovered);
        this.gameStateUpdater({
          discoveredDevices: allDiscovered,
          compromisedNodes: allDiscovered.filter(d => d.compromised).map(d => d.ip)
        });
      }
      console.log(`[NetworkManager] Device ${ip} compromised successfully`);
      return true;
    }
    return false;
  }
}
