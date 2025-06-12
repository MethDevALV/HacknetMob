
import { useState, useEffect, useCallback } from 'react';
import { useGameState } from './useGameState';
import { DefenseSystem } from '../utils/DefenseSystem';
import { CounterAttackEnhanced } from '../utils/CounterAttackEnhanced';
import { DefenseResult } from '../types/CoreTypes';

export const useCounterAttackSystem = () => {
  const { gameState, updateGameState } = useGameState();
  const [isActive, setIsActive] = useState(false);
  const [lastAttackTime, setLastAttackTime] = useState(0);

  const activateDefense = useCallback(async (defenseType: string): Promise<DefenseResult> => {
    const result = DefenseSystem.activateDefense(defenseType, gameState.currentNode);
    
    if (result.success) {
      setIsActive(true);
      setLastAttackTime(Date.now());
      
      // Update game state with defense activation
      updateGameState({
        usedRAM: gameState.usedRAM + (result.ramCost || 0),
        defenseHistory: [...(gameState.defenseHistory || []), result]
      });
    }
    
    return result;
  }, [gameState, updateGameState]);

  const executeCounterAttack = useCallback(async (targetIp: string) => {
    if (!isActive) return null;

    try {
      const result = await CounterAttackEnhanced.executeCounterAttack(targetIp, gameState);
      
      updateGameState({
        defenseHistory: [...(gameState.defenseHistory || []), result]
      });
      
      return result;
    } catch (error) {
      console.error('[CounterAttack] Error executing counter attack:', error);
      return null;
    }
  }, [isActive, gameState, updateGameState]);

  useEffect(() => {
    // Auto-deactivate defense after 5 minutes
    if (isActive && Date.now() - lastAttackTime > 300000) {
      setIsActive(false);
    }
  }, [isActive, lastAttackTime]);

  return {
    isActive,
    activateDefense,
    executeCounterAttack,
    activeDefenses: gameState.activeDefenses || [],
    defenseHistory: gameState.defenseHistory || []
  };
};
