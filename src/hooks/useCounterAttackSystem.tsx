
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGameState } from './useGameState';
import { useToast } from './use-toast';
import { CounterAttackSystem } from '../utils/CounterAttack';

interface CounterAttackContextType {
  isUnderAttack: boolean;
  activeAttacks: any[];
  alertLevel: 'green' | 'yellow' | 'orange' | 'red';
  riskLevel: number;
  executeDefense: (command: string) => Promise<void>;
  trackHackingAttempt: (targetIp: string, success: boolean, toolUsed: string) => void;
}

const CounterAttackContext = createContext<CounterAttackContextType | null>(null);

export const CounterAttackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isUnderAttack, setIsUnderAttack] = useState(false);
  const [activeAttacks, setActiveAttacks] = useState<any[]>([]);
  const [alertLevel, setAlertLevel] = useState<'green' | 'yellow' | 'orange' | 'red'>('green');
  const [riskLevel, setRiskLevel] = useState(0);
  const [counterAttackSystem] = useState(() => new CounterAttackSystem());
  
  const { updateGameState } = useGameState();
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsUnderAttack(counterAttackSystem.isCurrentlyUnderAttack());
      const attackInfo = counterAttackSystem.getAttackInfo();
      setActiveAttacks(attackInfo ? [attackInfo] : []);
    }, 1000);

    return () => clearInterval(interval);
  }, [counterAttackSystem]);

  const executeDefense = async (command: string) => {
    try {
      const result = counterAttackSystem.executeDefense(command);
      
      if (result.success) {
        toast({
          title: "Defense Activated",
          description: result.message,
          duration: 3000,
        });
      } else {
        toast({
          title: "Defense Failed",
          description: result.message,
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not execute defense",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const trackHackingAttempt = (targetIp: string, success: boolean, toolUsed: string) => {
    const counterAttack = counterAttackSystem.initiateCounterAttack('medium', toolUsed);
    
    if (counterAttack.type !== 'none') {
      toast({
        title: "🚨 COUNTER-ATTACK DETECTED",
        description: counterAttack.message,
        variant: "destructive",
        duration: 5000,
      });
      
      setIsUnderAttack(true);
    }
  };

  return (
    <CounterAttackContext.Provider
      value={{
        isUnderAttack,
        activeAttacks,
        alertLevel,
        riskLevel,
        executeDefense,
        trackHackingAttempt,
      }}
    >
      {children}
    </CounterAttackContext.Provider>
  );
};

export const useCounterAttack = () => {
  const context = useContext(CounterAttackContext);
  if (!context) {
    throw new Error('useCounterAttack must be used within a CounterAttackProvider');
  }
  return context;
};
