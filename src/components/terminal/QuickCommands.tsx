
import React from 'react';

interface QuickCommandsProps {
  onCommandSelect: (command: string) => void;
}

export const QuickCommands: React.FC<QuickCommandsProps> = ({ onCommandSelect }) => {
  const commands = ['help', 'scan', 'ls', 'clear'];

  return (
    <div className="border-t border-matrix-green bg-black p-2">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
        {commands.map(cmd => (
          <button
            key={cmd}
            onClick={() => onCommandSelect(cmd)}
            className="px-2 py-2 text-xs border border-matrix-green text-matrix-green bg-transparent hover:bg-matrix-green hover:bg-opacity-20 transition-all active:scale-95 min-h-[44px] touch-action-manipulation"
          >
            {cmd}
          </button>
        ))}
      </div>
      
      <div className="mt-2 text-xs text-matrix-green/60 text-center">
        Tap buttons for quick commands
      </div>
    </div>
  );
};
