
import React, { useState } from 'react';
import { Terminal, File, Network, Target, Wrench, Settings } from 'lucide-react';

interface CircularCornerNavProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
}

export const CircularCornerNav: React.FC<CircularCornerNavProps> = ({
  activePanel,
  onPanelChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { id: 'terminal', icon: Terminal, label: 'Terminal', angle: 0 },
    { id: 'files', icon: File, label: 'Files', angle: 45 },
    { id: 'network', icon: Network, label: 'Network', angle: 90 },
    { id: 'missions', icon: Target, label: 'Missions', angle: 135 },
    { id: 'tools', icon: Wrench, label: 'Tools', angle: 180 },
    { id: 'options', icon: Settings, label: 'Options', angle: 225 }
  ];

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        {/* Central button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-16 h-16 bg-theme-surface/90 backdrop-blur-md border border-theme-border rounded-full flex items-center justify-center text-theme-primary hover:bg-theme-primary/10 transition-all duration-300 holographic-glow shadow-2xl"
        >
          <Settings size={24} className="holographic-shine" />
        </button>

        {/* Circular menu items */}
        {isExpanded && navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activePanel === item.id;
          const radius = 80;
          const angle = (item.angle * Math.PI) / 180;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          
          return (
            <button 
              key={item.id}
              className={`absolute w-12 h-12 flex items-center justify-center rounded-full transition-all duration-500 holographic-float ${
                isActive 
                  ? 'bg-theme-primary text-white shadow-lg holographic-glow scale-110' 
                  : 'bg-theme-surface/80 text-theme-text hover:bg-theme-primary/20 hover:scale-105'
              }`}
              style={{
                transform: `translate(${x}px, ${y}px)`,
                transitionDelay: `${index * 100}ms`,
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--theme-border)',
              }}
              onClick={() => {
                onPanelChange(item.id);
                setIsExpanded(false);
              }}
            >
              <Icon size={18} className={isActive ? 'holographic-shine' : ''} />
            </button>
          );
        })}
      </div>
    </div>
  );
};
