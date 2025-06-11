import React from 'react';
import { useGameState } from '../hooks/useGameState';

interface Props {
  // No props for now
}

interface State {
  // No state for now
}

export const ResourceMonitor: React.FC = () => {
  const { gameState } = useGameState();

  const getRAMPercentage = () => {
    return Math.min((gameState.usedRAM / gameState.totalRAM) * 100, 100);
  };

  const getTraceColor = () => {
    if (gameState.traceLevel >= 80) return 'text-red-500';
    if (gameState.traceLevel >= 50) return 'text-orange-500';
    if (gameState.traceLevel >= 25) return 'text-yellow-400';
    return 'text-matrix-green';
  };

  return (
    <div className="flex items-center gap-4 text-xs">
      {/* RAM Usage */}
      <div className="flex items-center gap-2">
        <span className="text-matrix-cyan">RAM:</span>
        <div className="w-16 h-2 bg-gray-800 border border-matrix-green">
          <div 
            className="h-full bg-matrix-green transition-all duration-300"
            style={{ width: `${getRAMPercentage()}%` }}
          />
        </div>
        <span className="text-matrix-green">
          {gameState.usedRAM?.toFixed(1) || '0.0'}/{gameState.totalRAM || 8}GB
        </span>
      </div>

      {/* CPU Usage */}
      <div className="flex items-center gap-2">
        <span className="text-matrix-cyan">CPU:</span>
        <span className="text-matrix-green">{gameState.cpuUsage || 15}%</span>
      </div>

      {/* Network Activity */}
      <div className="flex items-center gap-2">
        <span className="text-matrix-cyan">NET:</span>
        <div className={`w-2 h-2 rounded-full ${gameState.networkActivity > 0 ? 'bg-yellow-400 animate-pulse' : 'bg-gray-600'}`} />
        <span className="text-matrix-green">{gameState.networkActivity > 0 ? 'ACTIVE' : 'IDLE'}</span>
      </div>

      {/* Trace Level */}
      <div className="flex items-center gap-2">
        <span className="text-matrix-cyan">TRACE:</span>
        <span className={`font-bold ${getTraceColor()}`}>
          {gameState.traceLevel || 0}%
        </span>
      </div>
    </div>
  );
};
