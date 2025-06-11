
import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { AlertTriangle } from 'lucide-react';

interface HeaderProps {
  gameState: any;
  systemStatus: {
    underAttack: boolean;
    resourcesStressed: boolean;
    traceWarning: boolean;
  };
}

export const Header: React.FC<HeaderProps> = ({ gameState, systemStatus }) => {
  const { currentLanguage } = useLanguage();

  const getTraceStatus = () => {
    const traceLevel = gameState.traceLevel || 0;
    if (traceLevel >= 90) return { status: 'CRITICAL', color: 'bg-red-500', pulse: true };
    if (traceLevel >= 70) return { status: 'DANGER', color: 'bg-red-400', pulse: true };
    if (traceLevel >= 50) return { status: 'WARNING', color: 'bg-orange-500', pulse: false };
    if (traceLevel >= 25) return { status: 'CAUTION', color: 'bg-yellow-500', pulse: false };
    return { status: 'SECURE', color: 'bg-green-500', pulse: false };
  };

  const traceStatus = getTraceStatus();

  return (
    <div className="relative z-10 flex justify-between items-center p-2 sm:p-3 border-b border-matrix-green/30 bg-black/90 backdrop-blur-sm">
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className={`w-2 h-2 rounded-full ${
            systemStatus.underAttack ? 'bg-red-500 animate-pulse' :
            systemStatus.resourcesStressed ? 'bg-orange-500 animate-pulse' :
            'bg-matrix-green animate-pulse'
          }`} />
          <span className="text-xs sm:text-sm font-bold text-matrix-cyan truncate">
            {gameState.currentNode || 'localhost'}
          </span>
        </div>
        
        {systemStatus.underAttack && (
          <div className="flex items-center gap-1 text-red-400">
            <AlertTriangle size={14} />
            <span className="text-xs font-bold">ATTACK</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="text-xs text-yellow-400">
          ${gameState.credits}
        </div>
        
        <div className="text-xs text-matrix-cyan hidden sm:block">
          {currentLanguage.toUpperCase()}
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-xs text-matrix-cyan hidden sm:inline">TRACE</span>
          <div className="w-12 sm:w-16 h-2 bg-gray-800 border border-matrix-green/50 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${traceStatus.color} ${traceStatus.pulse ? 'animate-pulse' : ''}`}
              style={{ width: `${gameState.traceLevel || 0}%` }}
            />
          </div>
          <span className={`text-xs font-bold ${
            traceStatus.status === 'CRITICAL' ? 'text-red-500 animate-pulse' :
            traceStatus.status === 'DANGER' ? 'text-red-400 animate-pulse' :
            traceStatus.status === 'WARNING' ? 'text-orange-500' :
            traceStatus.status === 'CAUTION' ? 'text-yellow-500' :
            'text-matrix-green'
          }`}>
            {traceStatus.status}
          </span>
        </div>
      </div>
    </div>
  );
};
