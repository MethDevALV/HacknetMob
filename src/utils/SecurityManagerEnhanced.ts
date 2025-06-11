
interface ProxyBypassStatus {
  bypassed: boolean;
  required?: number;
  current?: number;
}

interface FirewallSolution {
  type: 'password' | 'sequence';
  solve: (input: any, correct: any) => boolean;
}

export class SecurityManager {
  private static instance: SecurityManager;

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  checkProxyStatus(device: any, gameState: any): ProxyBypassStatus {
    if (!device.security?.proxy) {
      return { bypassed: true };
    }
    
    const requiredShells = device.proxyBypass?.shellsRequired || 3;
    const activeShells = gameState.activeShells || 0;
    
    return {
      bypassed: activeShells >= requiredShells,
      required: requiredShells,
      current: activeShells
    };
  }

  executeShell(gameState: any, setGameState: any): boolean {
    const currentRam = gameState.usedRAM || 0;
    const totalRam = gameState.totalRAM || 8;
    
    if (currentRam + 0.5 > totalRam) {
      return false; // Insufficient RAM
    }

    setGameState((prev: any) => ({
      ...prev,
      activeShells: (prev.activeShells || 0) + 1,
      usedRAM: (prev.usedRAM || 0) + 0.5
    }));

    return true;
  }

  solveFirewall(password: string, device: any): boolean {
    if (!device.security?.firewall || !device.security?.firewallPassword) {
      return false;
    }

    return password === device.security.firewallPassword;
  }

  calculateTraceTime(device: any): number {
    const baseTime = 30000; // 30 segundos base
    const difficultyMultiplier = device.difficulty * 0.5;
    return Math.max(baseTime - (difficultyMultiplier * 1000), 5000); // Mínimo 5 segundos
  }

  applyTraceKill(gameState: any, setGameState: any): void {
    setGameState((prev: any) => ({
      ...prev,
      traceLevel: 0,
      activeTraces: []
    }));
  }

  startTrace(device: any, gameState: any, setGameState: any): void {
    if (!device.security?.trace) return;

    const traceTime = this.calculateTraceTime(device);
    
    setGameState((prev: any) => ({
      ...prev,
      activeTraces: [
        ...(prev.activeTraces || []),
        {
          id: Date.now(),
          device: device.id,
          startTime: Date.now(),
          duration: traceTime
        }
      ]
    }));
  }

  updateTraces(gameState: any, setGameState: any): void {
    const currentTime = Date.now();
    
    setGameState((prev: any) => {
      const activeTraces = (prev.activeTraces || []).filter((trace: any) => {
        return currentTime - trace.startTime < trace.duration;
      });

      // Calculate new trace level
      const traceLevel = Math.min(
        activeTraces.length * 10 + Math.floor(Math.random() * 5),
        100
      );

      return {
        ...prev,
        activeTraces,
        traceLevel
      };
    });
  }

  canAccessDevice(device: any, gameState: any): { canAccess: boolean; reason?: string } {
    // Check if device is compromised
    if (gameState.compromisedNodes?.includes(device.ip)) {
      return { canAccess: true };
    }

    // Check firewall
    if (device.security?.firewall && !device.firewallBypassed) {
      return { canAccess: false, reason: 'Firewall active - use solve command' };
    }

    // Check proxy
    if (device.security?.proxy) {
      const proxyStatus = this.checkProxyStatus(device, gameState);
      if (!proxyStatus.bypassed) {
        return { 
          canAccess: false, 
          reason: `Proxy active - need ${proxyStatus.required! - proxyStatus.current!} more shells` 
        };
      }
    }

    // Check if all required ports are cracked
    const crackedPorts = gameState.crackedPorts || [];
    const devicePorts = device.ports || [];
    const allPortsCracked = devicePorts.every((port: string) =>
      crackedPorts.some((cracked: string) => 
        cracked.includes(device.ip) && cracked.includes(port)
      )
    );

    if (!allPortsCracked) {
      return { canAccess: false, reason: 'Not all ports are compromised' };
    }

    return { canAccess: true };
  }

  compromiseDevice(device: any, gameState: any, setGameState: any): boolean {
    const accessCheck = this.canAccessDevice(device, gameState);
    if (!accessCheck.canAccess) {
      return false;
    }

    setGameState((prev: any) => ({
      ...prev,
      compromisedNodes: [
        ...(prev.compromisedNodes || []),
        device.ip
      ].filter((ip, index, arr) => arr.indexOf(ip) === index) // Remove duplicates
    }));

    return true;
  }
}

export const securityManager = SecurityManager.getInstance();
