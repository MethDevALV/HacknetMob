
import { useState, useEffect, useCallback } from 'react';
import { useGameState } from './useGameState';
import { ConsequenceResult } from '../types/GameTypes';

interface IntrusionState {
  isDetected: boolean;
  timeRemaining: number;
  targetNode: string;
  securityLevel: string;
  startTime: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const useIntrusionDetection = () => {
  const { gameState, updateGameState } = useGameState();
  const [intrusionState, setIntrusionState] = useState<IntrusionState>({
    isDetected: false,
    timeRemaining: 0,
    targetNode: '',
    securityLevel: '',
    startTime: 0,
    severity: 'low'
  });

  const getDetectionTime = (securityLevel: string, deviceDifficulty: number): number => {
    const baseTime = {
      'none': 120,
      'low': 90,
      'medium': 60,
      'high': 30,
      'critical': 15
    };
    
    const difficultyMultiplier = Math.max(0.5, 1 - (deviceDifficulty * 0.1));
    const traceMultiplier = gameState.traceMultiplier || 1.0;
    
    return Math.floor((baseTime[securityLevel.toLowerCase() as keyof typeof baseTime] || 60) * difficultyMultiplier * traceMultiplier);
  };

  const calculateSeverity = (securityLevel: string, deviceType: string): 'low' | 'medium' | 'high' | 'critical' => {
    if (deviceType.includes('government') || deviceType.includes('military')) return 'critical';
    if (deviceType.includes('corporate') || deviceType.includes('csec')) return 'high';
    if (securityLevel === 'high' || securityLevel === 'critical') return 'high';
    if (securityLevel === 'medium') return 'medium';
    return 'low';
  };

  const triggerDetection = useCallback((targetNode: string, securityLevel: string, deviceType: string = '', difficulty: number = 1) => {
    const detectionTime = getDetectionTime(securityLevel, difficulty);
    const severity = calculateSeverity(securityLevel, deviceType);
    
    setIntrusionState({
      isDetected: true,
      timeRemaining: detectionTime,
      targetNode,
      securityLevel,
      startTime: Date.now(),
      severity
    });

    const traceIncrease = {
      'low': 20,
      'medium': 30,
      'high': 45,
      'critical': 60
    };

    updateGameState({
      traceLevel: Math.min(gameState.traceLevel + traceIncrease[severity], 100),
      networkActivity: Math.min((gameState.networkActivity || 0) + 15, 100)
    });

    if (severity === 'critical') {
      updateGameState({
        eventLog: [
          ...(gameState.eventLog || []),
          {
            id: `security_alert_${Date.now()}`,
            title: 'CRITICAL SECURITY ALERT',
            description: `High-priority intrusion detected on ${targetNode}`,
            timestamp: Date.now(),
            type: 'security',
            severity: 'critical'
          }
        ]
      });
    }
  }, [gameState.traceLevel, gameState.traceMultiplier, gameState.networkActivity, updateGameState]);

  const clearDetection = useCallback(() => {
    setIntrusionState({
      isDetected: false,
      timeRemaining: 0,
      targetNode: '',
      securityLevel: '',
      startTime: 0,
      severity: 'low'
    });
  }, []);

  const handleTimeExpired = useCallback(() => {
    const severityConsequences: Record<string, ConsequenceResult> = {
      'low': { traceIncrease: 30, forceDisconnect: true },
      'medium': { traceIncrease: 50, forceDisconnect: true, ramPenalty: 20 },
      'high': { traceIncrease: 70, forceDisconnect: true, ramPenalty: 40, creditsPenalty: 100 },
      'critical': { traceIncrease: 90, forceDisconnect: true, ramPenalty: 60, creditsPenalty: 300, lockout: 60000 }
    };

    const consequences = severityConsequences[intrusionState.severity];

    updateGameState({
      currentNode: 'localhost',
      traceLevel: Math.min(gameState.traceLevel + consequences.traceIncrease, 100),
      networkActivity: 0,
      usedRAM: Math.max(0, gameState.usedRAM - (consequences.ramPenalty || 0)),
      credits: Math.max(0, gameState.credits - (consequences.creditsPenalty || 0))
    });

    if (consequences.lockout) {
      updateGameState({
        systemLockout: Date.now() + consequences.lockout,
        eventLog: [
          ...(gameState.eventLog || []),
          {
            id: `system_lockout_${Date.now()}`,
            title: 'SYSTEM LOCKOUT INITIATED',
            description: 'Critical security breach detected. System access restricted.',
            timestamp: Date.now(),
            type: 'security',
            severity: 'critical'
          }
        ]
      });
    }
    
    clearDetection();
  }, [gameState.traceLevel, gameState.usedRAM, gameState.credits, intrusionState.severity, updateGameState, clearDetection]);

  useEffect(() => {
    if (!intrusionState.isDetected) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - intrusionState.startTime) / 1000);
      const remaining = Math.max(0, intrusionState.timeRemaining - elapsed);
      
      setIntrusionState(prev => ({
        ...prev,
        timeRemaining: remaining
      }));

      if (remaining <= 0) {
        handleTimeExpired();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [intrusionState.isDetected, intrusionState.startTime, intrusionState.timeRemaining, handleTimeExpired]);

  return {
    intrusionState,
    triggerDetection,
    clearDetection,
    handleTimeExpired
  };
};
