import React, { useState, useRef, useEffect } from 'react';
import { Play, Trash2, Download, Upload } from 'lucide-react';
import { useGameState } from '../../hooks/useGameState';

interface DebugCommand {
  id: string;
  command: string;
  result: any;
  timestamp: Date;
  type: 'success' | 'error' | 'info';
}

export const DebugConsole: React.FC = () => {
  const { gameState, updateGameState } = useGameState();
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<DebugCommand[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = () => {
    if (!command.trim()) return;

    const newCommand: DebugCommand = {
      id: Date.now().toString(),
      command: command.trim(),
      result: null,
      timestamp: new Date(),
      type: 'info'
    };

    try {
      // Parse and execute debug commands
      const result = evaluateDebugCommand(command.trim());
      newCommand.result = result;
      newCommand.type = 'success';
    } catch (error) {
      newCommand.result = error.message;
      newCommand.type = 'error';
    }

    setHistory(prev => [...prev, newCommand]);
    setCommandHistory(prev => [...prev, command.trim()]);
    setCommand('');
    setHistoryIndex(-1);
  };

  const evaluateDebugCommand = (cmd: string): any => {
    const [action, ...args] = cmd.split(' ');

    switch (action.toLowerCase()) {
      case 'help':
        return [
          'Available debug commands:',
          'help - Show this help',
          'state - Show current game state',
          'set <key> <value> - Set game state value',
          'get <key> - Get game state value',
          'reset - Reset game state',
          'credits <amount> - Set credits',
          'trace <level> - Set trace level',
          'unlock <tool> - Unlock hacking tool',
          'mission <id> - Complete mission',
          'node <ip> - Add network node',
          'clear - Clear console',
          'export - Export game state',
          'import <data> - Import game state'
        ].join('\n');

      case 'state':
        return JSON.stringify(gameState, null, 2);

      case 'set':
        if (args.length < 2) throw new Error('Usage: set <key> <value>');
        const key = args[0];
        const value = args.slice(1).join(' ');
        let parsedValue;
        try {
          parsedValue = JSON.parse(value);
        } catch {
          parsedValue = value;
        }
        updateGameState({ [key]: parsedValue });
        return `Set ${key} = ${parsedValue}`;

      case 'get':
        if (args.length < 1) throw new Error('Usage: get <key>');
        const getKey = args[0];
        return JSON.stringify(gameState[getKey as keyof typeof gameState], null, 2);

      case 'reset':
        // Reset to initial state
        updateGameState({
          credits: 1000,
          experience: 0,
          level: 1,
          traceLevel: 0,
          currentDirectory: '/home/user',
          currentNode: 'localhost',
          discoveredDevices: [],
          scannedNodes: [],
          connectedNodes: [],
          activeMissions: [],
          completedMissions: [],
          compromisedNodes: [],
          crackedPorts: [],
        });
        return 'Game state reset to initial values';

      case 'credits':
        if (args.length < 1) throw new Error('Usage: credits <amount>');
        const credits = parseInt(args[0]);
        if (isNaN(credits)) throw new Error('Invalid credit amount');
        updateGameState({ credits });
        return `Credits set to ${credits}`;

      case 'trace':
        if (args.length < 1) throw new Error('Usage: trace <level>');
        const trace = parseInt(args[0]);
        if (isNaN(trace) || trace < 0 || trace > 100) throw new Error('Trace level must be 0-100');
        updateGameState({ traceLevel: trace });
        return `Trace level set to ${trace}%`;

      case 'unlock':
        if (args.length < 1) throw new Error('Usage: unlock <tool>');
        const tool = args[0];
        const currentTools = gameState.unlockedTools || [];
        if (!currentTools.includes(tool)) {
          updateGameState({ unlockedTools: [...currentTools, tool] });
          return `Unlocked tool: ${tool}`;
        }
        return `Tool ${tool} already unlocked`;

      case 'mission':
        if (args.length < 1) throw new Error('Usage: mission <id>');
        const missionId = args[0];
        const completedMissions = gameState.completedMissions || [];
        if (!completedMissions.includes(missionId)) {
          updateGameState({ 
            completedMissions: [...completedMissions, missionId],
            credits: gameState.credits + 1000,
            experience: gameState.experience + 500
          });
          return `Completed mission: ${missionId}`;
        }
        return `Mission ${missionId} already completed`;

      case 'node':
        if (args.length < 1) throw new Error('Usage: node <ip>');
        const ip = args[0];
        const discoveredDevices = gameState.discoveredDevices || [];
        const newNode = {
          id: `debug-${ip}`,
          name: `Debug Node ${ip}`,
          ip,
          hostname: `debug-${ip.replace(/\./g, '-')}`,
          type: 'server' as const,
          os: 'Linux Debug 1.0',
          security: 'low' as const,
          compromised: false,
          discovered: true,
          connections: [],
          x: Math.random() * 400,
          y: Math.random() * 300,
          services: [],
          links: [],
          openPorts: [22, 80],
          difficulty: 'easy' as const,
          ports: [
            { number: 22, service: 'SSH', open: true, cracked: false, version: '2.0' },
            { number: 80, service: 'HTTP', open: true, cracked: false, version: '1.1' }
          ]
        };
        updateGameState({ discoveredDevices: [...discoveredDevices, newNode] });
        return `Added debug node: ${ip}`;

      case 'clear':
        setHistory([]);
        return 'Console cleared';

      case 'export':
        return JSON.stringify(gameState, null, 2);

      case 'import':
        if (args.length < 1) throw new Error('Usage: import <json_data>');
        const jsonData = args.join(' ');
        const importedState = JSON.parse(jsonData);
        updateGameState(importedState);
        return 'Game state imported successfully';

      default:
        throw new Error(`Unknown command: ${action}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : -1;
        setHistoryIndex(newIndex);
        setCommand(newIndex === -1 ? '' : commandHistory[newIndex]);
      }
    }
  };

  const clearConsole = () => {
    setHistory([]);
  };

  const exportHistory = () => {
    const data = JSON.stringify(history, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'debug-history.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Console Output */}
      <div 
        ref={consoleRef}
        className="flex-1 p-4 overflow-y-auto bg-black text-green-400 font-mono text-sm"
      >
        <div className="mb-4 text-green-300">
          Debug Console v1.0 - Type 'help' for available commands
        </div>
        
        {history.map(entry => (
          <div key={entry.id} className="mb-3">
            <div className="text-green-300 text-xs">
              [{entry.timestamp.toLocaleTimeString()}]
            </div>
            <div className="text-cyan-400">
              {/* Fixed syntax error here */}
              {'>'} {entry.command}
            </div>
            <div className={`whitespace-pre-wrap mt-1 ${
              entry.type === 'error' ? 'text-red-400' :
              entry.type === 'success' ? 'text-green-400' :
              'text-gray-300'
            }`}>
              {entry.result}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-theme-surface border-t border-theme-border">
        <div className="flex gap-2 mb-3">
          <button
            onClick={executeCommand}
            className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
          >
            <Play size={14} />
            Execute
          </button>
          <button
            onClick={clearConsole}
            className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
          >
            <Trash2 size={14} />
            Clear
          </button>
          <button
            onClick={exportHistory}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
          >
            <Download size={14} />
            Export
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-theme-primary font-mono">{'>'}</span>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter debug command..."
            className="flex-1 bg-black text-green-400 font-mono px-2 py-1 border border-green-600 rounded focus:outline-none focus:border-green-400"
          />
        </div>
      </div>
    </div>
  );
};
