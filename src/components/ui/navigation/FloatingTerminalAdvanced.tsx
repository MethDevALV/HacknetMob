
import React, { useState } from 'react';
import { Terminal, X, Maximize2, Minimize2 } from 'lucide-react';
import { MobileTerminal } from '../../MobileTerminal';

interface FloatingTerminalAdvancedProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
  currentPanel: string;
}

export const FloatingTerminalAdvanced: React.FC<FloatingTerminalAdvancedProps> = ({
  isVisible,
  onToggleVisibility,
  currentPanel
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Don't show if we're on terminal panel
  if (currentPanel === 'terminal') return null;
  
  if (!isVisible) return null;

  // Minimized state (just a small floating orb)
  if (isMinimized) {
    return (
      <div className="fixed bottom-24 right-4 z-40">
        <button
          onClick={() => setIsMinimized(false)}
          className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-cyan-400/20 border-2 border-green-400/50 rounded-full backdrop-blur-sm shadow-lg hover:shadow-green-400/30 transition-all duration-300 animate-pulse"
        >
          <Terminal className="w-6 h-6 text-green-400 mx-auto" />
        </button>
      </div>
    );
  }

  // Expanded fullscreen state
  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
        <div className="h-full flex flex-col">
          {/* Cyberpunk header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-900 via-black to-gray-900 border-b border-green-400/30">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
              <Terminal className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400 font-mono text-sm font-bold tracking-wider">TERMINAL OVERLAY</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 text-green-400 hover:text-cyan-400 transition-colors bg-gray-800/50 rounded border border-green-400/30 hover:border-cyan-400/50"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={onToggleVisibility}
                className="p-2 text-red-400 hover:text-red-300 transition-colors bg-gray-800/50 rounded border border-red-400/30 hover:border-red-300/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Terminal content */}
          <div className="flex-1 relative">
            <MobileTerminal />
            
            {/* Scanline effect overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-green-400/5 to-transparent animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Default floating window state
  return (
    <div className="fixed bottom-24 right-4 z-40 w-80 max-w-[calc(100vw-2rem)]">
      <div className="bg-black/90 backdrop-blur-xl border border-green-400/30 rounded-lg shadow-xl shadow-green-400/20 overflow-hidden">
        {/* Header with controls */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-900/50 to-black/50 border-b border-green-400/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 font-mono text-xs font-bold">TERM</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setIsExpanded(true)}
              className="p-1 text-green-400/70 hover:text-green-400 transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 text-yellow-400/70 hover:text-yellow-400 transition-colors"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleVisibility}
              className="p-1 text-red-400/70 hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Mini terminal content */}
        <div className="h-48 relative overflow-hidden">
          <div className="absolute inset-0 scale-75 origin-top-left transform">
            <MobileTerminal />
          </div>
          
          {/* Overlay to indicate it's a preview */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute bottom-2 left-2 right-2">
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full py-2 bg-green-400/20 border border-green-400/50 rounded text-green-400 text-xs font-mono hover:bg-green-400/30 transition-colors"
            >
              EXPAND TERMINAL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
