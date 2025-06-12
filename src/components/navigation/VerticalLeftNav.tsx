
import React from 'react';
import { Terminal, File, Network, Target, Wrench, Settings } from 'lucide-react';

interface VerticalLeftNavProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
}

export const VerticalLeftNav: React.FC<VerticalLeftNavProps> = ({
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
    <div className="h-full w-16 bg-theme-surface border-r border-theme-border backdrop-blur-sm flex flex-col">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activePanel === item.id;
        
        return (
          <button 
            key={item.id}
            className={`w-full h-16 flex flex-col items-center justify-center transition-all duration-300 neon-glow-hover ${
              isActive 
                ? 'bg-theme-primary/25 text-theme-primary border-r-2 border-theme-primary neon-glow' 
                : 'text-theme-text hover:bg-theme-primary/10 active:bg-theme-primary/20 hover:text-theme-primary'
            }`}
            onClick={() => onPanelChange(item.id)}
            style={{
              fontFamily: 'var(--theme-font-sans)',
            }}
          >
            <Icon size={20} className={`mb-1 ${isActive ? 'neon-glow' : ''}`} />
            <span className={`text-xs font-semibold leading-tight ${isActive ? 'neon-glow' : ''}`}>
              {item.label.slice(0, 4)}
            </span>
          </button>
        );
      })}
    </div>
  );
};
