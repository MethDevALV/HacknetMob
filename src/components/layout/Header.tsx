
import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { AlertTriangle, Wifi, Shield, Activity } from 'lucide-react';

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
    <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 border-b border-green-400/20 p-2 lg:p-3 backdrop-blur-sm">
      {/* Top Status Bar - Mobile */}
      <div className="flex items-center justify-between lg:hidden mb-2">
        <div className="flex items-center gap-2">
          <Wifi size={14} className="text-green-400" />
          <span className="text-green-400 text-xs font-mono">{gameState.currentNode || 'localhost'}</span>
        </div>
        <div className="flex items-center gap-2 text-green-400 text-xs">
          <span>SECURE</span>
        </div>
      </div>

      {/* Main Header Content */}
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-2 lg:gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></div>
            <span className="text-green-400 font-bold text-sm lg:text-lg">HACKNET</span>
            <span className="text-cyan-400 text-xs lg:text-sm bg-cyan-400/10 px-2 py-1 rounded border border-cyan-400/30">
              MOBILE v3.0.0
            </span>
          </div>
          
          <div className="hidden lg:flex items-center gap-2 text-green-400 text-sm">
            <Activity size={16} />
            <span>{gameState.currentNode || 'localhost'}</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Credits */}
          <div className="flex items-center gap-1 text-yellow-400">
            <span className="text-xs lg:text-sm">$</span>
            <span className="text-xs lg:text-sm font-bold">{gameState.credits || 0}</span>
          </div>
          
          {/* Trace Level */}
          <div className="flex items-center gap-1 lg:gap-2">
            <div className="w-6 lg:w-12 h-2 bg-gray-800 border border-green-400/50 overflow-hidden rounded-sm">
              <div 
                className={`h-full transition-all duration-500 ${traceStatus.color} ${traceStatus.pulse ? 'animate-pulse' : ''}`}
                style={{ width: `${gameState.traceLevel || 0}%` }}
              />
            </div>
            <span className={`text-xs font-bold ${
              traceStatus.status === 'CRITICAL' ? 'text-red-500' :
              traceStatus.status === 'DANGER' ? 'text-red-400' :
              traceStatus.status === 'WARNING' ? 'text-orange-500' :
              traceStatus.status === 'CAUTION' ? 'text-yellow-500' :
              'text-green-400'
            }`}>
              {gameState.traceLevel || 0}%
            </span>
          </div>

          {/* Level */}
          <div className="flex items-center gap-1 text-green-400">
            <span className="text-xs lg:text-sm">L{gameState.level || 1}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
