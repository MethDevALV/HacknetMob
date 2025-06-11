
export class SecurityManager {
  static getRequiredPortsForSecurity(security: string): number {
    switch (security) {
      case 'none': return 0;
      case 'basic': return 1;
      case 'standard': return 2;
      case 'high': return 3;
      case 'maximum': return 4;
      default: return 1;
    }
  }

  static canCompromiseNode(node: any): boolean {
    const requiredPorts = SecurityManager.getRequiredPortsForSecurity(node.security);
    const crackedPorts = node.ports.filter((p: any) => p.cracked).length;
    
    return crackedPorts >= requiredPorts;
  }
}
