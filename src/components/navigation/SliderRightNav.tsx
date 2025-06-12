
import React, { useState } from 'react';
import { Terminal, File, Network, Target, Wrench, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

interface SliderRightNavProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
}

export const SliderRightNav: React.FC<SliderRightNavProps> = ({
  activePanel,
  onPanelChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { id: 'terminal', icon: Terminal, label: 'Terminal' },
    { id: 'files', icon: File, label: 'Files' },
    { id: 'network', icon: Network, label: 'Network' },
    { id: 'missions', icon: Target, label: 'Missions' },
    { id: 'tools', icon: Wrench, label: 'Tools' },
    { id: 'options', icon: Settings, label: 'Options' }
  ];

  return (
    <div className={`fixed right-0 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-500 ${
      isExpanded ? 'translate-x-0' : 'translate-x-[calc(100%-3rem)]'
    }`}>
      <div className="flex">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-12 h-32 bg-theme-surface border border-theme-border rounded-l-xl flex items-center justify-center text-theme-text hover:bg-theme-primary/10 transition-all duration-300 matrix-glow"
        >
          {isExpanded ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        
        <div className="w-48 bg-theme-surface/95 backdrop-blur-md border border-theme-border rounded-l-xl">
          <div className="flex flex-col p-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activePanel === item.id;
              
              return (
                <button 
                  key={item.id}
                  className={`w-full h-12 flex items-center gap-3 px-3 rounded-lg transition-all duration-300 matrix-dissolve ${
                    isActive 
                      ? 'bg-theme-primary/25 text-theme-primary border border-theme-primary matrix-glow' 
                      : 'text-theme-text hover:bg-theme-primary/10 hover:text-theme-primary'
                  }`}
                  onClick={() => {
                    onPanelChange(item.id);
                    setIsExpanded(false);
                  }}
                  style={{
                    fontFamily: 'var(--theme-font-mono)',
                  }}
                >
                  <Icon size={18} className={isActive ? 'matrix-glow' : ''} />
                  <span className={`text-sm font-medium ${isActive ? 'matrix-glow' : ''}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
