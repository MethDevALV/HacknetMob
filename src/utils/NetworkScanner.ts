
export class NetworkScanner {
  static performScan(currentNode: string, discoveredDevices: any[] = []) {
    const predefinedNetworks = [
      {
        ip: '192.168.1.1',
        hostname: 'home_router',
        type: 'Router',
        security: 'medium',
        os: 'Linux',
        compromised: false
      },
      {
        ip: '192.168.1.50',
        hostname: 'john_laptop',
        type: 'Personal Computer',
        security: 'low',
        os: 'Windows 10',
        compromised: false
      },
      {
        ip: '192.168.1.100',
        hostname: 'media_server',
        type: 'Server',
        security: 'medium',
        os: 'Ubuntu Server',
        compromised: false
      },
      {
        ip: '10.0.0.5',
        hostname: 'corp_firewall',
        type: 'Firewall',
        security: 'high',
        os: 'pfSense',
        compromised: false
      },
      {
        ip: '172.16.0.10',
        hostname: 'dev_workstation',
        type: 'Workstation',
        security: 'medium',
        os: 'Linux Mint',
        compromised: false
      }
    ];

    // Filter out already discovered devices and add new ones
    const alreadyDiscovered = discoveredDevices.map(d => d.ip);
    const newDevices = predefinedNetworks.filter(device => 
      !alreadyDiscovered.includes(device.ip) && device.ip !== currentNode
    );

    console.log(`[NetworkScanner] Found ${newDevices.length} new devices`);
    return newDevices;
  }

  static formatScanOutput(devices: any[]): string[] {
    if (devices.length === 0) {
      return ['No new devices found on network'];
    }

    const output = [
      'Network scan complete:',
      `Found ${devices.length} device(s)`,
      ''
    ];

    devices.forEach(device => {
      output.push(`${device.ip} - ${device.hostname}`);
      output.push(`  Type: ${device.type}`);
      output.push(`  OS: ${device.os}`);
      output.push(`  Security: ${device.security.toUpperCase()}`);
      output.push('');
    });

    output.push('Use "probe <ip>" to get detailed information about a device');
    output.push('Use "connect <ip>" to attempt connection');

    return output;
  }
}
