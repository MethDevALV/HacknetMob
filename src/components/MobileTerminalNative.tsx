
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useGameState } from '../hooks/useGameStateNative';
import { hackNetEngineNative } from '../core/HackNetEngineNative';
import { cyberpunkStyles } from '../styles/cyberpunkTheme';
import { TerminalLine } from '../types/CoreTypes';

const MobileTerminalNative: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollViewRef = useRef<HTMLDivElement>(null);
  const { gameState, updateGameState } = useGameState();

  // Initialize terminal
  useEffect(() => {
    if (lines.length === 0) {
      const initialLines: TerminalLine[] = [
        {
          id: Date.now().toString() + '_1',
          type: 'system',
          content: '█▓▒░ HackNet Mobile v1.0.0 ░▒▓█',
          timestamp: new Date()
        },
        {
          id: Date.now().toString() + '_2',
          type: 'system',
          content: `═══ Connected to ${gameState.currentNode} ═══`,
          timestamp: new Date()
        },
        {
          id: Date.now().toString() + '_3',
          type: 'output',
          content: 'Welcome to HackNet Mobile. Touch the future.',
          timestamp: new Date()
        },
        {
          id: Date.now().toString() + '_4',
          type: 'output',
          content: 'Type "help" for available commands or tap quick commands below.',
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
  }, [gameState.currentNode]);

  // Initialize HackNet engine
  useEffect(() => {
    hackNetEngineNative.initialize(gameState, updateGameState);
  }, [gameState, updateGameState]);

  // Auto scroll to bottom
  useEffect(() => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTop = scrollViewRef.current.scrollHeight;
      }
    }, 100);
  }, [lines]);

  const addLine = (type: TerminalLine['type'], content: string) => {
    const newLine: TerminalLine = {
      id: Date.now().toString() + Math.random(),
      type,
      content,
      timestamp: new Date()
    };
    setLines(prev => [...prev, newLine]);
  };

  const getTextStyle = (type: TerminalLine['type']): React.CSSProperties => {
    switch (type) {
      case 'error':
        return { ...cyberpunkStyles.errorText, fontSize: '14px' };
      case 'warning':
        return { ...cyberpunkStyles.warningText, fontSize: '14px' };
      case 'system':
        return { ...cyberpunkStyles.systemText, fontSize: '14px', fontWeight: 'bold' };
      case 'success':
        return { ...cyberpunkStyles.successText, fontSize: '14px' };
      case 'input':
        return { ...cyberpunkStyles.matrixText, fontSize: '14px', opacity: 0.8 };
      default:
        return { ...cyberpunkStyles.matrixText, fontSize: '14px' };
    }
  };

  const handleInputSubmit = async () => {
    if (!currentInput.trim() || isProcessing) return;

    const command = currentInput.trim();
    const prompt = `${gameState.currentNode}:${gameState.currentDirectory}$`;
    addLine('input', `${prompt} ${command}`);
    
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    setCurrentInput('');
    setIsProcessing(true);

    try {
      if (command.toLowerCase() === 'clear') {
        setLines([]);
        setTimeout(() => {
          addLine('system', '█▓▒░ HackNet Mobile v1.0.0 ░▒▓█');
          addLine('system', `═══ Connected to ${gameState.currentNode} ═══`);
          addLine('output', 'Terminal cleared. Type "help" for available commands.');
          addLine('output', '');
        }, 100);
        setIsProcessing(false);
        return;
      }

      console.log('[MobileTerminal] Processing command:', command);
      const result = await hackNetEngineNative.executeCommand(command);
      
      result.forEach(line => {
        if (line.trim() || result.indexOf(line) === result.length - 1) {
          let lineType: TerminalLine['type'] = 'output';
          if (line.includes('Error:') || line.includes('failed') || line.includes('denied')) {
            lineType = 'error';
          } else if (line.includes('Warning:') || line.includes('detected') || line.includes('Trace')) {
            lineType = 'warning';
          } else if (line.includes('███') || line.includes('═══')) {
            lineType = 'system';
          } else if (line.includes('Success') || line.includes('completed')) {
            lineType = 'success';
          }
          
          addLine(lineType, line);
        }
      });
    } catch (error) {
      console.error('[MobileTerminal] Command error:', error);
      addLine('error', `Error: ${error}`);
    }

    setIsProcessing(false);
  };

  const handleQuickCommand = (command: string) => {
    setCurrentInput(command);
  };

  const quickCommands = ['help', 'scan', 'ls', 'clear', 'probe', 'netmap'];

  const getCurrentPrompt = () => {
    return `${gameState.currentNode}:${gameState.currentDirectory}$`;
  };

  return (
    <div className="h-full bg-black flex flex-col" style={{ padding: '8px' }}>
      <div style={cyberpunkStyles.terminalContainer}>
        {/* Terminal Output */}
        <div
          ref={scrollViewRef}
          className="flex-1 overflow-y-auto p-3"
          style={{ height: 'calc(100% - 120px)' }}
        >
          {lines.map((line) => (
            <div 
              key={line.id} 
              style={getTextStyle(line.type)}
            >
              {line.content}
            </div>
          ))}
          
          {isProcessing && (
            <div style={{ ...cyberpunkStyles.warningText, fontSize: '14px', opacity: 0.7 }}>
              Processing...
            </div>
          )}
        </div>

        {/* Input Area */}
        <div style={{
          ...cyberpunkStyles.glowBox,
          margin: '8px',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '4px'
        }}>
          <span style={{ ...cyberpunkStyles.matrixText, fontSize: '14px', marginRight: '8px' }}>
            {getCurrentPrompt()}
          </span>
          <input
            style={{
              ...cyberpunkStyles.matrixText,
              fontSize: '14px',
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              minHeight: '30px'
            }}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleInputSubmit();
              }
            }}
            placeholder="Enter command..."
            disabled={isProcessing}
          />
          <button
            onClick={handleInputSubmit}
            disabled={isProcessing || !currentInput.trim()}
            style={{
              marginLeft: '8px',
              padding: '8px',
              background: 'transparent',
              border: 'none',
              color: '#00ff41',
              opacity: (isProcessing || !currentInput.trim()) ? 0.5 : 1,
              cursor: 'pointer'
            }}
          >
            <Send size={20} />
          </button>
        </div>

        {/* Quick Commands */}
        <div style={{
          ...cyberpunkStyles.glowBox,
          margin: '8px',
          padding: '8px',
          borderRadius: '4px'
        }}>
          <div style={{ ...cyberpunkStyles.matrixText, fontSize: '12px', marginBottom: '8px', textAlign: 'center' }}>
            Quick Commands
          </div>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'space-between',
            gap: '4px'
          }}>
            {quickCommands.map(cmd => (
              <button
                key={cmd}
                onClick={() => handleQuickCommand(cmd)}
                style={{
                  ...cyberpunkStyles.cyberpunkButton,
                  padding: '6px 12px',
                  borderRadius: '4px',
                  minWidth: '30%',
                  cursor: 'pointer'
                }}
              >
                <span style={{ ...cyberpunkStyles.matrixText, fontSize: '12px', fontWeight: 'bold' }}>
                  {cmd.toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileTerminalNative;
