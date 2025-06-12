
import React from 'react';
import { Terminal, File, Network, Target, Settings, MoreHorizontal } from 'lucide-react';

interface NavigationProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  activePanel, 
  onPanelChange
}) => {
  const mainItems = [
    { id: 'terminal', icon: Terminal, label: 'Terminal' },
    { id: 'files', icon: File, label: 'Files' },
    { id: 'network', icon: Network, label: 'Network' },
    { id: 'missions', icon: Target, label: 'Missions' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const secondaryItems = [
    { id: 'email', label: 'Email' },
    { id: 'tools', label: 'Tools' },
    { id: 'devtools', label: 'DevTools' },
    { id: 'options', label: 'Options' }
  ];

  const [showMore, setShowMore] = React.useState(false);

  return (
    <>
      <div className="bg-gray-900/95 border-t border-green-400/30 safe-area-bottom backdrop-blur-sm">
        <div className="grid grid-cols-5 h-16 max-w-screen-xl mx-auto">
          {mainItems.map(item => {
            const Icon = item.icon;
            const isActive = activePanel === item.id;
            
            return (
              <button 
                key={item.id}
                className={`flex flex-col items-center justify-center h-full transition-all duration-300 touch-manipulation relative min-w-0 ${
                  isActive 
                    ? 'bg-green-400/20 text-green-400 border-t-2 border-green-400 shadow-lg' 
                    : 'text-green-400/70 hover:bg-green-400/10 active:bg-green-400/20 hover:text-green-400'
                }`}
                onClick={() => onPanelChange(item.id)}
                style={{
                  fontFamily: 'var(--theme-font-mono)',
                }}
              >
                <Icon size={20} className={`mb-1 ${isActive ? 'drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]' : ''}`} />
                <span className={`text-xs font-medium leading-tight truncate max-w-full px-1 ${isActive ? 'drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]' : ''}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-t from-green-400/20 to-transparent pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* More options overlay */}
      {showMore && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-gray-900 border-t border-green-400/30 p-4 safe-area-bottom">
            <div className="grid grid-cols-2 gap-3 mb-4">
              {secondaryItems.map(item => (
                <button
                  key={item.id}
                  className="p-3 bg-gray-800 border border-green-400/30 rounded-lg text-green-400 hover:bg-green-400/10 transition-colors"
                  onClick={() => {
                    onPanelChange(item.id);
                    setShowMore(false);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowMore(false)}
              className="w-full p-3 bg-red-900/20 border border-red-400/30 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
