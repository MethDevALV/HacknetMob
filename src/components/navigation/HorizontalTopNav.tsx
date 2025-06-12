
import React from 'react';
import { Terminal, File, Network, Target, Wrench, Settings } from 'lucide-react';

interface HorizontalTopNavProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
}

export const HorizontalTopNav: React.FC<HorizontalTopNavProps> = ({
  activePanel,
  onPanelChange,
}) => {
  const navItems = [
    { id: 'terminal', icon: Terminal, label: 'Terminal' },
    { id: 'files', icon: File, label: 'Files' },
    { id: 'network', icon: Network, label: 'Network' },
    { id: 'missions', icon: Target, label: 'Missions' },
    { id: 'tools', icon: Wrench, label: 'Tools' },
    { id: 'options', icon: Settings, label: 'Options' }
  ];

  return (
    <div className="w-full bg-theme-surface border-b border-theme-border safe-area-top backdrop-blur-sm">
      <div className="flex h-14 overflow-x-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activePanel === item.id;
          
          return (
            <button 
              key={item.id}
              className={`flex-1 min-w-[80px] flex flex-col items-center justify-center h-full transition-all duration-300 ascii-border ${
                isActive 
                  ? 'bg-theme-primary/25 text-theme-primary border-b-2 border-theme-primary shadow-lg' 
                  : 'text-theme-text hover:bg-theme-primary/10 active:bg-theme-primary/20 hover:text-theme-primary'
              }`}
              onClick={() => onPanelChange(item.id)}
              style={{
                fontFamily: 'var(--theme-font-mono)',
              }}
            >
              <Icon size={18} className={`mb-1 ${isActive ? 'terminal-glow' : ''}`} />
              <span className={`text-xs font-semibold leading-tight ${isActive ? 'terminal-glow' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-b from-theme-primary/20 to-transparent pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
