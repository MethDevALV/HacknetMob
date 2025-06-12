
import React from 'react';
import { Wifi, Shield, Cpu, HardDrive } from 'lucide-react';
import { useGameState } from '../../../hooks/useGameState';
import { useIsMobile } from '../../../hooks/use-mobile';

export const ResponsiveHeader: React.FC = () => {
  const { gameState } = useGameState();
  const isMobile = useIsMobile();

  const getTraceColor = (level: number) => {
    if (level < 30) return 'text-green-400';
    if (level < 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRamColor = (used: number, total: number) => {
    const percentage = (used / total) * 100;
    if (percentage < 50) return 'text-green-400';
    if (percentage < 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`
      bg-gradient-to-r from-black via-gray-900 to-black 
      border-b border-green-400/30 
      ${isMobile ? 'h-14 px-4 safe-area-top' : 'h-12 px-6'}
      flex items-center justify-between
      relative overflow-hidden
    `}>
      {/* Animated background scanline */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"></div>
      
      {/* Left side - Branding */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
          <div className={`text-cyan-400 font-mono font-bold tracking-wider ${isMobile ? 'text-sm' : 'text-lg'}`}>
            HACKNET
          </div>
        </div>
        
        {!isMobile && (
          <div className="flex items-center gap-2 text-green-400/60 text-sm">
            <Wifi className="w-4 h-4" />
            <span className="font-mono">{gameState.currentNode}</span>
          </div>
        )}
      </div>

      {/* Right side - System stats */}
      <div className={`flex items-center gap-4 ${isMobile ? 'text-xs' : 'text-sm'}`}>
        {/* Current node (mobile only) */}
        {isMobile && (
          <div className="flex items-center gap-1 text-green-400/70">
            <Wifi className="w-3 h-3" />
            <span className="font-mono">{gameState.currentNode.split('.').pop()}</span>
          </div>
        )}
        
        {/* RAM Usage */}
        <div className="flex items-center gap-1">
          <HardDrive className="w-3 h-3 text-green-400/70" />
          <span className={`font-mono ${getRamColor(gameState.usedRAM || 0, gameState.totalRAM || 4)}`}>
            {(gameState.usedRAM || 0).toFixed(1)}GB
          </span>
          {!isMobile && <span className="text-green-400/50">/{gameState.totalRAM || 4}GB</span>}
        </div>

        {/* CPU Usage */}
        <div className="flex items-center gap-1">
          <Cpu className="w-3 h-3 text-green-400/70" />
          <span className="text-green-400 font-mono">
            {Math.random() > 0.5 ? Math.floor(Math.random() * 30 + 10) : Math.floor(Math.random() * 15 + 5)}%
          </span>
        </div>

        {/* Trace Level */}
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-green-400/70" />
          <span className={`font-mono ${getTraceColor(gameState.traceLevel || 0)}`}>
            {(gameState.traceLevel || 0).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400/30 to-transparent"></div>
    </div>
  );
};
