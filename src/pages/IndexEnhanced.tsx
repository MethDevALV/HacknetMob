
import React, { useEffect, useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { TerminalEnhanced } from '../components/TerminalEnhanced';
import NetworkMapDual from '../components/NetworkMapDual';
import FileSystemEnhanced from '../components/FileSystemEnhanced';
import { LocalhostInitializer } from '../core/LocalhostInitializer';
import { hackNetEngine } from '../core/HackNetEngine';

const IndexEnhanced: React.FC = () => {
  const { gameState, updateGameState } = useGameState();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      // Initialize localhost with realistic files
      LocalhostInitializer.initializeLocalhostFiles();
      LocalhostInitializer.addHackingTools();
      
      // Initialize HackNet Engine
      hackNetEngine.initialize(gameState, updateGameState);
      
      setIsInitialized(true);
      console.log('[IndexEnhanced] System initialized successfully');
    }
  }, [gameState, updateGameState, isInitialized]);

  const handleNodeConnect = (nodeIp: string) => {
    console.log(`[IndexEnhanced] Connected to node: ${nodeIp}`);
  };

  return (
    <div className="h-screen bg-black text-green-400 font-mono overflow-hidden">
      {/* Header */}
      <div className="h-12 bg-gradient-to-r from-black via-gray-900 to-black border-b border-green-400/30 flex items-center px-4">
        <div className="flex items-center gap-4">
          <div className="text-cyan-400 font-bold text-lg">HACKNET TERMINAL</div>
          <div className="text-green-400/60 text-sm">v2.1.0</div>
        </div>
        
        <div className="ml-auto flex items-center gap-6 text-sm">
          <div className="text-green-400/70">
            NODE: <span className="text-cyan-400">{gameState.currentNode}</span>
          </div>
          <div className="text-green-400/70">
            PATH: <span className="text-green-400">{gameState.currentDirectory}</span>
          </div>
          <div className="text-green-400/70">
            RAM: <span className="text-yellow-400">{gameState.usedRAM.toFixed(1)}GB</span>/{gameState.totalRAM}GB
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100vh-3rem)] flex">
        {/* Left Panel - Terminal */}
        <div className="w-1/2 p-2">
          <TerminalEnhanced />
        </div>

        {/* Right Panel - Split between Network Map and File System */}
        <div className="w-1/2 p-2 flex flex-col gap-2">
          {/* Network Map - Top Half */}
          <div className="h-1/2">
            <NetworkMapDual onNodeConnect={handleNodeConnect} />
          </div>

          {/* File System - Bottom Half */}
          <div className="h-1/2">
            <FileSystemEnhanced />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-black border-t border-green-400/30 flex items-center px-4 text-xs">
        <div className="flex items-center gap-4">
          <div className="text-green-400/60">
            DEVICES: {gameState.discoveredDevices?.length || 0}
          </div>
          <div className="text-green-400/60">
            COMPROMISED: {gameState.compromisedNodes?.length || 0}
          </div>
          <div className="text-green-400/60">
            TRACE: {gameState.traceLevel.toFixed(1)}%
          </div>
        </div>

        <div className="ml-auto text-green-400/60">
          HACKNET SIMULATION ACTIVE
        </div>
      </div>
    </div>
  );
};

export default IndexEnhanced;
