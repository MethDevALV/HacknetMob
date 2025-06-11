import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from '../hooks/useGameState';
import { CommandProcessor } from '../utils/CommandProcessor';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
  timestamp: Date;
}

export const Terminal: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const { gameState, updateGameState, discoverDevice, resetGameState } = useGameState();
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commandProcessor = new CommandProcessor();

  useEffect(() => {
    // Initialize command processor with game state functions and current game state
    commandProcessor.setGameStateFunctions(updateGameState, discoverDevice, gameState);
    
    addLine('system', `HACKNET MOBILE v3.0.0 - TERMINAL READY`);
    addLine('system', `Connected to: ${gameState.currentNode || 'localhost'}`);
    addLine('system', `Type 'help' for available commands`);
    addLine('output', '');
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const handleTerminalClick = () => {
    if (inputRef.current && !isProcessing) {
      inputRef.current.focus();
    }
  };

  const addLine = (type: TerminalLine['type'], content: string) => {
    const newLine: TerminalLine = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setLines(prev => [...prev, newLine]);
  };

  const clearTerminal = () => {
    setLines([]);
    // Re-add the welcome message
    setTimeout(() => {
      addLine('system', `HACKNET MOBILE v3.0.0 - TERMINAL READY`);
      addLine('system', `Connected to: ${gameState.currentNode || 'localhost'}`);
      addLine('system', `Type 'help' for available commands`);
      addLine('output', '');
    }, 100);
  };

  const handleInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim() || isProcessing) return;

    const command = currentInput.trim();
    addLine('input', `${gameState.currentNode || 'localhost'}:~$ ${command}`);
    
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    setCurrentInput('');
    setIsProcessing(true);

    try {
      // Handle clear command specially
      if (command.toLowerCase() === 'clear') {
        clearTerminal();
        setIsProcessing(false);
        return;
      }

      const result = await commandProcessor.processCommand(command);
      
      result.forEach(line => {
        if (line.trim()) {
          addLine('output', line);
        }
      });
    } catch (error) {
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
      handleAutoComplete();
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

  const handleAutoComplete = () => {
    const commands = ['help', 'scan', 'probe', 'connect', 'disconnect', 'ls', 'cd', 'cat', 'clear', 'sshcrack', 'ftpbounce', 'webserverworm', 'porthack', 'pwd', 'whoami', 'ps', 'netstat'];
    const knownIPs = gameState.scannedNodes || [];
    
    const words = currentInput.split(' ');
    const lastWord = words[words.length - 1];
    
    // Command completion
    if (words.length === 1) {
      const matches = commands.filter(cmd => cmd.toLowerCase().startsWith(lastWord.toLowerCase()));
      if (matches.length === 1) {
        setCurrentInput(matches[0]);
      } else if (matches.length > 1) {
        // Show available options
        addLine('output', `Available commands: ${matches.join(', ')}`);
      }
    }
    
    // IP completion for connect command
    if (words[0]?.toLowerCase() === 'connect' && words.length === 2) {
      const matches = knownIPs.filter(ip => ip.startsWith(lastWord));
      if (matches.length === 1) {
        setCurrentInput(`connect ${matches[0]}`);
      } else if (matches.length > 1) {
        addLine('output', `Available targets: ${matches.join(', ')}`);
      }
    }
  };

  // Enhanced touch gesture handlers
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [lastTap, setLastTap] = useState<number>(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touchStart.y - touch.clientY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Double tap detection for focus
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 500 && tapLength > 0 && distance < 30) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
    setLastTap(currentTime);
    
    // Gesture detection
    if (distance > 50) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
          // Swipe right - autocomplete
          handleAutoComplete();
          // Show visual feedback
          addLine('system', '> Auto-complete triggered');
        } else {
          // Swipe left - clear input
          setCurrentInput('');
          addLine('system', '> Input cleared');
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          // Swipe up - previous command
          navigateHistory('up');
        } else {
          // Swipe down - next command
          navigateHistory('down');
        }
      }
    }
    
    setTouchStart(null);
  };

  const getPrompt = () => {
    return `${gameState.currentNode || 'localhost'}:~$`;
  };

  const executeQuickCommand = (command: string) => {
    setCurrentInput(command);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Terminal content */}
      <div 
        className="flex-1 p-2 sm:p-3 overflow-y-auto cursor-text"
        ref={terminalRef}
        onClick={handleTerminalClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {lines.map(line => (
          <div key={line.id} className={`mb-1 leading-relaxed text-sm break-words ${
            line.type === 'input' ? 'text-matrix-cyan' :
            line.type === 'error' ? 'text-red-500' :
            line.type === 'system' ? 'text-yellow-400 font-bold' :
            'text-matrix-green'
          }`}>
            {line.content}
          </div>
        ))}
        
        {/* Input line */}
        <form onSubmit={handleInputSubmit} className="flex items-center mt-2">
          <span className="text-matrix-cyan mr-2 text-sm flex-shrink-0">{getPrompt()}</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-matrix-green font-mono text-sm min-w-0"
            disabled={isProcessing}
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder={isProcessing ? "Processing..." : ""}
          />
          <span className="text-matrix-green animate-pulse ml-1">█</span>
        </form>
      </div>

      {/* Quick command shortcuts - Mobile optimized */}
      <div className="border-t border-matrix-green bg-black p-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
          {['help', 'scan', 'ls', 'clear'].map(cmd => (
            <button
              key={cmd}
              onClick={() => executeQuickCommand(cmd)}
              className="px-2 py-2 text-xs border border-matrix-green text-matrix-green bg-transparent hover:bg-matrix-green hover:bg-opacity-20 transition-all active:scale-95 min-h-[44px] touch-action-manipulation"
            >
              {cmd}
            </button>
          ))}
        </div>
        
        {/* Touch gesture hints */}
        <div className="mt-2 text-xs text-matrix-green/60 text-center">
          Swipe right: autocomplete • Swipe left: clear • Swipe up/down: history
        </div>
      </div>
    </div>
  );
};
