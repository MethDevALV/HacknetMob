import { BrowserEventEmitter } from '../utils/BrowserEventEmitter';

export class DetectionSystem extends BrowserEventEmitter {
  private traceLevel: number = 0;
  private traceIncrement: number = 0.5;
  private maxTraceLevel: number = 100;
  private traceDecayRate: number = 0.1;
  private isTracing: boolean = false;
  private lastActivity: number = Date.now();

  constructor() {
    super();
  }

  initialize(currentTraceLevel: number) {
    this.traceLevel = currentTraceLevel;
    console.log('[DetectionSystem] Initialized with trace level:', this.traceLevel);
  }

  tick(): number {
    const now = Date.now();
    const timeSinceActivity = now - this.lastActivity;

    // Decay trace level if no recent activity (over 30 seconds)
    if (timeSinceActivity > 30000 && this.traceLevel > 0) {
      this.traceLevel = Math.max(0, this.traceLevel - this.traceDecayRate);
    }

    // Check if trace is complete
    if (this.traceLevel >= this.maxTraceLevel && !this.isTracing) {
      this.isTracing = true;
      this.emit('traceComplete');
      this.traceLevel = 0;
      this.isTracing = false;
    }

    return this.traceLevel;
  }

  onConnectionEstablished(targetIp: string) {
    this.lastActivity = Date.now();
    
    // Different nodes have different trace increments based on security
    const securityMultiplier = this.getSecurityMultiplier(targetIp);
    this.increaseTrace(this.traceIncrement * securityMultiplier);
    
    this.emit('traceIncreased', {
      reason: 'connection',
      target: targetIp,
      level: this.traceLevel
    });
  }

  onNodeCompromised(nodeIp: string) {
    this.lastActivity = Date.now();
    
    // Compromising a node increases trace significantly
    const securityMultiplier = this.getSecurityMultiplier(nodeIp);
    this.increaseTrace(2.0 * securityMultiplier);
    
    this.emit('traceIncreased', {
      reason: 'compromise',
      target: nodeIp,
      level: this.traceLevel
    });
  }

  onFileAccessed(nodeIp: string, filePath: string) {
    this.lastActivity = Date.now();
    
    // Accessing sensitive files increases trace
    const isSensitive = this.isSensitiveFile(filePath);
    const increment = isSensitive ? 1.5 : 0.3;
    this.increaseTrace(increment);
    
    this.emit('traceIncreased', {
      reason: 'file_access',
      target: `${nodeIp}:${filePath}`,
      level: this.traceLevel
    });
  }

  onToolUsed(toolId: string, targetIp: string) {
    this.lastActivity = Date.now();
    
    // Different tools have different trace signatures
    const toolMultiplier = this.getToolTraceMultiplier(toolId);
    this.increaseTrace(0.8 * toolMultiplier);
    
    this.emit('traceIncreased', {
      reason: 'tool_usage',
      target: `${toolId} on ${targetIp}`,
      level: this.traceLevel
    });
  }

  killTrace(): boolean {
    if (this.traceLevel > 0) {
      this.traceLevel = 0;
      this.emit('traceKilled');
      console.log('[DetectionSystem] Trace killed by player');
      return true;
    }
    return false;
  }

  private increaseTrace(amount: number) {
    this.traceLevel = Math.min(this.maxTraceLevel, this.traceLevel + amount);
    console.log('[DetectionSystem] Trace increased by', amount, 'to', this.traceLevel);
  }

  private getSecurityMultiplier(nodeIp: string): number {
    // This would ideally get security level from NetworkManager
    // For now, use IP-based heuristics
    if (nodeIp.startsWith('10.')) return 2.0; // Corporate networks
    if (nodeIp.startsWith('192.168.1.1')) return 1.5; // Routers
    if (nodeIp.startsWith('127.')) return 0.1; // Localhost
    return 1.0; // Default
  }

  private isSensitiveFile(filePath: string): boolean {
    const sensitivePatterns = [
      'password', 'secret', 'private', 'key', 'backup',
      'employee', 'database', 'config', 'admin'
    ];
    
    return sensitivePatterns.some(pattern => 
      filePath.toLowerCase().includes(pattern)
    );
  }

  private getToolTraceMultiplier(toolId: string): number {
    const traceMultipliers: { [key: string]: number } = {
      'ssh_crack': 1.0,
      'ftp_bounce': 0.8,
      'web_server_worm': 1.5,
      'sql_buffer_overflow': 2.0,
      'trace_killer': 0.0
    };
    
    return traceMultipliers[toolId] || 1.0;
  }

  getTraceLevel(): number {
    return this.traceLevel;
  }

  getTracePercentage(): number {
    return (this.traceLevel / this.maxTraceLevel) * 100;
  }

  isDetected(): boolean {
    return this.traceLevel >= this.maxTraceLevel;
  }
}
