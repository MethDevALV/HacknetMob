
import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Minimize2 } from 'lucide-react';
import { hackNetEngine } from '../core/HackNetEngine';
import { useGameState } from '../hooks/useGameState';

export const MobileTerminal: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'HackNet Terminal v2.0 - Mobile Edition',
    'Type "help" for available commands.',
    ''
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { gameState, updateGameState } = useGameState();

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const executeCommand = async () => {
    if (!currentInput.trim()) return;

    const command = currentInput.trim();
    const newOutput = [...terminalOutput, `${gameState.currentNode}:${gameState.currentDirectory}$ ${command}`];
    
    try {
      const result = await hackNetEngine.executeCommand(command);
      newOutput.push(...result);
    } catch (error) {
      newOutput.push(`Error: ${error}`);
    }

    setTerminalOutput(newOutput);
    setCommandHistory(prev => [...prev, command]);
    setCurrentInput('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : -1;
        setHistoryIndex(newIndex);
        setCurrentInput(newIndex === -1 ? '' : commandHistory[newIndex]);
      }
    }
  };

  const getCurrentPrompt = () => {
    return `${gameState.currentNode}:${gameState.currentDirectory}$`;
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-gray-900 border border-cyan-500 text-cyan-400 p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
        >
          <Terminal className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-4 z-50 bg-gray-900 border border-cyan-500 rounded-lg shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <span className="text-cyan-400 font-mono text-sm">HackNet Terminal</span>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-cyan-400 transition-colors"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Terminal Output */}
      <div 
        ref={terminalRef}
        className="flex-1 p-3 overflow-y-auto font-mono text-sm bg-black"
      >
        {terminalOutput.map((line, index) => (
          <div key={index} className="text-green-400 whitespace-pre-wrap break-words">
            {line}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center p-3 border-t border-gray-700 bg-gray-800">
        <span className="text-cyan-400 font-mono text-sm mr-2">
          {getCurrentPrompt()}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-green-400 font-mono text-sm outline-none"
          placeholder="Enter command..."
          autoFocus
        />
        <button
          onClick={executeCommand}
          className="ml-2 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MobileTerminal;
