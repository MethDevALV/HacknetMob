
// Complete counter-attack and defense system
import { ActiveTrace, ActiveDefense, DefenseType, ResourceCost } from '../types/HackNetTypes';

export class CounterAttackSystem {
  private static instance: CounterAttackSystem;
  private activeTraces: Map<string, ActiveTrace> = new Map();
  private activeDefenses: Map<string, ActiveDefense> = new Map();
  private traceCounter = 0;

  static getInstance(): CounterAttackSystem {
    if (!CounterAttackSystem.instance) {
      CounterAttackSystem.instance = new CounterAttackSystem();
    }
    return CounterAttackSystem.instance;
  }

  // Trace system
  initiateTrace(sourceIp: string, strength: number, type: 'passive' | 'active' | 'admin' = 'passive'): string {
    const traceId = `trace_${++this.traceCounter}`;
    const trace: ActiveTrace = {
      id: traceId,
      source: sourceIp,
      strength,
      progress: 0,
      startTime: Date.now(),
      type
    };

    this.activeTraces.set(traceId, trace);
    this.startTraceProgress(traceId);
    
    return traceId;
  }

  private startTraceProgress(traceId: string): void {
    const interval = setInterval(() => {
      const trace = this.activeTraces.get(traceId);
      if (!trace) {
        clearInterval(interval);
        return;
      }

      // Progress trace based on strength and active defenses
      const defensePenalty = this.calculateDefensePenalty();
      const progressRate = (trace.strength * (1 - defensePenalty)) / 100;
      
      trace.progress += progressRate;

      if (trace.progress >= 100) {
        this.completeTrace(traceId);
        clearInterval(interval);
      }
    }, 100);
  }

  private completeTrace(traceId: string): void {
    const trace = this.activeTraces.get(traceId);
    if (!trace) return;

    // Trace completed - trigger consequences
    this.triggerTraceConsequences(trace);
    this.activeTraces.delete(traceId);
  }

  private triggerTraceConsequences(trace: ActiveTrace): void {
    switch (trace.type) {
      case 'passive':
        // Minor consequences - disconnect and small penalty
        this.forceDisconnect();
        break;
      case 'active':
        // Major consequences - file deletion, tool loss
        this.forceDisconnect();
        this.deleteRandomFiles();
        break;
      case 'admin':
        // Severe consequences - system lockout, major penalties
        this.forceDisconnect();
        this.deleteRandomFiles();
        this.temporaryLockout(60000); // 1 minute lockout
        break;
    }
  }

  // Defense system
  activateDefense(type: DefenseType, duration?: number): DefenseResult {
    const defenseConfig = this.getDefenseConfig(type);
    if (!defenseConfig) {
      return {
        success: false,
        message: `Unknown defense type: ${type}`,
        output: [`Error: Defense '${type}' not recognized`]
      };
    }

    // Check if already active
    if (this.activeDefenses.has(type)) {
      return {
        success: false,
        message: `${type} already active`,
        output: [`Error: ${defenseConfig.name} is already running`]
      };
    }

    // Check resource requirements
    if (!this.checkResourceRequirements(defenseConfig.cost)) {
      return {
        success: false,
        message: 'Insufficient resources',
        output: [
          `Error: Insufficient resources for ${defenseConfig.name}`,
          `Required: ${defenseConfig.cost.ram}MB RAM, ${defenseConfig.cost.cpu}% CPU`
        ]
      };
    }

    const defense: ActiveDefense = {
      id: `${type}_${Date.now()}`,
      type,
      strength: defenseConfig.strength,
      duration: duration || defenseConfig.duration,
      startTime: Date.now(),
      cost: defenseConfig.cost
    };

    this.activeDefenses.set(type, defense);

    // Execute defense effect
    this.executeDefenseEffect(type);

    // Auto-deactivate after duration
    setTimeout(() => {
      this.activeDefenses.delete(type);
    }, defense.duration);

    return {
      success: true,
      message: `${defenseConfig.name} activated`,
      output: [
        `${defenseConfig.name} successfully activated`,
        `Duration: ${defense.duration / 1000}s`,
        `Resource cost: ${defense.cost.ram}MB RAM, ${defense.cost.cpu}% CPU`,
        defenseConfig.description
      ]
    };
  }

  private executeDefenseEffect(type: DefenseType): void {
    switch (type) {
      case 'firewall':
        // Firewall blocks new traces
        this.blockNewTraces(10000); // 10 seconds
        break;
      case 'trace_killer':
        // Kill all active traces
        this.killAllTraces();
        break;
      case 'proxy':
        // Reduce trace progress speed
        // Handled in calculateDefensePenalty
        break;
      case 'killer':
        // Kill random processes on target
        this.executeKillerDefense();
        break;
    }
  }

  private killAllTraces(): void {
    this.activeTraces.clear();
  }

  private blockNewTraces(duration: number): void {
    // Implementation for blocking new traces
    // This would be integrated with the main game system
  }

  private executeKillerDefense(): void {
    // Implementation for killer defense
    // This would target the attacking system
  }

  // Utility methods
  private calculateDefensePenalty(): number {
    let penalty = 0;
    
    for (const defense of this.activeDefenses.values()) {
      switch (defense.type) {
        case 'proxy':
          penalty += 0.3; // 30% slowdown
          break;
        case 'firewall':
          penalty += 0.2; // 20% slowdown
          break;
      }
    }

    return Math.min(penalty, 0.9); // Max 90% slowdown
  }

  private checkResourceRequirements(cost: ResourceCost): boolean {
    // This would check against current system resources
    // Simplified for now
    return true;
  }

  private forceDisconnect(): void {
    // Implementation for forcing disconnect
    console.log('TRACE COMPLETED: Connection terminated');
  }

  private deleteRandomFiles(): void {
    // Implementation for deleting random files
    console.log('TRACE COMPLETED: Random files deleted');
  }

  private temporaryLockout(duration: number): void {
    // Implementation for temporary system lockout
    console.log(`TRACE COMPLETED: System locked for ${duration/1000}s`);
  }

  private getDefenseConfig(type: DefenseType): DefenseConfig | null {
    const configs: Record<DefenseType, DefenseConfig> = {
      firewall: {
        name: 'Firewall',
        strength: 70,
        duration: 30000,
        cost: { ram: 256, cpu: 15, time: 1000 },
        description: 'Blocks incoming connections and slows traces'
      },
      proxy: {
        name: 'Proxy',
        strength: 50,
        duration: 45000,
        cost: { ram: 128, cpu: 10, time: 800 },
        description: 'Redirects traces and hides your location'
      },
      trace_killer: {
        name: 'Trace Killer',
        strength: 100,
        duration: 1000,
        cost: { ram: 100, cpu: 50, time: 500 },
        description: 'Instantly kills all active traces'
      },
      killer: {
        name: 'Killer',
        strength: 80,
        duration: 15000,
        cost: { ram: 200, cpu: 25, time: 2000 },
        description: 'Attacks the source of incoming traces'
      },
      decryptor: {
        name: 'Decryptor',
        strength: 60,
        duration: 20000,
        cost: { ram: 150, cpu: 20, time: 3000 },
        description: 'Automatically decrypts encountered files'
      },
      sequencer: {
        name: 'Sequencer',
        strength: 90,
        duration: 10000,
        cost: { ram: 300, cpu: 40, time: 5000 },
        description: 'Bypasses sequence-based security systems'
      }
    };

    return configs[type] || null;
  }

  // Public interface methods
  getActiveTraces(): ActiveTrace[] {
    return Array.from(this.activeTraces.values());
  }

  getActiveDefenses(): ActiveDefense[] {
    return Array.from(this.activeDefenses.values());
  }

  getTotalTraceProgress(): number {
    const traces = this.getActiveTraces();
    if (traces.length === 0) return 0;
    
    return Math.max(...traces.map(t => t.progress));
  }

  isUnderAttack(): boolean {
    return this.activeTraces.size > 0;
  }
}

interface DefenseConfig {
  name: string;
  strength: number;
  duration: number;
  cost: ResourceCost;
  description: string;
}

interface DefenseResult {
  success: boolean;
  message: string;
  output: string[];
}

export const counterAttackSystem = CounterAttackSystem.getInstance();
