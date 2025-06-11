
import React from 'react';
import { Monitor, HardDrive, Network, Target, Wrench, Zap, Settings } from 'lucide-react';

interface NavigationProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
  onQuickCommandsToggle?: () => void;
  onSettingsToggle?: () => void;
  showSettings?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  activePanel, 
  onPanelChange, 
  onQuickCommandsToggle,
  onSettingsToggle,
  showSettings = false
}) => {
  const navItems = [
    { id: 'terminal', icon: Monitor, label: 'Terminal' },
    { id: 'files', icon: HardDrive, label: 'Files' },
    { id: 'network', icon: Network, label: 'Network' },
    { id: 'missions', icon: Target, label: 'Missions' },
    { id: 'toolkit', icon: Wrench, label: 'Tools' },
    { id: 'quick', icon: Zap, label: 'Quick', action: onQuickCommandsToggle },
    { id: 'settings', icon: Settings, label: 'Settings', action: onSettingsToggle, active: showSettings }
  ];

  return (
    <div className="relative z-20 border-t border-matrix-green/30 bg-black/90 backdrop-blur-sm safe-area-bottom">
      <div className="grid grid-cols-7 gap-0">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = item.id === 'settings' ? item.active : activePanel === item.id;
          
          return (
            <button 
              key={item.id}
              className={`nav-tab ${isActive ? 'active' : ''}`}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  onPanelChange(item.id);
                }
              }}
            >
              <Icon size={16} className="sm:w-4 sm:h-4" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
