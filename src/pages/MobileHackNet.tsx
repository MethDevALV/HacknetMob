import React, { useState, useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { MobileNavDock } from '../components/ui/navigation/MobileNavDock';
import { FloatingTerminalAdvanced } from '../components/ui/navigation/FloatingTerminalAdvanced';
import { ResponsiveHeader } from '../components/ui/layout/ResponsiveHeader';
import { CyberpunkEffects } from '../components/ui/effects/CyberpunkEffects';
import { useIsMobile } from '../hooks/use-mobile';
import { TerminalEnhanced } from '../components/TerminalEnhanced';
import { MobileTerminal } from '../components/MobileTerminal';
import NetworkMapDual from '../components/NetworkMapDual';
import FileSystemEnhanced from '../components/FileSystemEnhanced';
import { MissionPanelEnhanced } from '../components/MissionPanelEnhanced';
import { EmailSystem } from '../components/game/EmailSystem';
import { ToolkitPanel } from '../components/ToolkitPanel';
import { DevToolsPanel } from '../components/dev/DevToolsPanel';
import { SettingsPanel } from '../components/SettingsPanel';
import { LocalhostInitializer } from '../core/LocalhostInitializer';
import { hackNetEngine } from '../core/HackNetEngine';

const MobileHackNet: React.FC = () => {
  const [activePanel, setActivePanel] = useState('terminal');
  const [isInitialized, setIsInitialized] = useState(false);
  const [showFloatingTerminal, setShowFloatingTerminal] = useState(false);
  const { gameState, updateGameState } = useGameState();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isInitialized) {
      // Initialize localhost with realistic files
      LocalhostInitializer.initializeLocalhostFiles();
      LocalhostInitializer.addHackingTools();
      
      // Initialize HackNet Engine
      hackNetEngine.initialize(gameState, updateGameState);
      
      setIsInitialized(true);
      console.log('[MobileHackNet] System initialized successfully');
    }
  }, [gameState, updateGameState, isInitialized]);

  // Show floating terminal when not on terminal tab
  useEffect(() => {
    if (isMobile) {
      setShowFloatingTerminal(activePanel !== 'terminal');
    }
  }, [activePanel, isMobile]);

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'terminal':
        return isMobile ? <MobileTerminal /> : <TerminalEnhanced />;
      case 'files':
        return <FileSystemEnhanced />;
      case 'network':
        return <NetworkMapDual onNodeConnect={(nodeIp) => console.log('Connected to:', nodeIp)} />;
      case 'missions':
        return <MissionPanelEnhanced />;
      case 'email':
        return <EmailSystem />;
      case 'tools':
        return <ToolkitPanel />;
      case 'devtools':
        return <DevToolsPanel />;
      case 'settings':
      case 'options':
        return <SettingsPanel />;
      default:
        return isMobile ? <MobileTerminal /> : <TerminalEnhanced />;
    }
  };

  return (
    <div className="h-screen bg-black text-green-400 font-mono overflow-hidden flex flex-col relative">
      {/* Cyberpunk background effects */}
      <CyberpunkEffects />
      
      {/* Header */}
      <ResponsiveHeader />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative z-10">
        {/* Mobile: Full screen single panel */}
        {isMobile ? (
          <div className="h-full pb-20">
            {renderActivePanel()}
          </div>
        ) : (
          /* Desktop: Split view */
          <div className="h-full flex">
            <div className="w-1/2 p-2">
              <TerminalEnhanced />
            </div>
            <div className="w-1/2 p-2 flex flex-col gap-2">
              <div className="h-1/2">
                <NetworkMapDual onNodeConnect={(nodeIp) => console.log('Connected to:', nodeIp)} />
              </div>
              <div className="h-1/2">
                <FileSystemEnhanced />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {isMobile && (
        <MobileNavDock 
          activePanel={activePanel} 
          onPanelChange={setActivePanel} 
        />
      )}

      {/* Floating Terminal */}
      {isMobile && (
        <FloatingTerminalAdvanced
          isVisible={showFloatingTerminal}
          onToggleVisibility={() => setShowFloatingTerminal(!showFloatingTerminal)}
          currentPanel={activePanel}
        />
      )}

      {/* Desktop Status Bar */}
      {!isMobile && (
        <div className="h-6 bg-black border-t border-green-400/30 flex items-center px-4 text-xs relative z-10">
          <div className="flex items-center gap-4">
            <div className="text-green-400/60 font-mono">
              DEVICES: {gameState.discoveredDevices?.length || 0}
            </div>
            <div className="text-green-400/60 font-mono">
              COMPROMISED: {gameState.compromisedNodes?.length || 0}
            </div>
            <div className="text-green-400/60 font-mono">
              TRACE: {gameState.traceLevel?.toFixed(1) || 0}%
            </div>
          </div>

          <div className="ml-auto text-green-400/60 font-mono">
            HACKNET SIMULATION ACTIVE
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileHackNet;
