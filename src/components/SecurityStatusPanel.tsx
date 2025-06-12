
import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Eye, Zap } from 'lucide-react';
import { systemResourcesEnhanced } from '../utils/SystemResourcesEnhanced';
import { useGameState } from '../hooks/useGameState';

export const SecurityStatusPanel: React.FC = () => {
  const { gameState } = useGameState();
  const [securityLevel, setSecurityLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('LOW');
  const [activeThreats, setActiveThreats] = useState<string[]>([]);

  useEffect(() => {
    // Calculate security level based on game state
    let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    const threats: string[] = [];

    if (gameState.traceLevel > 80) {
      level = 'CRITICAL';
      threats.push('Critical trace level detected');
    } else if (gameState.traceLevel > 60) {
      level = 'HIGH';
      threats.push('High trace level');
    } else if (gameState.traceLevel > 30) {
      level = 'MEDIUM';
      threats.push('Moderate trace level');
    }

    if (gameState.activeTraces && gameState.activeTraces.length > 0) {
      threats.push(`${gameState.activeTraces.length} active trace(s)`);
      if (level === 'LOW') level = 'MEDIUM';
    }

    if (gameState.compromisedNodes && gameState.compromisedNodes.length > 5) {
      threats.push('Multiple compromised systems');
      if (level === 'LOW') level = 'MEDIUM';
    }

    setSecurityLevel(level);
    setActiveThreats(threats);
  }, [gameState]);

  const getSecurityColor = () => {
    switch (securityLevel) {
      case 'LOW': return 'text-green-400 border-green-400';
      case 'MEDIUM': return 'text-yellow-400 border-yellow-400';
      case 'HIGH': return 'text-orange-400 border-orange-400';
      case 'CRITICAL': return 'text-red-400 border-red-400';
    }
  };

  const getSecurityIcon = () => {
    switch (securityLevel) {
      case 'LOW': return <Shield className="w-5 h-5" />;
      case 'MEDIUM': return <Eye className="w-5 h-5" />;
      case 'HIGH': return <AlertTriangle className="w-5 h-5" />;
      case 'CRITICAL': return <Zap className="w-5 h-5" />;
    }
  };

  return (
    <div className="h-full flex flex-col p-4 border rounded-lg" style={{
      backgroundColor: 'var(--theme-surface)',
      borderColor: 'var(--theme-border)',
      color: 'var(--theme-text)'
    }}>
      {/* Header */}
      <div className="mb-4 pb-2 border-b" style={{ borderColor: 'var(--theme-border)' }}>
        <h3 className="cyber-heading text-lg">SECURITY STATUS</h3>
      </div>

      {/* Security Level */}
      <div className={`p-3 border rounded-lg mb-4 ${getSecurityColor()}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getSecurityIcon()}
            <span className="font-medium">Security Level</span>
          </div>
          <span className="font-mono font-bold">{securityLevel}</span>
        </div>
      </div>

      {/* Trace Level */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300">Trace Level</span>
          <span className="text-sm font-mono text-cyan-400">
            {gameState.traceLevel}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              gameState.traceLevel > 80 ? 'bg-red-400' : 
              gameState.traceLevel > 60 ? 'bg-orange-400' :
              gameState.traceLevel > 30 ? 'bg-yellow-400' : 'bg-green-400'
            }`}
            style={{ width: `${gameState.traceLevel}%` }}
          />
        </div>
      </div>

      {/* Active Defenses */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Active Defenses</h4>
        <div className="space-y-1">
          {gameState.activeDefenses && gameState.activeDefenses.length > 0 ? (
            gameState.activeDefenses.map((defense) => (
              <div key={defense.id} className="flex justify-between text-xs">
                <span className="text-cyan-400">{defense.name}</span>
                <span className="text-green-400">ACTIVE</span>
              </div>
            ))
          ) : (
            <span className="text-gray-500 text-xs">No active defenses</span>
          )}
        </div>
      </div>

      {/* Threat Analysis */}
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Threat Analysis</h4>
        <div className="space-y-1">
          {activeThreats.length > 0 ? (
            activeThreats.map((threat, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <AlertTriangle className="w-3 h-3 text-yellow-400" />
                <span className="text-yellow-400">{threat}</span>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <Shield className="w-3 h-3 text-green-400" />
              <span className="text-green-400">No immediate threats detected</span>
            </div>
          )}
        </div>
      </div>

      {/* Connection Status */}
      <div className="mt-auto pt-2 border-t" style={{ borderColor: 'var(--theme-border)' }}>
        <div className="flex justify-between text-xs">
          <span className="text-gray-300">Current Node:</span>
          <span className="text-cyan-400 font-mono">{gameState.currentNode}</span>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-gray-300">Compromised:</span>
          <span className="text-cyan-400 font-mono">
            {gameState.compromisedNodes?.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SecurityStatusPanel;
