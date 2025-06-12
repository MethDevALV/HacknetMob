
import React from 'react';
import { Terminal, Files, Network, Target } from 'lucide-react';

interface MobileNavDockProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
}

export const MobileNavDock: React.FC<MobileNavDockProps> = ({
  activePanel,
  onPanelChange
}) => {
  const navItems = [
    { id: 'terminal', icon: Terminal, label: 'TERM', glow: 'shadow-green-400/50' },
    { id: 'files', icon: Files, label: 'FILES', glow: 'shadow-cyan-400/50' },
    { id: 'network', icon: Network, label: 'NET', glow: 'shadow-blue-400/50' },
    { id: 'missions', icon: Target, label: 'OPS', glow: 'shadow-orange-400/50' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
      {/* Cyberpunk background with blur */}
      <div className="relative bg-black/90 backdrop-blur-xl border-t border-green-400/30">
        {/* Animated scanline effect */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"></div>
        
        {/* Navigation container */}
        <div className="flex items-center justify-around px-4 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePanel === item.id;
            
            return (
              <button
                key={item.id}
                className={`
                  relative flex flex-col items-center justify-center min-w-0 p-3 rounded-lg
                  transition-all duration-300 ease-out transform
                  ${isActive 
                    ? `bg-green-400/20 border border-green-400/50 scale-110 ${item.glow} shadow-lg` 
                    : 'bg-gray-900/50 border border-gray-700/50 hover:bg-green-400/10 hover:border-green-400/30 hover:scale-105'
                  }
                `}
                onClick={() => onPanelChange(item.id)}
              >
                {/* Holographic effect for active item */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-t from-green-400/20 via-transparent to-green-400/10 rounded-lg animate-pulse"></div>
                )}
                
                {/* Icon with glow effect */}
                <Icon 
                  size={18} 
                  className={`
                    mb-1 transition-all duration-300
                    ${isActive 
                      ? 'text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]' 
                      : 'text-green-400/70 hover:text-green-400'
                    }
                  `} 
                />
                
                {/* Label with cyberpunk font */}
                <span className={`
                  text-xs font-mono font-bold tracking-wider transition-all duration-300
                  ${isActive 
                    ? 'text-green-400 drop-shadow-[0_0_4px_rgba(34,197,94,0.6)]' 
                    : 'text-green-400/70 hover:text-green-400'
                  }
                `}>
                  {item.label}
                </span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_6px_rgba(34,197,94,0.8)]"></div>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400/50 to-transparent"></div>
      </div>
    </div>
  );
};
