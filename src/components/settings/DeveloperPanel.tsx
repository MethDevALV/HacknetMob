import React, { useState, useEffect } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { Bug, Terminal, Activity, Database, Settings, Trash2, Download, Upload, Eye, Code } from 'lucide-react';

export const DeveloperPanel: React.FC = () => {
  const { gameState, updateGameState, resetGameState } = useGameState();
  const [activeTab, setActiveTab] = useState<'debug' | 'logs' | 'editor' | 'network' | 'missions' | 'inspector'>('debug');
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [editValue, setEditValue] = useState<string>('');
  const [gameInspector, setGameInspector] = useState<any>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString();
      setDebugLogs(prev => [...prev.slice(-49), `[${timestamp}] System status check completed`]);
      
      // Update game inspector with real-time data
      setGameInspector({
        performance: {
          memory: (performance as any).memory ? {
            usedJSHeapSize: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024),
            totalJSHeapSize: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024)
          } : null,
          timing: performance.now()
        },
        gameState: {
          nodes: gameState.discoveredDevices?.length || 0,
          missions: gameState.activeMissions?.length || 0,
          credits: gameState.credits,
          trace: gameState.traceLevel
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [gameState]);

  const tabs = [
    { id: 'debug', label: 'Debug Console', icon: Bug },
    { id: 'logs', label: 'Game Logs', icon: Terminal },
    { id: 'inspector', label: 'Game Inspector', icon: Eye },
    { id: 'editor', label: 'State Editor', icon: Settings },
    { id: 'network', label: 'Network Sim', icon: Activity },
    { id: 'missions', label: 'Mission Debug', icon: Database }
  ];

  const handleStateEdit = () => {
    if (!selectedProperty || !editValue) return;
    
    try {
      const value = JSON.parse(editValue);
      updateGameState({ [selectedProperty]: value });
      setDebugLogs(prev => [...prev, `[DEV] Updated ${selectedProperty} to ${editValue}`]);
    } catch (error) {
      setDebugLogs(prev => [...prev, `[ERROR] Invalid JSON for ${selectedProperty}`]);
    }
  };

  const simulateNetworkEvent = (eventType: string) => {
    const timestamp = Date.now();
    switch (eventType) {
      case 'trace':
        updateGameState({ traceLevel: Math.min(gameState.traceLevel + 10, 100) });
        break;
      case 'disconnect':
        updateGameState({ currentNode: 'localhost' });
        break;
      case 'compromise':
        if (gameState.scannedNodes?.length > 0) {
          const node = gameState.scannedNodes[0];
          updateGameState({ 
            compromisedNodes: [...(gameState.compromisedNodes || []), node]
          });
        }
        break;
    }
    setDebugLogs(prev => [...prev, `[NETWORK] Simulated ${eventType} event`]);
  };

  const runDebugCommand = (command: string) => {
    const timestamp = new Date().toLocaleTimeString();
    switch (command) {
      case 'memory':
        if ((performance as any).memory) {
          const memory = (performance as any).memory;
          setDebugLogs(prev => [...prev, 
            `[${timestamp}] Memory Usage:`,
            `Used: ${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`,
            `Total: ${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`
          ]);
        }
        break;
      case 'performance':
        setDebugLogs(prev => [...prev, 
          `[${timestamp}] Performance:`,
          `Time: ${Math.round(performance.now())}ms`,
          `FPS: ${Math.round(1000 / 16)}` // Approximate
        ]);
        break;
      case 'state':
        setDebugLogs(prev => [...prev, 
          `[${timestamp}] Game State:`,
          `Nodes: ${gameState.discoveredDevices?.length || 0}`,
          `Missions: ${gameState.activeMissions?.length || 0}`,
          `Credits: ${gameState.credits}`
        ]);
        break;
      default:
        setDebugLogs(prev => [...prev, `[${timestamp}] Unknown command: ${command}`]);
    }
  };

  const completeMission = (missionId: string) => {
    if (gameState.activeMissions?.includes(missionId)) {
      updateGameState({
        activeMissions: gameState.activeMissions.filter(id => id !== missionId),
        completedMissions: [...(gameState.completedMissions || []), missionId],
        credits: gameState.credits + 1000,
        experience: gameState.experience + 500
      });
      setDebugLogs(prev => [...prev, `[MISSION] Force completed: ${missionId}`]);
    }
  };

  const exportGameState = () => {
    const dataStr = JSON.stringify(gameState, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hacknet-gamestate.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importGameState = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedState = JSON.parse(e.target?.result as string);
        updateGameState(importedState);
        setDebugLogs(prev => [...prev, '[DEV] Game state imported successfully']);
      } catch (error) {
        setDebugLogs(prev => [...prev, '[ERROR] Invalid game state file']);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-red-950/20 to-orange-950/20 border border-red-500/30 rounded-lg">
      {/* Header */}
      <div className="p-3 border-b border-red-500/30 bg-red-900/20">
        <h3 className="text-red-400 font-bold text-lg mb-2 flex items-center gap-2">
          <Bug size={20} />
          DEVELOPER PANEL
        </h3>
        <div className="text-xs text-red-300/70 mb-2">
          ⚠️ Warning: Development tools - Use with caution
        </div>
        
        {/* Tab Navigation */}
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1 px-2 py-1 text-xs border rounded whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-red-400 text-red-400 bg-red-400/20'
                    : 'border-red-500/30 text-red-300 hover:border-red-400'
                }`}
              >
                <Icon size={12} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {activeTab === 'debug' && (
          <div className="space-y-3">
            <div className="bg-black/40 border border-red-500/30 rounded p-3">
              <h4 className="text-red-400 font-bold mb-2">System Status</h4>
              <div className="text-xs space-y-1 font-mono">
                <div>Current Node: <span className="text-orange-400">{gameState.currentNode}</span></div>
                <div>Trace Level: <span className="text-orange-400">{gameState.traceLevel}%</span></div>
                <div>Credits: <span className="text-orange-400">${gameState.credits}</span></div>
                <div>RAM Usage: <span className="text-orange-400">{gameState.usedRAM}/{gameState.totalRAM} GB</span></div>
                <div>Active Missions: <span className="text-orange-400">{gameState.activeMissions?.length || 0}</span></div>
                <div>Compromised Nodes: <span className="text-orange-400">{gameState.compromisedNodes?.length || 0}</span></div>
              </div>
            </div>
            
            <div className="bg-black/40 border border-red-500/30 rounded p-3">
              <h4 className="text-red-400 font-bold mb-2">Debug Commands</h4>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <button
                  onClick={() => runDebugCommand('memory')}
                  className="bg-blue-600/20 border border-blue-500 rounded px-2 py-1 text-blue-400 text-xs hover:bg-blue-600/30"
                >
                  Memory
                </button>
                <button
                  onClick={() => runDebugCommand('performance')}
                  className="bg-green-600/20 border border-green-500 rounded px-2 py-1 text-green-400 text-xs hover:bg-green-600/30"
                >
                  Performance
                </button>
                <button
                  onClick={() => runDebugCommand('state')}
                  className="bg-purple-600/20 border border-purple-500 rounded px-2 py-1 text-purple-400 text-xs hover:bg-purple-600/30"
                >
                  State
                </button>
              </div>
            </div>
            
            <div className="bg-black/40 border border-red-500/30 rounded p-3">
              <h4 className="text-red-400 font-bold mb-2">Debug Console</h4>
              <div className="bg-black/60 border border-red-500/30 rounded p-2 h-32 overflow-y-auto text-xs font-mono text-green-400">
                {debugLogs.map((log, index) => (
                  <div key={index}>{log}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inspector' && (
          <div className="space-y-3">
            <div className="bg-black/40 border border-red-500/30 rounded p-3">
              <h4 className="text-red-400 font-bold mb-2">Game Inspector</h4>
              <div className="text-xs font-mono">
                <div className="mb-2">
                  <strong className="text-cyan-400">Performance:</strong>
                  {gameInspector.performance?.memory && (
                    <div className="ml-2">
                      Memory: {gameInspector.performance.memory.usedJSHeapSize}MB / {gameInspector.performance.memory.totalJSHeapSize}MB
                    </div>
                  )}
                  <div className="ml-2">Runtime: {Math.round(gameInspector.performance?.timing || 0)}ms</div>
                </div>
                <div>
                  <strong className="text-yellow-400">Game State:</strong>
                  <div className="ml-2">Discovered Nodes: {gameInspector.gameState?.nodes}</div>
                  <div className="ml-2">Active Missions: {gameInspector.gameState?.missions}</div>
                  <div className="ml-2">Credits: ${gameInspector.gameState?.credits}</div>
                  <div className="ml-2">Trace Level: {gameInspector.gameState?.trace}%</div>
                </div>
              </div>
            </div>
            
            <div className="bg-black/40 border border-red-500/30 rounded p-3">
              <h4 className="text-red-400 font-bold mb-2">Real-time Data</h4>
              <pre className="text-xs text-green-400 overflow-auto max-h-32">
                {JSON.stringify(gameInspector, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-3">
            <div className="bg-black/40 border border-red-500/30 rounded p-3">
              <h4 className="text-red-400 font-bold mb-2">Event Log</h4>
              <div className="bg-black/60 border border-red-500/30 rounded p-2 h-48 overflow-y-auto text-xs font-mono">
                {(gameState.eventLog || []).slice(-20).map((event, index) => (
                  <div key={index} className="text-green-400">
                    [{new Date(event.timestamp).toLocaleTimeString()}] {event.type}: {event.title}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-black/40 border border-red-500/30 rounded p-3">
              <h4 className="text-red-400 font-bold mb-2">System Logs</h4>
              <div className="bg-black/60 border border-red-500/30 rounded p-2 h-32 overflow-y-auto text-xs font-mono">
                {(gameState.systemLogs || []).slice(-15).map((log, index) => (
                  <div key={index} className="text-cyan-400">
                    [{new Date(log.timestamp).toLocaleTimeString()}] {log.source}: {log.action}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'editor' && (
          <div className="space-y-3">
            <div className="bg-black/40 border border-red-500/30 rounded p-3">
              <h4 className="text-red-400 font-bold mb-2">State Editor</h4>
              <div className="space-y-2">
                <select
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  className="w-full bg-black/60 border border-red-500/30 rounded px-2 py-1 text-red-400 text-xs"
                >
                  <option value="">Select property to edit</option>
                  <option value="credits">Credits</option>
                  <option value="experience">Experience</option>
                  <option value="traceLevel">Trace Level</option>
                  <option value="level">Level</option>
                  <option value="totalRAM">Total RAM</option>
                  <option value="usedRAM">Used RAM</option>
                </select>
                
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder="New value (JSON format)"
                  className="w-full bg-black/60 border border-red-500/30 rounded px-2 py-1 text-red-400 text-xs"
                />
                
                <button
                  onClick={handleStateEdit}
                  className="w-full bg-red-600/20 border border-red-500 rounded px-3 py-1 text-red-400 text-xs hover:bg-red-600/30"
                >
                  Update Property
                </button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={exportGameState}
                className="flex-1 flex items-center justify-center gap-1 bg-blue-600/20 border border-blue-500 rounded px-3 py-2 text-blue-400 text-xs hover:bg-blue-600/30"
              >
                <Download size={12} />
                Export State
              </button>
              
              <label className="flex-1 flex items-center justify-center gap-1 bg-green-600/20 border border-green-500 rounded px-3 py-2 text-green-400 text-xs hover:bg-green-600/30 cursor-pointer">
                <Upload size={12} />
                Import State
                <input
                  type="file"
                  accept=".json"
                  onChange={importGameState}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="space-y-3">
            <div className="bg-black/40 border border-red-500/30 rounded p-3">
              <h4 className="text-red-400 font-bold mb-2">Network Simulator</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => simulateNetworkEvent('trace')}
                  className="bg-yellow-600/20 border border-yellow-500 rounded px-3 py-2 text-yellow-400 text-xs hover:bg-yellow-600/30"
                >
                  Trigger Trace
                </button>
                <button
                  onClick={() => simulateNetworkEvent('disconnect')}
                  className="bg-red-600/20 border border-red-500 rounded px-3 py-2 text-red-400 text-xs hover:bg-red-600/30"
                >
                  Force Disconnect
                </button>
                <button
                  onClick={() => simulateNetworkEvent('compromise')}
                  className="bg-green-600/20 border border-green-500 rounded px-3 py-2 text-green-400 text-xs hover:bg-green-600/30"
                >
                  Auto Compromise
                </button>
                <button
                  onClick={() => updateGameState({ traceLevel: 0 })}
                  className="bg-blue-600/20 border border-blue-500 rounded px-3 py-2 text-blue-400 text-xs hover:bg-blue-600/30"
                >
                  Clear Traces
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'missions' && (
          <div className="space-y-3">
            <div className="bg-black/40 border border-red-500/30 rounded p-3">
              <h4 className="text-red-400 font-bold mb-2">Mission Debugger</h4>
              <div className="space-y-2">
                {(gameState.activeMissions || []).map(missionId => (
                  <div key={missionId} className="flex items-center justify-between bg-black/60 border border-red-500/30 rounded px-2 py-1">
                    <span className="text-red-400 text-xs">{missionId}</span>
                    <button
                      onClick={() => completeMission(missionId)}
                      className="bg-green-600/20 border border-green-500 rounded px-2 py-1 text-green-400 text-xs hover:bg-green-600/30"
                    >
                      Complete
                    </button>
                  </div>
                ))}
                {(gameState.activeMissions || []).length === 0 && (
                  <div className="text-red-300/60 text-xs text-center py-4">
                    No active missions to debug
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-red-500/30 bg-red-900/20">
        <div className="flex gap-2">
          <button
            onClick={resetGameState}
            className="flex items-center gap-1 bg-red-600/20 border border-red-500 rounded px-3 py-1 text-red-400 text-xs hover:bg-red-600/30"
          >
            <Trash2 size={12} />
            Reset Game
          </button>
        </div>
      </div>
    </div>
  );
};
