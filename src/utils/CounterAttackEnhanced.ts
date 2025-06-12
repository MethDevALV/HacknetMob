
import { GameState, DefenseResult } from '../types/CoreTypes';
import { systemResourcesEnhanced } from './SystemResourcesEnhanced';

export class CounterAttackEnhanced {
  static async executeCounterAttack(targetIp: string, gameState: GameState): Promise<DefenseResult> {
    console.log(`[CounterAttackEnhanced] Executing counter attack on ${targetIp}`);
    
    // Check if we have sufficient resources
    const resources = systemResourcesEnhanced.getResources();
    if (resources.ram.current > resources.ram.max * 0.8) {
      return {
        success: false,
        message: 'Insufficient RAM for counter attack',
        blocked: false,
        ramCost: 0,
        type: 'resource_check',
        timestamp: new Date()
      };
    }

    try {
      // Start counter attack process
      const processId = systemResourcesEnhanced.startProcess({
        name: `Counter Attack ${targetIp}`,
        cpuUsage: 30,
        ramUsage: 256,
        networkUsage: 75,
        duration: 3000
      });

      // Simulate success based on game state
      const successRate = Math.min(0.7 + (gameState.level * 0.1), 0.95);
      const success = Math.random() < successRate;

      if (success) {
        return {
          success: true,
          message: `Counter attack successful on ${targetIp}`,
          blocked: true,
          counterAttack: true,
          ramCost: 256,
          type: 'counter_attack',
          timestamp: new Date()
        };
      } else {
        return {
          success: false,
          message: `Counter attack failed on ${targetIp}`,
          blocked: false,
          ramCost: 256,
          type: 'counter_attack',
          timestamp: new Date()
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Counter attack failed due to system error',
        blocked: false,
        ramCost: 0,
        type: 'system_error',
        timestamp: new Date()
      };
    }
  }

  static getDefenseStrength(gameState: GameState): number {
    let strength = 1.0;
    
    // Increase strength based on level
    strength += gameState.level * 0.1;
    
    // Increase strength based on active defenses
    if (gameState.activeDefenses) {
      strength += gameState.activeDefenses.length * 0.2;
    }
    
    // Decrease strength if trace level is high
    if (gameState.traceLevel > 50) {
      strength -= (gameState.traceLevel - 50) * 0.01;
    }
    
    return Math.max(0.1, Math.min(strength, 2.0));
  }

  static canActivateDefense(gameState: GameState, ramCost: number): boolean {
    return gameState.usedRAM + ramCost <= gameState.totalRAM;
  }
}
