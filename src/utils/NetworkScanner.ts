
interface ScanResult {
  ip: string;
  hostname: string;
  type: string;
  security: string;
  os: string;
  ports: number[];
  services: string[];
  compromised: boolean;
}

export class NetworkScanner {
  private static defaultDevices: ScanResult[] = [
    {
      ip: '127.0.0.1',
      hostname: 'localhost',
      type: 'Personal Computer',
      security: 'none',
      os: 'Linux',
      ports: [22, 80, 443],
      services: ['SSH', 'HTTP', 'HTTPS'],
      compromised: true
    },
    {
      ip: '192.168.1.50',
      hostname: 'viper-battlestation',
      type: 'Workstation',
      security: 'low',
      os: 'Windows',
      ports: [22, 21, 80],
      services: ['SSH', 'FTP', 'HTTP'],
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
      compromised: false
    }
  ];

  static performScan(currentNode: string, discoveredDevices: any[]): ScanResult[] {
    console.log(`[SCAN] Scanning from node: ${currentNode}`);
    
    // If this is the first scan from localhost, return default devices
    if (currentNode === 'localhost' || currentNode === '127.0.0.1') {
      console.log('[SCAN] First scan - returning default devices');
      return this.defaultDevices.filter(device => device.ip !== '127.0.0.1');
    }

    // For subsequent scans from other nodes, generate new devices
    const existingIPs = discoveredDevices.map(d => d.ip);
    const newDevices: ScanResult[] = [];
    const deviceCount = Math.floor(Math.random() * 3) + 1; // 1-3 new devices

    for (let i = 0; i < deviceCount; i++) {
      const device = this.generateRandomDevice(existingIPs);
      if (device && !existingIPs.includes(device.ip)) {
        newDevices.push(device);
        existingIPs.push(device.ip);
      }
    }

    console.log(`[SCAN] Generated ${newDevices.length} new devices`);
    return newDevices;
  }

  private static generateRandomDevice(existingIPs: string[]): ScanResult | null {
    const deviceTemplates = [
      { type: 'Server', os: 'Linux', hostnameBase: 'srv' },
      { type: 'Workstation', os: 'Windows', hostnameBase: 'pc' },
      { type: 'Router', os: 'Embedded', hostnameBase: 'router' },
      { type: 'Firewall', os: 'Linux', hostnameBase: 'fw' }
    ];

    const securityLevels = ['low', 'medium', 'high'];
    const subnets = ['192.168.1', '10.0.0', '172.16.0', '203.0.113'];

    let attempts = 0;
    while (attempts < 50) {
      const subnet = subnets[Math.floor(Math.random() * subnets.length)];
      const lastOctet = Math.floor(Math.random() * 254) + 1;
      const ip = `${subnet}.${lastOctet}`;

      if (!existingIPs.includes(ip)) {
        const template = deviceTemplates[Math.floor(Math.random() * deviceTemplates.length)];
        const security = securityLevels[Math.floor(Math.random() * securityLevels.length)];
        
        return {
          ip,
          hostname: `${template.hostnameBase}-${lastOctet}`,
          type: template.type,
          security,
          os: template.os,
          ports: this.generatePorts(template.type),
          services: this.generateServices(template.type),
          compromised: false
        };
      }
      attempts++;
    }

    return null;
  }

  private static generatePorts(type: string): number[] {
    const commonPorts = [22, 80, 443];
    const typePorts = {
      'Server': [21, 25, 53, 110, 143],
      'Workstation': [3389, 5900],
      'Router': [23, 161, 179],
      'Firewall': [514, 515]
    };

    return [...commonPorts, ...(typePorts[type as keyof typeof typePorts] || [])];
  }

  private static generateServices(type: string): string[] {
    const commonServices = ['SSH', 'HTTP', 'HTTPS'];
    const typeServices = {
      'Server': ['FTP', 'SMTP', 'DNS', 'POP3', 'IMAP'],
      'Workstation': ['RDP', 'VNC'],
      'Router': ['TELNET', 'SNMP', 'BGP'],
      'Firewall': ['SYSLOG']
    };

    return [...commonServices, ...(typeServices[type as keyof typeof typeServices] || [])];
  }

  static formatScanOutput(devices: ScanResult[]): string[] {
    const output = [
      'Scanning network...',
      'Probing for active devices...',
      '',
      'SCAN RESULTS:',
      '============================================',
      ''
    ];

    devices.forEach(device => {
      output.push(`Device Found: ${device.hostname}`);
      output.push(`IP Address: ${device.ip}`);
      output.push(`Type: ${device.type}`);
      output.push(`OS: ${device.os}`);
      output.push(`Security: ${device.security.toUpperCase()}`);
      output.push(`Ports: ${device.ports.join(', ')}`);
      output.push(`Services: ${device.services.join(', ')}`);
      output.push(`Status: ${device.compromised ? 'COMPROMISED' : 'SECURED'}`);
      output.push('--------------------------------------------');
    });

    output.push('');
    output.push(`Scan complete. Found ${devices.length} device(s).`);
    output.push('Use "probe <ip>" to get detailed information.');
    output.push('Use "connect <ip>" to attempt connection.');

    return output;
  }
}
