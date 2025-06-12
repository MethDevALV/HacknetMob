
import { EventEmitter } from 'events';
import { networkSystemEnhanced } from './NetworkSystemEnhanced';
import { GameState, NetworkNode, GameEvent, DefenseResult } from '../types/CoreTypes';

export class CounterAttackSystem extends EventEmitter {
  private gameState: GameState | null = null;
  private updateGameState: ((updates: Partial<GameState>) => void) | null = null;

  constructor() {
    super();
  }

  setGameState(gameState: GameState, updateGameState: (updates: Partial<GameState>) => void) {
    this.gameState = gameState;
    this.updateGameState = updateGameState;
  }

  initiateCounterAttack(targetNode: NetworkNode, event: GameEvent): DefenseResult {
    if (!this.gameState) {
      return { 
        success: false, 
        message: 'Game state not initialized.', 
        blocked: false,
        type: 'counter_attack',
        timestamp: new Date()
      };
    }

    const baseDefense = this.calculateBaseDefense(targetNode);
    const adjustedDefense = this.adjustDefenseForEvent(baseDefense, event);
    const roll = Math.random();

    if (roll < adjustedDefense) {
      return this.successfulDefense(targetNode, event);
    } else {
      return this.failedDefense(targetNode, event);
    }
  }

  private calculateBaseDefense(node: NetworkNode): number {
    switch (node.security) {
      case 'low': return 0.2;
      case 'medium': return 0.5;
      case 'high': return 0.8;
      default: return 0.3;
    }
  }

  private adjustDefenseForEvent(baseDefense: number, event: GameEvent): number {
    switch (event.type) {
      case 'file_access': return baseDefense * 0.75;
      case 'port_scan': return baseDefense * 1.2;
      case 'intrusion_attempt': return baseDefense * 0.5;
      default: return baseDefense;
    }
  }

  private successfulDefense(targetNode: NetworkNode, event: GameEvent): DefenseResult {
    const message = `Defense successful against ${event.type} on ${targetNode.ip}`;
    console.log(`[CounterAttackSystem] ${message}`);

    // Implement counter-attack logic here
    const counterAttackPossible = Math.random() < 0.3; // 30% chance of counter-attack

    if (counterAttackPossible) {
      return {
        success: true,
        message: message + ' with a counter-attack!',
        blocked: true,
        counterAttack: true,
        type: 'counter_attack',
        timestamp: new Date()
      };
    } else {
      return {
        success: true,
        message,
        blocked: true,
        type: 'defense',
        timestamp: new Date()
      };
    }
  }

  private failedDefense(targetNode: NetworkNode, event: GameEvent): DefenseResult {
    const message = `Defense failed against ${event.type} on ${targetNode.ip}`;
    console.warn(`[CounterAttackSystem] ${message}`);

    const damage = this.calculateDamage(event);

    return {
      success: false,
      message,
      blocked: false,
      damage,
      type: 'defense_failure',
      timestamp: new Date()
    };
  }

  private calculateDamage(event: GameEvent): number {
    switch (event.type) {
      case 'file_access': return 10;
      case 'port_scan': return 5;
      case 'intrusion_attempt': return 20;
      default: return 5;
    }
  }
}
