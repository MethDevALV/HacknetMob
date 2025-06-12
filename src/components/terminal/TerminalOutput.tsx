
import React from 'react';
import { TerminalLine } from '../../types/CoreTypes';

interface TerminalOutputProps {
  lines: TerminalLine[];
  isProcessing: boolean;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ lines, isProcessing }) => {
  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'input':
        return 'text-cyan-400';
      case 'output':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'system':
        return 'text-blue-400';
      case 'success':
        return 'text-emerald-400';
      default:
        return 'text-green-400';
    }
  };

  return (
    <div className="space-y-1">
      {lines.map((line) => (
        <div 
          key={line.id} 
          className={`whitespace-pre-wrap break-words ${getLineColor(line.type)}`}
        >
          {line.content}
        </div>
      ))}
      
      {isProcessing && (
        <div className="text-yellow-400 animate-pulse">
          Processing...
        </div>
      )}
    </div>
  );
};
