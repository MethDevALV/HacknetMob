
import { networkSystemEnhanced } from '../../systems/NetworkSystemEnhanced';
import { intrusionDetectionSystem } from '../../systems/IntrusionDetectionSystem';
import { terminalCore } from './TerminalCore';

export class NetworkCommands {
  static handleScan(): string[] {
    const currentNode = terminalCore.getCurrentNode();
    console.log(`[NetworkCommands] Scanning from: ${currentNode}`);
    
    const discoveredIps = networkSystemEnhanced.scanNetwork(currentNode);
    
    if (discoveredIps.length === 0) {
      return [
        'Scanning network...',
        'No new devices found.',
        'Try scanning from different compromised systems for more results.'
      ];
    }

    const output = ['Scanning network...', 'Probing for active devices...', ''];
    
    discoveredIps.forEach(ip => {
      const node = networkSystemEnhanced.getNode(ip);
      if (node) {
        output.push(`Device Found: ${node.hostname}`);
        output.push(`IP Address: ${ip}`);
        output.push(`Type: ${node.type}`);
        output.push(`OS: ${node.os}`);
        output.push(`Security: ${node.security.toUpperCase()}`);
        output.push(`Status: ${node.compromised ? 'COMPROMISED' : 'SECURED'}`);
        output.push('--------------------------------------------');
      }
    });

    output.push('');
    output.push(`Scan complete. Found ${discoveredIps.length} device(s).`);
    output.push('Use "probe <ip>" to get detailed information.');
    output.push('Use "connect <ip>" to attempt connection.');

    return output;
  }

  static handleProbe(args: string[]): string[] {
    if (args.length === 0) {
      return ['Usage: probe <target_ip>'];
    }

    const targetIp = args[0];
    const node = networkSystemEnhanced.getNode(targetIp);
    
    if (!node || !node.discovered) {
      return [`No device found at ${targetIp}. Use 'scan' first.`];
    }

    const ports = networkSystemEnhanced.probeNode(targetIp);
    const output = [
      `Probing ${targetIp} (${node.hostname})...`,
      `OS: ${node.os}`,
      `Security Level: ${node.security}`,
      `Status: ${node.compromised ? 'COMPROMISED' : 'SECURED'}`,
      '',
      'Open Ports:'
    ];

    if (ports.length === 0) {
      output.push('  No open ports detected');
    } else {
      ports.forEach(port => {
        const status = port.cracked ? '[CRACKED]' : '[CLOSED]';
        output.push(`  ${port.number}/tcp ${port.service} ${status}`);
      });
    }

    output.push('');
    if (node.compromised) {
      output.push('System access: ROOT');
    } else {
      const requiredPorts = NetworkCommands.getRequiredPortsForNode(node);
      const crackedCount = ports.filter(p => p.cracked).length;
      output.push(`Ports needed for access: ${crackedCount}/${requiredPorts}`);
      output.push('Use hacking tools to crack more ports.');
    }

    return output;
  }

  static handleConnect(args: string[]): string[] {
    if (args.length === 0) {
      return ['Usage: connect <target_ip>'];
    }

    const targetIp = args[0];
    
    if (targetIp === 'localhost' || targetIp === '127.0.0.1') {
      terminalCore.setCurrentNode('127.0.0.1');
      terminalCore.setCurrentDirectory('/');
      
      const gameStateUpdater = terminalCore.getGameStateUpdater();
      if (gameStateUpdater) {
        gameStateUpdater({
          currentNode: '127.0.0.1',
          currentDirectory: '/'
        });
      }
      
      return [`Connected to localhost (127.0.0.1)`];
    }

    const node = networkSystemEnhanced.getNode(targetIp);
    
    if (!node || !node.discovered) {
      return [`Connection failed: Unknown host ${targetIp}`];
    }

    if (!node.compromised) {
      return [
        `Connection failed: Access denied`,
        `Host ${targetIp} requires authentication`,
        `Use hacking tools to gain access first`,
        `Required tools: ${NetworkCommands.getRequiredToolsForNode(node).join(', ')}`
      ];
    }

    terminalCore.setCurrentNode(targetIp);
    terminalCore.setCurrentDirectory('/');
    
    const gameStateUpdater = terminalCore.getGameStateUpdater();
    if (gameStateUpdater) {
      gameStateUpdater({
        currentNode: targetIp,
        currentDirectory: '/'
      });
    }

    return [
      `Connected to ${node.hostname} (${targetIp})`,
      `OS: ${node.os}`,
      `Security: ${node.security}`,
      'Access Level: ROOT',
      'Connection established successfully'
    ];
  }

  static handleDisconnect(): string[] {
    terminalCore.setCurrentNode('127.0.0.1');
    terminalCore.setCurrentDirectory('/');
    
    const gameStateUpdater = terminalCore.getGameStateUpdater();
    if (gameStateUpdater) {
      gameStateUpdater({
        currentNode: '127.0.0.1',
        currentDirectory: '/'
      });
    }
    
    return ['Disconnected. Returned to localhost.'];
  }

  private static getRequiredPortsForNode(node: any): number {
    switch (node.security) {
      case 'none': return 0;
      case 'basic': return 1;
      case 'standard': return 2;
      case 'high': return 3;
      default: return 1;
    }
  }

  private static getRequiredToolsForNode(node: any): string[] {
    const tools: string[] = [];
    node.ports?.forEach((port: any) => {
      switch (port.number) {
        case 22: tools.push('SSHcrack.exe'); break;
        case 21: tools.push('FTPBounce.exe'); break;
        case 25: tools.push('relaySMTP.exe'); break;
        case 80: tools.push('WebServerWorm.exe'); break;
        case 443: tools.push('SSLTrojan.exe'); break;
        case 1433: tools.push('SQLBufferOverflow.exe'); break;
      }
    });
    return [...new Set(tools)];
  }
}
