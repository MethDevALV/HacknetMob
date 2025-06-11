
import { DefenseResult } from '../types/GameTypes';

interface DefenseConfig {
  name: string;
  cpuCost: number;
  ramCost: number;
  duration?: number;
  cooldown?: number;
  effectiveness: number;
}

const DEFENSE_CONFIGS: Record<string, DefenseConfig> = {
  firewall: {
    name: 'Firewall',
    cpuCost: 15,
    ramCost: 256,
    duration: 30000,
    effectiveness: 0.7
  },
  proxy: {
    name: 'Proxy',
    cpuCost: 10,
    ramCost: 128,
    effectiveness: 0.5
  },
  scramble: {
    name: 'Scramble',
    cpuCost: 20,
    ramCost: 384,
    duration: 45000,
    effectiveness: 0.6
  },
  deflect: {
    name: 'Deflect',
    cpuCost: 25,
    ramCost: 512,
    duration: 60000,
    effectiveness: 0.8
  },
  counterhack: {
    name: 'Counterhack',
    cpuCost: 35,
    ramCost: 768,
    effectiveness: 0.9
  },
  isolate: {
    name: 'Isolate',
    cpuCost: 30,
    ramCost: 640,
    effectiveness: 0.75
  },
  restore: {
    name: 'Restore',
    cpuCost: 40,
    ramCost: 1024,
    duration: 120000,
    effectiveness: 1.0
  },
  panic: {
    name: 'Panic',
    cpuCost: 50,
    ramCost: 1536,
    cooldown: 300000,
    effectiveness: 1.0
  }
};

export class DefenseSystem {
  private activeDefenses: Map<string, number> = new Map();
  private cooldowns: Map<string, number> = new Map();

  executeDefense(defenseName: string): DefenseResult {
    const config = DEFENSE_CONFIGS[defenseName];
    
    if (!config) {
      return {
        success: false,
        message: `Defense "${defenseName}" not found`
      };
    }

    // Check cooldown
    const cooldownEnd = this.cooldowns.get(defenseName) || 0;
    if (Date.now() < cooldownEnd) {
      const remaining = Math.ceil((cooldownEnd - Date.now()) / 1000);
      return {
        success: false,
        message: `${config.name} is on cooldown for ${remaining}s`
      };
    }

    // Execute defense
    if (config.duration) {
      this.activeDefenses.set(defenseName, Date.now() + config.duration);
    }

    if (config.cooldown) {
      this.cooldowns.set(defenseName, Date.now() + config.cooldown);
    }

    return {
      success: true,
      message: `${config.name} activated successfully`,
      duration: config.duration,
      resourceCost: {
        cpu: config.cpuCost,
        ram: config.ramCost
      },
      effectiveness: config.effectiveness,
      cooldown: config.cooldown
    };
  }

  isDefenseActive(defenseName: string): boolean {
    const endTime = this.activeDefenses.get(defenseName);
    if (!endTime) return false;
    
    if (Date.now() > endTime) {
      this.activeDefenses.delete(defenseName);
      return false;
    }
    
    return true;
  }

  getDefenseInfo(defenseName: string) {
    const config = DEFENSE_CONFIGS[defenseName];
    return config ? {
      ...config,
      active: this.isDefenseActive(defenseName),
      onCooldown: Date.now() < (this.cooldowns.get(defenseName) || 0)
    } : null;
  }
}

export const defenseSystem = new DefenseSystem();
