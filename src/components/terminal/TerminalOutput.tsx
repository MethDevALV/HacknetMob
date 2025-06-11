
import React from 'react';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system' | 'warning';
  content: string;
  timestamp: Date;
}

interface TerminalOutputProps {
  lines: TerminalLine[];
  isProcessing: boolean;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ lines, isProcessing }) => {
  return (
    <div className="flex-1">
      {lines.map(line => (
        <div key={line.id} className={`mb-1 leading-relaxed text-sm break-words ${
          line.type === 'input' ? 'text-matrix-cyan' :
          line.type === 'error' ? 'text-red-500' :
          line.type === 'system' ? 'text-yellow-400 font-bold' :
          line.type === 'warning' ? 'text-orange-500 font-bold animate-pulse' :
          'text-matrix-green'
        }`}>
          {line.content}
        </div>
      ))}
      
      {isProcessing && (
        <div className="flex items-center gap-2 text-yellow-400 mb-2">
          <div className="animate-spin">⟳</div>
          <span className="text-sm">Processing...</span>
        </div>
      )}
    </div>
  );
};
