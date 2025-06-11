import React, { useState, useEffect, useRef } from 'react';
import { useGameStateEnhanced } from '../hooks/useGameStateEnhanced';
import { CommandProcessorEnhanced } from '../utils/CommandProcessorEnhanced';
import { TerminalInput, TerminalInputRef } from './terminal/TerminalInput';
import { TerminalOutput } from './terminal/TerminalOutput';
import { QuickCommands } from './terminal/QuickCommands';
import { gameCore } from '../core/GameCore';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system' | 'warning';
  content: string;
  timestamp: Date;
}

export const TerminalEnhanced: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { gameState, updateGameState } = useGameStateEnhanced();
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<TerminalInputRef>(null);
  const commandProcessorRef = useRef<CommandProcessorEnhanced | null>(null);

  // Initialize command processor only once
  useEffect(() => {
    if (!commandProcessorRef.current) {
      commandProcessorRef.current = new CommandProcessorEnhanced();
      
      commandProcessorRef.current.setGameStateFunctions(
        updateGameState, 
        (device: any) => {}, 
        gameState
      );
      
      if (lines.length === 0) {
        const initialLines: TerminalLine[] = [
          {
            id: Date.now().toString() + '_1',
            type: 'system',
            content: '█▓▒░ HackNet Terminal v3.0.0 ░▒▓█',
            timestamp: new Date()
          },
          {
            id: Date.now().toString() + '_2',
            type: 'system',
            content: `═══ Connected to ${gameState.currentNode || 'localhost'} ═══`,
            timestamp: new Date()
          },
          {
            id: Date.now().toString() + '_3',
            type: 'output',
            content: 'Welcome to HackNet. Your journey begins now.',
            timestamp: new Date()
          },
          {
            id: Date.now().toString() + '_4',
            type: 'output',
            content: 'Type "help" for available commands or "scan" to discover targets.',
            timestamp: new Date()
          },
          {
            id: Date.now().toString() + '_5',
            type: 'output',
            content: '',
            timestamp: new Date()
          }
        ];
        setLines(initialLines);
      }
    }
  }, []);

  // Update command processor when game state changes
  useEffect(() => {
    if (commandProcessorRef.current) {
      commandProcessorRef.current.setGameStateFunctions(
        updateGameState, 
        (device: any) => {}, 
        gameState
      );
    }
  }, [gameState, updateGameState]);

  // Suscribirse a eventos del GameCore
  useEffect(() => {
    const handleNetworkUpdate = () => {
      // Refrescar automáticamente cuando haya cambios en la red
      console.log('[TerminalEnhanced] Network updated - refreshing display');
    };

    const handleFileSystemChange = () => {
      // Refrescar cuando cambien los archivos
      console.log('[TerminalEnhanced] File system changed - refreshing display');
    };

    gameCore.on('network_updated', handleNetworkUpdate);
    gameCore.on('file_system_changed', handleFileSystemChange);

    return () => {
      gameCore.off('network_updated', handleNetworkUpdate);
      gameCore.off('file_system_changed', handleFileSystemChange);
    };
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Enhanced autocompletion with file and command suggestions
  useEffect(() => {
    if (currentInput.trim() && commandProcessorRef.current) {
      const parts = currentInput.split(' ');
      const lastPart = parts[parts.length - 1];
      
      if (lastPart.length > 0) {
        const suggestions = commandProcessorRef.current.getCommandSuggestions(lastPart);
        setSuggestions(suggestions.slice(0, 8));
        setShowSuggestions(suggestions.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [currentInput]);

  const addLine = (type: TerminalLine['type'], content: string) => {
    const newLine: TerminalLine = {
      id: Date.now().toString() + Math.random(),
      type,
      content,
      timestamp: new Date()
    };
    setLines(prev => [...prev, newLine]);
  };

  const clearTerminal = () => {
    setLines([]);
    setTimeout(() => {
      addLine('system', '█▓▒░ HackNet Terminal v3.0.0 ░▒▓█');
      addLine('system', `═══ Connected to ${gameState.currentNode || 'localhost'} ═══`);
      addLine('output', 'Terminal cleared. Type "help" for available commands.');
      addLine('output', '');
    }, 100);
  };

  const handleInputSubmit = async (command: string) => {
    const prompt = `${gameState.currentNode || 'localhost'}:${gameState.currentDirectory || '/home/user'}$`;
    addLine('input', `${prompt} ${command}`);
    
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    setCurrentInput('');
    setIsProcessing(true);
    setShowSuggestions(false);

    try {
      if (command.toLowerCase() === 'clear') {
        clearTerminal();
        setIsProcessing(false);
        return;
      }

      console.log('[TerminalEnhanced] Processing command:', command);
      if (commandProcessorRef.current) {
        const result = await commandProcessorRef.current.processCommand(command);
        
        result.forEach(line => {
          if (line.trim() || result.indexOf(line) === result.length - 1) {
            // Determine line type based on content
            let lineType: TerminalLine['type'] = 'output';
            if (line.includes('Error:') || line.includes('failed') || line.includes('denied')) {
              lineType = 'error';
            } else if (line.includes('Warning:') || line.includes('detected') || line.includes('Trace')) {
              lineType = 'warning';
            } else if (line.includes('███') || line.includes('═══')) {
              lineType = 'system';
            }
            
            addLine(lineType, line);
          }
        });
      } else {
        addLine('error', 'Terminal not properly initialized');
      }
    } catch (error) {
      console.error('[TerminalEnhanced] Command error:', error);
      addLine('error', `Error: ${error}`);
    }

    setIsProcessing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateHistory('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateHistory('down');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleTabCompletion = () => {
    if (suggestions.length === 1) {
      const parts = currentInput.split(' ');
      parts[parts.length - 1] = suggestions[0];
      setCurrentInput(parts.join(' ') + (suggestions[0].includes('.') ? '' : ' '));
      setShowSuggestions(false);
    } else if (suggestions.length > 1) {
      addLine('output', `Available completions: ${suggestions.join(', ')}`);
    }
  };

  const navigateHistory = (direction: 'up' | 'down') => {
    if (direction === 'up') {
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  const handleTerminalClick = () => {
    if (inputRef.current && !isProcessing) {
      inputRef.current.focus();
    }
  };

  const handleQuickCommand = (command: string) => {
    setCurrentInput(command);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-slate-900 to-black relative border border-emerald-400/20 rounded-lg overflow-hidden shadow-2xl">
      {/* Terminal Header */}
      <div className="bg-gradient-to-r from-emerald-600/10 to-cyan-600/10 p-3 border-b border-emerald-400/30 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg"></div>
            </div>
            <span className="text-emerald-400 font-mono text-sm font-semibold ml-2">HackNet Terminal</span>
          </div>
          <div className="text-emerald-300/70 font-mono text-xs">
            {gameState.currentNode || 'localhost'} | Traces: {gameState.traceLevel || 0}% | {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div 
        className="flex-1 p-4 overflow-y-auto cursor-text relative font-mono text-sm"
        ref={terminalRef}
        onClick={handleTerminalClick}
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(5,46,22,0.15) 50%, rgba(0,0,0,0.95) 100%)',
          textShadow: '0 0 8px rgba(16, 185, 129, 0.6)'
        }}
      >
        <TerminalOutput lines={lines} isProcessing={isProcessing} />
        
        <TerminalInput
          ref={inputRef}
          currentInput={currentInput}
          onInputChange={setCurrentInput}
          onSubmit={handleInputSubmit}
          onKeyDown={handleKeyDown}
          isProcessing={isProcessing}
          currentNode={gameState.currentNode || 'localhost'}
          currentDirectory={gameState.currentDirectory || '/home/user'}
        />

        {/* Enhanced autocompletion suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="mt-2 p-3 bg-black/80 border border-emerald-400/50 rounded-lg text-xs backdrop-blur-sm">
            <div className="text-emerald-300 mb-2 font-semibold">Tab to complete:</div>
            <div className="grid grid-cols-2 gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const parts = currentInput.split(' ');
                    parts[parts.length - 1] = suggestion;
                    setCurrentInput(parts.join(' ') + (suggestion.includes('.') ? '' : ' '));
                    setShowSuggestions(false);
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }}
                  className="px-3 py-1 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 rounded hover:bg-emerald-600/30 transition-all duration-200 text-left truncate"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <QuickCommands onCommandSelect={handleQuickCommand} />
    </div>
  );
};

export default TerminalEnhanced;
