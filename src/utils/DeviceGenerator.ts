
interface Device {
  ip: string;
  hostname: string;
  type: string;
  security: string;
  os: string;
  compromised: boolean;
}

// Device templates for procedural generation
const deviceTemplates = [
  { type: 'server', os: 'linux', hostnames: ['database-srv', 'web-server', 'mail-srv', 'backup-srv', 'auth-srv'] },
  { type: 'router', os: 'embedded', hostnames: ['router-01', 'gateway', 'switch-core', 'firewall-edge'] },
  { type: 'workstation', os: 'windows', hostnames: ['admin-pc', 'dev-workstation', 'hr-computer', 'finance-desk'] },
  { type: 'firewall', os: 'linux', hostnames: ['firewall-main', 'dmz-firewall', 'internal-fw'] }
];

const securityLevels = ['low', 'medium', 'high'];

export class DeviceGenerator {
  static generateDevices(baseIp: string, count: number): Device[] {
    const devices: Device[] = [];
    const baseOctets = baseIp.split('.').slice(0, 3);
    const usedIps = new Set([baseIp]);

    for (let i = 0; i < count; i++) {
      // Generate unique IP in same subnet
      let newIp: string;
      do {
        const lastOctet = Math.floor(Math.random() * 254) + 1;
        newIp = `${baseOctets.join('.')}.${lastOctet}`;
      } while (usedIps.has(newIp));
      
      usedIps.add(newIp);

      // Select random device template
      const template = deviceTemplates[Math.floor(Math.random() * deviceTemplates.length)];
      const hostname = template.hostnames[Math.floor(Math.random() * template.hostnames.length)];
      const security = securityLevels[Math.floor(Math.random() * securityLevels.length)];

      devices.push({
        ip: newIp,
        hostname: `${hostname}-${newIp.split('.')[3]}`,
        type: template.type,
        security: security,
        os: template.os,
        compromised: false
      });
    }

    return devices;
  }
}
