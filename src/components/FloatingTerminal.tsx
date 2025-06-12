
import React, { useState } from 'react';
import { Terminal, X, Maximize2 } from 'lucide-react';
import { MobileTerminal } from './MobileTerminal';

interface FloatingTerminalProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const FloatingTerminal: React.FC<FloatingTerminalProps> = ({
  isVisible,
  onToggleVisibility
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isVisible) return null;

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-3 bg-gray-900 border-b border-green-400/30">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400 font-mono text-sm">Terminal</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 text-green-400 hover:text-cyan-400 transition-colors"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
              <button
                onClick={onToggleVisibility}
                className="p-1 text-red-400 hover:text-red-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1">
            <MobileTerminal />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-40">
      <button
        onClick={() => setIsExpanded(true)}
        className="bg-gray-900 border-2 border-cyan-500 text-cyan-400 p-4 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 animate-pulse"
      >
        <Terminal className="w-6 h-6" />
      </button>
    </div>
  );
};
