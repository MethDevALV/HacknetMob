
import { systemResourceManager } from './SystemResources';

export interface CounterAttackResult {
  type: 'none' | 'detected' | 'partial_damage' | 'system_failure' | 'counter_hack';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  effects: {
    systemReboot?: boolean;
    toolsLost?: string[];
    accessRevoked?: string[];
    traceIncrease?: number;
    temporaryDisable?: boolean;
    counterHackSuccess?: boolean;
  };
  recoveryTime?: number; // in seconds
}

export interface DefenseCommand {
  command: string;
  effectiveness: number;
  description: string;
  cooldown: number;
}

export class CounterAttackSystem {
  private isUnderAttack = false;
  private attackStartTime = 0;
  private attackSeverity: 'low' | 'medium' | 'high' | 'critical' = 'low';
  private defenseCommands: DefenseCommand[] = [
    {
      command: 'firewall',
      effectiveness: 0.7,
      description: 'Activates emergency firewall',
      cooldown: 30
    },
    {
      command: 'isolate',
      effectiveness: 0.8,
      description: 'Isolates compromised systems',
      cooldown: 45
    },
    {
      command: 'trace_block',
      effectiveness: 0.6,
      description: 'Blocks incoming trace attempts',
      cooldown: 20
    },
    {
      command: 'counter_hack',
      effectiveness: 0.9,
      description: 'Attempts to hack the attacker',
      cooldown: 60
    }
  ];
  private usedDefenses: Map<string, number> = new Map();

  initiateCounterAttack(targetSecurity: string, toolUsed: string): CounterAttackResult {
    const securityLevel = this.getSecurityLevel(targetSecurity);
    const toolRisk = this.getToolRisk(toolUsed);
    
    // Calculate attack probability based on security and tool
    const attackProbability = securityLevel.counterAttackChance * toolRisk.riskMultiplier;
    
    if (Math.random() > attackProbability) {
      return {
        type: 'none',
        severity: 'low',
        message: 'No counter-attack detected',
        effects: {}
      };
    }

    // Determine attack severity
    const severityRoll = Math.random();
    let severity: 'low' | 'medium' | 'high' | 'critical';
    
    if (severityRoll < 0.4) severity = 'low';
    else if (severityRoll < 0.7) severity = 'medium';
    else if (severityRoll < 0.9) severity = 'high';
    else severity = 'critical';

    this.isUnderAttack = true;
    this.attackStartTime = Date.now();
    this.attackSeverity = severity;

    return this.executeCounterAttack(severity);
  }

  private getSecurityLevel(security: string) {
    switch (security.toLowerCase()) {
      case 'low':
        return { counterAttackChance: 0.1, name: 'Low' };
      case 'medium':
        return { counterAttackChance: 0.3, name: 'Medium' };
      case 'high':
        return { counterAttackChance: 0.6, name: 'High' };
      case 'maximum':
        return { counterAttackChance: 0.9, name: 'Maximum' };
      default:
        return { counterAttackChance: 0.2, name: 'Unknown' };
    }
  }

  private getToolRisk(tool: string) {
    const toolRisks: Record<string, { riskMultiplier: number; name: string }> = {
      'sshcrack': { riskMultiplier: 1.2, name: 'SSH Crack' },
      'ftpbounce': { riskMultiplier: 0.8, name: 'FTP Bounce' },
      'webserverworm': { riskMultiplier: 1.5, name: 'Web Server Worm' },
      'porthack': { riskMultiplier: 1.0, name: 'Port Hack' }
    };
    
    return toolRisks[tool] || { riskMultiplier: 1.0, name: 'Unknown Tool' };
  }

  private executeCounterAttack(severity: 'low' | 'medium' | 'high' | 'critical'): CounterAttackResult {
    switch (severity) {
      case 'low':
        return {
          type: 'detected',
          severity,
          message: 'Counter-attack detected! Minor system interference.',
          effects: {
            traceIncrease: 15,
            temporaryDisable: false
          },
          recoveryTime: 10
        };

      case 'medium':
        // Simulate system stress
        systemResourceManager.simulateStress(0.5);
        return {
          type: 'partial_damage',
          severity,
          message: 'Counter-attack successful! System experiencing interference.',
          effects: {
            traceIncrease: 30,
            temporaryDisable: true
          },
          recoveryTime: 30
        };

      case 'high':
        // Simulate heavy system stress
        systemResourceManager.simulateStress(0.8);
        return {
          type: 'partial_damage',
          severity,
          message: 'Severe counter-attack! Multiple systems compromised.',
          effects: {
            toolsLost: ['sshcrack', 'ftpbounce'],
            accessRevoked: ['current_connection'],
            traceIncrease: 50,
            temporaryDisable: true
          },
          recoveryTime: 90
        };

      case 'critical':
        // Simulate system failure
        systemResourceManager.simulateStress(1.0);
        return {
          type: 'system_failure',
          severity,
          message: 'CRITICAL COUNTER-ATTACK! System rebooting to safe mode.',
          effects: {
            systemReboot: true,
            toolsLost: ['sshcrack', 'ftpbounce', 'webserverworm'],
            accessRevoked: ['all_connections'],
            traceIncrease: 75
          },
          recoveryTime: 180
        };

      default:
        return {
          type: 'none',
          severity: 'low',
          message: 'Unknown counter-attack type',
          effects: {}
        };
    }
  }

  executeDefense(defenseCommand: string): { success: boolean; message: string; effectiveness?: number } {
    if (!this.isUnderAttack) {
      return {
        success: false,
        message: 'No active attack to defend against'
      };
    }

    const defense = this.defenseCommands.find(d => d.command === defenseCommand);
    if (!defense) {
      return {
        success: false,
        message: `Unknown defense command: ${defenseCommand}`
      };
    }

    const lastUsed = this.usedDefenses.get(defenseCommand) || 0;
    const timeSinceLastUse = (Date.now() - lastUsed) / 1000;
    
    if (timeSinceLastUse < defense.cooldown) {
      const remaining = Math.ceil(defense.cooldown - timeSinceLastUse);
      return {
        success: false,
        message: `Defense on cooldown. ${remaining}s remaining.`
      };
    }

    // Mark defense as used
    this.usedDefenses.set(defenseCommand, Date.now());

    // Calculate defense success based on timing and effectiveness
    const attackDuration = (Date.now() - this.attackStartTime) / 1000;
    const timingBonus = Math.max(0, 1 - (attackDuration / 30)); // Bonus for quick response
    const finalEffectiveness = defense.effectiveness * (0.7 + 0.3 * timingBonus);

    if (Math.random() < finalEffectiveness) {
      this.isUnderAttack = false;
      
      if (defenseCommand === 'counter_hack' && Math.random() < 0.3) {
        return {
          success: true,
          message: 'Counter-hack successful! You\'ve gained access to the attacker\'s system.',
          effectiveness: finalEffectiveness
        };
      }

      return {
        success: true,
        message: `Defense successful! ${defense.description} activated.`,
        effectiveness: finalEffectiveness
      };
    } else {
      return {
        success: false,
        message: `Defense partially effective. Attack continues with reduced intensity.`,
        effectiveness: finalEffectiveness
      };
    }
  }

  getDefenseCommands(): DefenseCommand[] {
    return this.defenseCommands.map(defense => ({
      ...defense,
      cooldown: this.getRemainingCooldown(defense.command)
    }));
  }

  private getRemainingCooldown(command: string): number {
    const lastUsed = this.usedDefenses.get(command) || 0;
    const defense = this.defenseCommands.find(d => d.command === command);
    if (!defense) return 0;

    const timeSinceLastUse = (Date.now() - lastUsed) / 1000;
    return Math.max(0, defense.cooldown - timeSinceLastUse);
  }

  isCurrentlyUnderAttack(): boolean {
    return this.isUnderAttack;
  }

  getAttackInfo() {
    if (!this.isUnderAttack) return null;

    return {
      severity: this.attackSeverity,
      duration: (Date.now() - this.attackStartTime) / 1000,
      startTime: this.attackStartTime
    };
  }

  // Force end attack (for testing or recovery)
  endAttack() {
    this.isUnderAttack = false;
    this.attackStartTime = 0;
  }
}

export const counterAttackSystem = new CounterAttackSystem();
