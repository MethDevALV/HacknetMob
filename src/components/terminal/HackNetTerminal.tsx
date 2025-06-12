import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { hackNetEngine } from '../../core/HackNetEngine';
import { TerminalInput, TerminalInputRef } from './TerminalInput';
import { TerminalOutput } from './TerminalOutput';
import { TerminalLine } from '../../types/CoreTypes';

export const HackNetTerminal: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const { gameState, updateGameState } = useGameState();
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<TerminalInputRef>(null);

  useEffect(() => {
    // Initialize HackNet Engine
    hackNetEngine.initialize(gameState, updateGameState);
    
    // Welcome message
    const welcomeLines: TerminalLine[] = [
      {
        id: 'welcome-1',
        type: 'system',
        content: '██╗  ██╗ █████╗  ██████╗██╗  ██╗███╗   ██╗███████╗████████╗',
        timestamp: new Date()
      },
      {
        id: 'welcome-2', 
        type: 'system',
        content: '██║  ██║██╔══██╗██╔════╝██║ ██╔╝████╗  ██║██╔════╝╚══██╔══╝',
        timestamp: new Date()
      },
      {
        id: 'welcome-3',
        type: 'system', 
        content: '███████║███████║██║     █████╔╝ ██╔██╗ ██║█████╗     ██║',
        timestamp: new Date()
      },
      {
        id: 'welcome-4',
        type: 'system',
        content: '██╔══██║██╔══██║██║     ██╔═██╗ ██║╚██╗██║██╔══╝     ██║', 
        timestamp: new Date()
      },
      {
        id: 'welcome-5',
        type: 'system',
        content: '██║  ██║██║  ██║╚██████╗██║  ██╗██║ ╚████║███████╗   ██║',
        timestamp: new Date()
      },
      {
        id: 'welcome-6',
        type: 'system',
        content: '╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝',
        timestamp: new Date()
      },
      {
        id: 'welcome-7',
        type: 'output',
        content: '',
        timestamp: new Date()
      },
      {
        id: 'welcome-8',
        type: 'output', 
        content: '🔥 Welcome to HackNet - Advanced Network Simulation 🔥',
        timestamp: new Date()
      },
      {
        id: 'welcome-9',
        type: 'output',
        content: 'Your mission: Infiltrate corporate networks and complete objectives.',
        timestamp: new Date()
      },
      {
        id: 'welcome-10',
        type: 'output',
        content: 'Type "help" for commands or "scan" to discover targets.',
        timestamp: new Date()
      },
      {
        id: 'welcome-11',
        type: 'warning',
        content: '⚠️  WARNING: Unauthorized access is illegal. This is a simulation. ⚠️',
        timestamp: new Date()
      },
      {
        id: 'welcome-12',
        type: 'output',
        content: '',
        timestamp: new Date()
      }
    ];
    
    setLines(welcomeLines);

    // Setup event listeners
    const handleMissionCompleted = (mission: any) => {
      addLine('system', `🎯 MISSION COMPLETED: ${mission.title}`);
      addLine('system', `💰 Reward: ${mission.reward} credits`);
    };

    const handleNodeCompromised = (nodeIp: string) => {
      addLine('system', `🔓 Node ${nodeIp} successfully compromised!`);
    };

    const handleTraceComplete = (nodeIp: string) => {
      addLine('error', '🚨 TRACE COMPLETE - CONNECTION TERMINATED 🚨');
      addLine('error', 'You have been detected and disconnected!');
    };

    hackNetEngine.on('missionCompleted', handleMissionCompleted);
    hackNetEngine.on('nodeCompromised', handleNodeCompromised); 
    hackNetEngine.on('traceComplete', handleTraceComplete);

    return () => {
      hackNetEngine.off('missionCompleted', handleMissionCompleted);
      hackNetEngine.off('nodeCompromised', handleNodeCompromised);
      hackNetEngine.off('traceComplete', handleTraceComplete);
      hackNetEngine.destroy();
    };
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
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

  const handleCommand = async (command: string) => {
    const prompt = `${gameState.currentNode}:${gameState.currentDirectory}$`;
    addLine('input', `${prompt} ${command}`);
    
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    setCurrentInput('');
    setIsProcessing(true);

    try {
      const result = await processCommand(command);
      result.forEach(line => {
        addLine('output', line);
      });
    } catch (error) {
      addLine('error', `Error: ${error}`);
    }

    setIsProcessing(false);
  };

  const processCommand = async (command: string): Promise<string[]> => {
    const parts = command.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Track command execution
    if (updateGameState && gameState.executedCommands) {
      updateGameState({
        executedCommands: [...gameState.executedCommands, command]
      });
    }

    switch (cmd) {
      case 'help':
        return getHelpText();
      
      case 'scan':
        return await handleScan();
      
      case 'connect':
        return await handleConnect(args);
      
      case 'disconnect': 
        return handleDisconnect();
      
      case 'ls':
        return handleLs(args);
      
      case 'cd':
        return handleCd(args);
      
      case 'cat':
        return handleCat(args);
      
      case 'rm':
        return handleRm(args);
      
      case 'sshcrack':
      case 'porthack':
        return await handlePortHack(args);
      
      case 'probe':
        return handleProbe(args);
      
      case 'ps':
        return handlePs();
      
      case 'missions':
        return handleMissions();
      
      case 'tools':
        return handleTools();
      
      case 'trace':
        return handleTrace();
      
      case 'clear':
        setLines([]);
        return [];
      
      default:
        return [`Command not found: ${cmd}. Type 'help' for available commands.`];
    }
  };

  const getHelpText = (): string[] => {
    return [
      '🔧 HackNet Terminal Commands:',
      '',
      '📡 NETWORK:',
      '  scan              - Discover devices on the network',
      '  probe <ip>        - Get detailed information about a target',
      '  connect <ip>      - Connect to a compromised device',
      '  disconnect        - Disconnect from current device',
      '',
      '🗂️  FILES:',
      '  ls [path]         - List directory contents',
      '  cd <path>         - Change directory',
      '  cat <file>        - Read file contents',
      '  rm <file>         - Delete file',
      '',
      '⚔️  HACKING:',
      '  sshcrack <ip>     - Crack SSH on target (port 22)',
      '  porthack <ip>     - Generic port cracking tool',
      '',
      '🎯 GAME:',
      '  missions          - View active missions',
      '  tools             - List available hacking tools',
      '  trace             - Check current trace level',
      '  ps                - Show running processes',
      '  clear             - Clear terminal',
      '',
      '💡 TIP: Start with "scan" to discover targets!'
    ];
  };

  const handleScan = async (): Promise<string[]> => {
    const nodes = hackNetEngine.scanNetwork(gameState.currentNode);
    
    const output = [
      '🔍 Scanning network from ' + gameState.currentNode + '...',
      '📡 Probing for active devices...',
      '',
      '📋 SCAN RESULTS:',
      '════════════════════════════════════════════════════',
      ''
    ];

    if (nodes.length === 0) {
      output.push('❌ No new devices discovered.');
      output.push('💡 TIP: Try scanning from a different network segment.');
    } else {
      nodes.forEach(node => {
        output.push(`🖥️  Device: ${node.hostname} (${node.ip})`);
        output.push(`   Type: ${node.type.toUpperCase()}`);
        output.push(`   OS: ${node.os}`);
        output.push(`   Security: ${node.security.toUpperCase()}`);
        output.push(`   Status: ${node.compromised ? '🔓 COMPROMISED' : '🔒 SECURED'}`);
        output.push('   ────────────────────────────────────────');
      });
      
      output.push('');
      output.push(`✅ Found ${nodes.length} new device(s).`);
      output.push('💡 Use "probe <ip>" for detailed info or "sshcrack <ip>" to hack.');
    }

    return output;
  };

  const handleConnect = async (args: string[]): Promise<string[]> => {
    if (args.length === 0) {
      return ['❌ Usage: connect <ip_address>'];
    }

    const targetIp = args[0];
    const success = hackNetEngine.connectToNode(targetIp);

    if (success) {
      return [
        `🔗 Establishing connection to ${targetIp}...`,
        `✅ Connected successfully!`,
        `🖥️  Welcome to ${targetIp}`,
        '💡 You now have full access to this system.'
      ];
    } else {
      return [
        `❌ Connection to ${targetIp} failed.`,
        '🔒 Target system is not compromised.',
        '💡 Use hacking tools to gain access first.'
      ];
    }
  };

  const handleDisconnect = (): string[] => {
    if (updateGameState) {
      updateGameState({
        currentNode: 'localhost',
        currentDirectory: '/home/user'
      });
    }
    
    return [
      '🔌 Disconnecting from remote system...',
      '🏠 Returned to localhost',
      '✅ Connection terminated safely.'
    ];
  };

  const handlePortHack = async (args: string[]): Promise<string[]> => {
    if (args.length === 0) {
      return ['❌ Usage: sshcrack <ip_address>'];
    }

    const targetIp = args[0];
    
    addLine('system', `🔓 Initiating SSH crack on ${targetIp}...`);
    addLine('system', '⚡ Launching brute force attack...');
    
    const success = await hackNetEngine.executeHackingTool('ssh_crack', targetIp);
    
    if (success) {
      // Update game state to reflect cracked port
      if (updateGameState && gameState.crackedPorts) {
        updateGameState({
          crackedPorts: [...gameState.crackedPorts, `${targetIp}:22`]
        });
      }
      
      return [
        '🎉 SSH CRACK SUCCESSFUL!',
        `🔓 Port 22 on ${targetIp} has been compromised.`,
        '✅ You can now connect to this system.',
        '💡 Use "connect <ip>" to access the target.'
      ];
    } else {
      return [
        '❌ SSH crack failed.',
        '🛡️  Target has strong security measures.',
        '💡 Try again or use different tools.'
      ];
    }
  };

  const handleProbe = (args: string[]): string[] => {
    if (args.length === 0) {
      return ['❌ Usage: probe <ip_address>'];
    }

    // This would get detailed info from NetworkManager
    return [
      `🔍 Probing ${args[0]}...`,
      '📊 Gathering system information...',
      '',
      '🖥️  System Details:',
      '  Hostname: [REDACTED]',
      '  OS: Linux/Windows [DETECTING...]',
      '  Open Ports: 22, 80, 443',
      '  Services: SSH, HTTP, HTTPS',
      '  Firewall: ACTIVE',
      '',
      '🔒 Security Assessment: MEDIUM-HIGH',
      '💡 Recommendation: Use SSH crack or advanced exploits.'
    ];
  };

  const handleLs = (args: string[]): string[] => {
    // This would interface with FileSystemManager
    return [
      '📁 Directory listing:',
      '',
      'drwxr-xr-x  user  Documents/',
      'drwxr-xr-x  user  Downloads/', 
      '-rw-r--r--  user  readme.txt',
      '-rw-------  user  passwords.txt',
      '-rw-r--r--  user  config.ini',
      '',
      '💡 Use "cat <filename>" to read files.'
    ];
  };

  const handleCd = (args: string[]): string[] => {
    if (args.length === 0) {
      return ['❌ Usage: cd <directory>'];
    }
    
    // Update current directory in game state
    if (updateGameState) {
      updateGameState({
        currentDirectory: args[0]
      });
    }
    
    return [`📂 Changed directory to: ${args[0]}`];
  };

  const handleCat = (args: string[]): string[] => {
    if (args.length === 0) {
      return ['❌ Usage: cat <filename>'];
    }
    
    // Mock file contents based on filename
    const filename = args[0];
    if (filename === 'readme.txt') {
      return [
        '📄 readme.txt:',
        '',
        'Welcome to HackNet!',
        '',
        'This is a network infiltration simulation.',
        'Your goal is to complete missions by hacking into',
        'various computer systems and networks.',
        '',
        'Good luck, hacker!'
      ];
    }
    
    if (filename === 'passwords.txt') {
      return [
        '📄 passwords.txt:',
        '',
        '🔑 CONFIDENTIAL - DO NOT SHARE',
        '',
        'admin:password123',
        'user:qwerty456', 
        'root:admin2024',
        'guest:welcome1',
        '',
        '💡 These credentials might be useful...'
      ];
    }
    
    return [`❌ File not found: ${filename}`];
  };

  const handleRm = (args: string[]): string[] => {
    if (args.length === 0) {
      return ['❌ Usage: rm <filename>'];
    }
    
    const filename = args[0];
    
    // Track deleted files
    if (updateGameState && gameState.deletedFiles) {
      const filePath = `${gameState.currentNode}:${gameState.currentDirectory}/${filename}`;
      updateGameState({
        deletedFiles: [...gameState.deletedFiles, filePath]
      });
    }
    
    return [
      `🗑️  Deleting ${filename}...`,
      '✅ File deleted successfully.',
      '⚠️  This action cannot be undone!'
    ];
  };

  const handlePs = (): string[] => {
    return [
      '🔄 Running Processes:',
      '',
      'PID   CPU%  RAM   Process Name',
      '───────────────────────────────',
      '1001  2.1%  128M  ssh_daemon',
      '1034  0.8%  64M   web_server',
      '1056  15.2% 256M  ssh_crack',
      '1089  5.4%  512M  network_scan',
      '1102  1.2%  32M   trace_killer',
      '',
      '💡 Use "kill <pid>" to terminate processes.'
    ];
  };

  const handleMissions = (): string[] => {
    const activeMissions = hackNetEngine.getActiveMissions();
    
    if (activeMissions.length === 0) {
      return [
        '🎯 No active missions.',
        '💡 Complete tutorial objectives to unlock missions.'
      ];
    }
    
    const output = ['🎯 Active Missions:', ''];
    
    activeMissions.forEach(mission => {
      output.push(`📋 ${mission.title} (${mission.difficulty.toUpperCase()})`);
      output.push(`   ${mission.description}`);
      output.push(`   Reward: ${mission.reward} credits`);
      output.push('   ────────────────────────────────');
    });
    
    return output;
  };

  const handleTools = (): string[] => {
    const tools = hackNetEngine.getAvailableTools();
    
    const output = ['⚔️  Available Hacking Tools:', ''];
    
    tools.forEach(tool => {
      output.push(`🔧 ${tool.name}`);
      output.push(`   ${tool.description}`);
      output.push(`   Target: Port ${tool.targetPort || 'Multiple'}`);
      output.push(`   Success Rate: ${(tool.successRate * 100).toFixed(0)}%`);
      output.push('   ────────────────────────────────');
    });
    
    return output;
  };

  const handleTrace = (): string[] => {
    const traceLevel = gameState.traceLevel || 0;
    const status = traceLevel < 30 ? '🟢 SAFE' : traceLevel < 70 ? '🟡 CAUTION' : '🔴 DANGER';
    
    return [
      '🕵️ Trace Status:',
      '',
      `📊 Current Level: ${traceLevel.toFixed(1)}%`,
      `🚨 Status: ${status}`,
      '',
      traceLevel < 30 ? '✅ You are operating safely.' :
      traceLevel < 70 ? '⚠️  You are being tracked. Be careful!' :
      '🚨 CRITICAL: You are about to be detected!',
      '',
      '💡 Use trace-killing tools to reduce detection.'
    ];
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-black text-green-400 font-mono relative">
      {/* Terminal Header with Matrix-style effects */}
      <div className="bg-gray-900 p-3 border-b border-green-600 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-green-300 font-bold">HackNet Terminal v2.0</span>
        </div>
        <div className="text-green-300 text-sm">
          Node: {gameState.currentNode} | Trace: {(gameState.traceLevel || 0).toFixed(1)}%
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto bg-black terminal-content"
        style={{
          textShadow: '0 0 5px rgba(0, 255, 0, 0.5)',
          background: 'linear-gradient(transparent 98%, rgba(0, 255, 0, 0.03) 100%)',
          backgroundSize: '100% 2px'
        }}
      >
        <TerminalOutput lines={lines} isProcessing={isProcessing} />
        
        <TerminalInput
          ref={inputRef}
          currentInput={currentInput}
          onInputChange={setCurrentInput}
          onSubmit={handleCommand}
          onKeyDown={handleKeyDown}
          isProcessing={isProcessing}
          currentNode={gameState.currentNode}
          currentDirectory={gameState.currentDirectory}
        />
      </div>
    </div>
  );
};
