
import { NetworkNode } from './NetworkNode';

export class NetworkScanner {
  static scanNetwork(currentNodeIp: string, nodes: Map<string, NetworkNode>): string[] {
    console.log(`[NetworkScanner] Scanning from: ${currentNodeIp}`);
    
    const currentNode = nodes.get(currentNodeIp);
    
    // Special handling for localhost - always allow scanning
    if (currentNodeIp === '127.0.0.1' || currentNodeIp === 'localhost') {
      console.log('[NetworkScanner] Scanning from localhost - discovering initial devices');
      
      const undiscoveredNodes = Array.from(nodes.values())
        .filter(node => !node.discovered && node.ip !== '127.0.0.1' && node.ip !== 'localhost');
      
      // Discover all initial nodes on first scan from localhost
      const discoveredIps: string[] = [];
      undiscoveredNodes.forEach(node => {
        node.discovered = true;
        discoveredIps.push(node.ip);
        console.log(`[NetworkScanner] Discovered: ${node.hostname} (${node.ip})`);
      });

      return discoveredIps;
    }
    
    // For other nodes, check if they're compromised
    if (!currentNode || !currentNode.compromised) {
      console.log('[NetworkScanner] Cannot scan from non-compromised node');
      return [];
    }

    // For compromised nodes, use probability-based discovery
    const potentialTargets = Array.from(nodes.values())
      .filter(node => !node.discovered);

    const discoveredIps: string[] = [];
    potentialTargets.forEach(node => {
      // Higher chance of discovery based on network proximity
      const discoveryChance = NetworkScanner.calculateDiscoveryChance(currentNodeIp, node.ip);
      if (Math.random() < discoveryChance) {
        node.discovered = true;
        discoveredIps.push(node.ip);
        console.log(`[NetworkScanner] Discovered: ${node.hostname} (${node.ip})`);
      }
    });

    return discoveredIps;
  }

  private static calculateDiscoveryChance(sourceIp: string, targetIp: string): number {
    // Calculate discovery probability based on network segments
    const sourceSegments = sourceIp.split('.');
    const targetSegments = targetIp.split('.');
    
    let similarity = 0;
    for (let i = 0; i < 3; i++) {
      if (sourceSegments[i] === targetSegments[i]) {
        similarity++;
      }
    }

    // Base probability + network similarity bonus
    return 0.3 + (similarity * 0.2);
  }
}
