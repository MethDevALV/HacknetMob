
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Shield, X } from 'lucide-react';

interface DefenseCommandInterfaceProps {
  isVisible: boolean;
  onClose: () => void;
  activeAttacks: any[];
}

export const DefenseCommandInterface: React.FC<DefenseCommandInterfaceProps> = ({
  isVisible,
  onClose,
  activeAttacks
}) => {
  const [selectedDefense, setSelectedDefense] = useState<string>('');

  const defenseCommands = [
    { command: 'firewall', name: 'Firewall', description: 'Block incoming attacks' },
    { command: 'proxy', name: 'Proxy', description: 'Hide your location' },
    { command: 'scramble', name: 'Scramble', description: 'Encrypt your traffic' },
    { command: 'panic', name: 'Panic', description: 'Emergency disconnect' }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-gray-900 border border-matrix-green rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-matrix-cyan font-bold flex items-center gap-2">
            <Shield size={20} />
            Defense Commands
          </h3>
          <button onClick={onClose} className="text-matrix-green hover:text-red-400">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {defenseCommands.map(defense => (
            <button
              key={defense.command}
              onClick={() => setSelectedDefense(defense.command)}
              className={`w-full p-3 text-left rounded border transition-colors ${
                selectedDefense === defense.command
                  ? 'border-matrix-cyan bg-matrix-cyan/20'
                  : 'border-matrix-green/30 hover:border-matrix-green'
              }`}
            >
              <div className="font-semibold text-matrix-green">{defense.name}</div>
              <div className="text-sm text-matrix-green/70">{defense.description}</div>
            </button>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={() => {
              if (selectedDefense) {
                console.log(`Executing defense: ${selectedDefense}`);
                onClose();
              }
            }}
            disabled={!selectedDefense}
            className="flex-1"
          >
            Execute Defense
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
