
// Enhanced intrusion detection and counter-attack system
export interface ActiveTrace {
  id: string;
  source: string;
  target: string;
  strength: number;
  progress: number;
  startTime: number;
  duration: number;
  type: 'passive' | 'active' | 'admin';
}

export interface DetectionEvent {
  timestamp: number;
  nodeIp: string;
  toolUsed: string;
  detectionLevel: number;
  blocked: boolean;
}

export class IntrusionDetectionSystem {
  private static instance: IntrusionDetectionSystem;
  private activeTraces: Map<string, ActiveTrace> = new Map();
  private detectionEvents: DetectionEvent[] = [];
  private gameStateUpdater: ((updates: any) => void) | null = null;

  static getInstance(): IntrusionDetectionSystem {
    if (!IntrusionDetectionSystem.instance) {
      IntrusionDetectionSystem.instance = new IntrusionDetectionSystem();
    }
    return IntrusionDetectionSystem.instance;
  }

  setGameStateUpdater(updater: (updates: any) => void) {
    this.gameStateUpdater = updater;
  }

  // Check if tool usage triggers detection
  checkDetection(nodeIp: string, toolName: string, nodeSecurity: string): { detected: boolean; blocked: boolean; message: string } {
    const detectionThreshold = this.getDetectionThreshold(nodeSecurity);
    const toolDetectionRisk = this.getToolDetectionRisk(toolName);
    
    // Calculate detection probability
    const detectionChance = toolDetectionRisk * detectionThreshold;
    const detected = Math.random() < detectionChance;
    
    if (detected) {
      const blocked = this.shouldBlockAttempt(nodeSecurity, toolName);
      
      // Record detection event
      this.detectionEvents.push({
        timestamp: Date.now(),
        nodeIp,
        toolUsed: toolName,
        detectionLevel: Math.floor(detectionChance * 100),
        blocked
      });

      if (blocked) {
        return {
          detected: true,
          blocked: true,
          message: `Security system detected ${toolName} attempt on ${nodeIp}. Connection blocked.`
        };
      } else {
        // Start trace
        this.startTrace(nodeIp, toolName, nodeSecurity);
        return {
          detected: true,
          blocked: false,
          message: `Warning: Security system detected intrusion attempt. Trace initiated.`
        };
      }
    }

    return { detected: false, blocked: false, message: '' };
  }

  private getDetectionThreshold(security: string): number {
    switch (security) {
      case 'none': return 0.0;
      case 'basic': return 0.1;
      case 'standard': return 0.3;
      case 'high': return 0.6;
      case 'maximum': return 0.8;
      default: return 0.2;
    }
  }

  private getToolDetectionRisk(toolName: string): number {
    const risks: { [key: string]: number } = {
      'SSHcrack.exe': 0.4,
      'FTPBounce.exe': 0.3,
      'relaySMTP.exe': 0.5,
      'WebServerWorm.exe': 0.7,
      'SQLBufferOverflow.exe': 0.8,
      'SSLTrojan.exe': 0.9,
      'porthack': 0.6
    };
    return risks[toolName] || 0.5;
  }

  private shouldBlockAttempt(security: string, toolName: string): boolean {
    const blockThreshold = this.getBlockThreshold(security);
    const toolAggressiveness = this.getToolAggressiveness(toolName);
    return Math.random() < (blockThreshold * toolAggressiveness);
  }

  private getBlockThreshold(security: string): number {
    switch (security) {
      case 'none': return 0.0;
      case 'basic': return 0.1;
      case 'standard': return 0.2;
      case 'high': return 0.4;
      case 'maximum': return 0.6;
      default: return 0.1;
    }
  }

  private getToolAggressiveness(toolName: string): number {
    const aggressiveness: { [key: string]: number } = {
      'SSHcrack.exe': 0.3,
      'FTPBounce.exe': 0.2,
      'relaySMTP.exe': 0.4,
      'WebServerWorm.exe': 0.8,
      'SQLBufferOverflow.exe': 0.9,
      'SSLTrojan.exe': 1.0,
      'porthack': 0.5
    };
    return aggressiveness[toolName] || 0.5;
  }

  private startTrace(sourceIp: string, triggeredBy: string, security: string): void {
    const traceId = `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const traceDuration = this.calculateTraceDuration(security);
    
    const trace: ActiveTrace = {
      id: traceId,
      source: sourceIp,
      target: '127.0.0.1', // Always trace back to player
      strength: this.calculateTraceStrength(security),
      progress: 0,
      startTime: Date.now(),
      duration: traceDuration,
      type: security === 'high' || security === 'maximum' ? 'admin' : 'active'
    };

    this.activeTraces.set(traceId, trace);

    // Update game state
    if (this.gameStateUpdater) {
      this.gameStateUpdater({
        activeTraces: Array.from(this.activeTraces.values()),
        traceLevel: this.calculateTotalTraceLevel()
      });
    }

    console.log(`[IntrusionDetectionSystem] Trace started from ${sourceIp} (${triggeredBy})`);
  }

  private calculateTraceDuration(security: string): number {
    const baseDuration = 45000; // 45 seconds
    const multipliers: { [key: string]: number } = {
      'none': 0,
      'basic': 0.5,
      'standard': 1.0,
      'high': 1.5,
      'maximum': 2.0
    };
    return baseDuration * (multipliers[security] || 1.0);
  }

  private calculateTraceStrength(security: string): number {
    const strengths: { [key: string]: number } = {
      'none': 0,
      'basic': 20,
      'standard': 40,
      'high': 70,
      'maximum': 100
    };
    return strengths[security] || 30;
  }

  updateTraces(): void {
    const currentTime = Date.now();
    const completedTraces: string[] = [];

    for (const [traceId, trace] of this.activeTraces.entries()) {
      const elapsed = currentTime - trace.startTime;
      trace.progress = Math.min((elapsed / trace.duration) * 100, 100);

      if (trace.progress >= 100) {
        completedTraces.push(traceId);
        this.handleTraceComplete(trace);
      }
    }

    // Remove completed traces
    completedTraces.forEach(traceId => {
      this.activeTraces.delete(traceId);
    });

    // Update game state if traces changed
    if (completedTraces.length > 0 || this.activeTraces.size > 0) {
      if (this.gameStateUpdater) {
        this.gameStateUpdater({
          activeTraces: Array.from(this.activeTraces.values()),
          traceLevel: this.calculateTotalTraceLevel()
        });
      }
    }
  }

  private handleTraceComplete(trace: ActiveTrace): void {
    console.log(`[IntrusionDetectionSystem] Trace completed: ${trace.id}`);
    
    // In a real game, this would trigger consequences like:
    // - Connection termination
    // - IP bans
    // - Game over scenario
    
    if (this.gameStateUpdater) {
      this.gameStateUpdater({
        eventLog: [{
          id: `trace_complete_${Date.now()}`,
          type: 'trace' as const,
          title: 'Trace Completed',
          message: `Security trace from ${trace.source} has completed. Your location may be compromised.`,
          timestamp: Date.now(),
          severity: 'critical' as const,
          read: false
        }]
      });
    }
  }

  private calculateTotalTraceLevel(): number {
    return Array.from(this.activeTraces.values())
      .reduce((total, trace) => total + (trace.strength * (trace.progress / 100)), 0);
  }

  killAllTraces(): boolean {
    const traceCount = this.activeTraces.size;
    this.activeTraces.clear();

    if (this.gameStateUpdater) {
      this.gameStateUpdater({
        activeTraces: [],
        traceLevel: 0
      });
    }

    return traceCount > 0;
  }

  getActiveTraces(): ActiveTrace[] {
    return Array.from(this.activeTraces.values());
  }

  getDetectionEvents(): DetectionEvent[] {
    return this.detectionEvents;
  }
}

export const intrusionDetectionSystem = IntrusionDetectionSystem.getInstance();
