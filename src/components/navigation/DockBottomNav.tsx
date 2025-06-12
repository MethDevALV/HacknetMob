
import React from 'react';
import { Terminal, File, Network, Target, Wrench, Settings } from 'lucide-react';

interface DockBottomNavProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
}

export const DockBottomNav: React.FC<DockBottomNavProps> = ({
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
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 p-3 bg-theme-surface/90 backdrop-blur-md border border-theme-border rounded-2xl shadow-2xl">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activePanel === item.id;
          
          return (
            <button 
              key={item.id}
              className={`w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-theme-primary text-white shadow-lg scale-110 shadow-theme-primary/50' 
                  : 'text-theme-text hover:bg-theme-primary/10 hover:scale-105'
              }`}
              onClick={() => onPanelChange(item.id)}
            >
              <Icon size={22} />
            </button>
          );
        })}
      </div>
    </div>
  );
};
