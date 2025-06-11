import React, { useState, useEffect } from 'react';
import { TerminalEnhanced } from '../components/TerminalEnhanced';
import { NetworkMap } from '../components/NetworkMap';
import { ResourceMonitorEnhanced } from '../components/ResourceMonitorEnhanced';
import { FileSystemEnhanced } from '../components/FileSystemEnhanced';
import { MissionPanel } from '../components/MissionPanel';
import { ToolkitPanel } from '../components/ToolkitPanel';
import { SettingsPanel } from '../components/SettingsPanel';
import { IntrusionAlert } from '../components/IntrusionAlert';
import { Header } from '../components/layout/Header';
import { Navigation } from '../components/layout/Navigation';
import { useGameStateEnhanced } from '../hooks/useGameStateEnhanced';
import { useIntrusionDetection } from '../hooks/useIntrusionDetection';
import { systemResourceManager } from '../utils/SystemResources';
import { CounterAttackSystem } from '../utils/CounterAttack';
import { networkSystemEnhanced } from '../systems/NetworkSystemEnhanced';
import { gameCore } from '../core/GameCore';
import { Shield } from 'lucide-react';

const IndexEnhanced = () => {
  const { gameState, updateGameState } = useGameStateEnhanced();
  const { intrusionState, handleTimeExpired } = useIntrusionDetection();
  const [activePanel, setActivePanel] = useState<'terminal' | 'network' | 'files' | 'missions' | 'toolkit' | 'settings'>('terminal');
  const [showQuickCommands, setShowQuickCommands] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [counterAttackSystem] = useState(() => new CounterAttackSystem());
  const [systemStatus, setSystemStatus] = useState({
    underAttack: false,
    resourcesStressed: false,
    traceWarning: false
  });

  useEffect(() => {
    document.body.style.backgroundColor = '#000000';
    document.body.style.color = '#00FF41';
    document.body.style.fontFamily = 'Monaco, "Lucida Console", monospace';

    // Initialize GameCore with game state
    gameCore.setGameState(gameState, updateGameState);

    // Initialize network system with game state updater
    networkSystemEnhanced.setGameStateUpdater(updateGameState);

    // Monitor system status
    const statusInterval = setInterval(() => {
      const resources = systemResourceManager.getResources();
      const underAttack = counterAttackSystem.isCurrentlyUnderAttack();
      const resourcesStressed = resources.cpu.current > 85 || resources.temperature.current > 75;
      const traceWarning = gameState.traceLevel >= 70;

      setSystemStatus({
        underAttack,
        resourcesStressed,
        traceWarning
      });
    }, 1000);

    return () => clearInterval(statusInterval);
  }, [gameState.traceLevel, counterAttackSystem, updateGameState, gameState, updateGameState]);

  const handleSettingsToggle = () => {
    if (showSettings) {
      setShowSettings(false);
      setActivePanel('terminal');
    } else {
      setShowSettings(true);
      setActivePanel('settings');
    }
  };

  const handlePanelChange = (panel: string) => {
    setActivePanel(panel as any);
    setShowSettings(false);
  };

  const containerClasses = `min-h-screen bg-black text-matrix-green font-mono flex flex-col overflow-hidden relative ${
    systemStatus.underAttack ? 'under-attack' : ''
  } ${
    systemStatus.resourcesStressed ? 'system-stressed' : ''
  }`;

  return (
    <div className={containerClasses}>
      {/* Intrusion Detection Alert */}
      <IntrusionAlert
        isActive={intrusionState.isDetected}
        timeRemaining={intrusionState.timeRemaining}
        securityLevel={intrusionState.securityLevel}
        targetNode={intrusionState.targetNode}
        onTimeExpired={handleTimeExpired}
      />

      {/* Counter-attack warning */}
      {systemStatus.underAttack && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-red-900/80 border-b border-red-500 p-2">
          <div className="flex items-center justify-center gap-2 text-red-300">
            <Shield size={20} className="animate-pulse" />
            <span className="font-bold">SYSTEM UNDER COUNTER-ATTACK</span>
            <span className="text-sm">Use defense commands in terminal</span>
          </div>
        </div>
      )}

      {/* Matrix background effect */}
      <div className="matrix-rain fixed inset-0 opacity-20 pointer-events-none z-0" />
      
      {/* Header */}
      <Header gameState={gameState} systemStatus={systemStatus} />

      {/* Mobile resource monitor */}
      <div className="sm:hidden p-2 border-b border-matrix-green/30 bg-black/80">
        <ResourceMonitorEnhanced />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 relative z-10">
        <div className="flex-1 min-h-0 bg-black/80 backdrop-blur-sm">
          {activePanel === 'terminal' && <TerminalEnhanced />}
          {activePanel === 'network' && <NetworkMap />}
          {activePanel === 'files' && <FileSystemEnhanced />}
          {activePanel === 'missions' && <MissionPanel />}
          {activePanel === 'toolkit' && <ToolkitPanel />}
          {activePanel === 'settings' && <SettingsPanel />}
        </div>
      </div>

      {/* Navigation */}
      <Navigation 
        activePanel={activePanel} 
        onPanelChange={handlePanelChange}
        onQuickCommandsToggle={() => setShowQuickCommands(!showQuickCommands)}
        onSettingsToggle={handleSettingsToggle}
        showSettings={showSettings}
      />

      {/* Quick Commands Modal */}
      {showQuickCommands && (
        <div className="fixed inset-0 z-40 flex items-end">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowQuickCommands(false)}
          />
          <div className="relative w-full bg-gray-900/95 backdrop-blur-md border-t border-matrix-green/50 p-3 sm:p-4 transform animate-slide-up safe-area-bottom">
            <h3 className="text-matrix-cyan font-bold mb-3">Quick Commands</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {['scan', 'probe', 'ls', 'connect', 'disconnect', 'help'].map(cmd => (
                <button
                  key={cmd}
                  className="quick-cmd-btn"
                  onClick={() => {
                    setShowQuickCommands(false);
                    setActivePanel('terminal');
                  }}
                >
                  {cmd}
                </button>
              ))}
            </div>
            
            {systemStatus.underAttack && (
              <>
                <h4 className="text-red-400 font-bold mb-2 mt-4">DEFENSE COMMANDS:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['firewall', 'isolate', 'trace_block', 'counter_hack'].map(cmd => (
                    <button
                      key={cmd}
                      className="px-3 py-2 bg-red-500/20 border border-red-500 text-red-400 hover:bg-red-500/30 transition-all text-sm"
                      onClick={() => {
                        setShowQuickCommands(false);
                        setActivePanel('terminal');
                      }}
                    >
                      {cmd}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes screen-flicker {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3) hue-rotate(5deg); }
        }
        
        @keyframes critical-pulse {
          0% { opacity: 0.3; }
          100% { opacity: 0.7; }
        }
        
        @keyframes emergency-flash {
          0% { opacity: 0.8; }
          100% { opacity: 1; box-shadow: 0 0 20px currentColor; }
        }
        
        @keyframes matrix-rain {
          0% { background-position: 0% 0%; }
          100% { background-position: 0% 200px; }
        }
        
        .matrix-rain {
          background: linear-gradient(
            0deg,
            transparent 0%,
            rgba(0, 255, 65, 0.03) 50%,
            transparent 100%
          );
          background-size: 100% 200px;
          animation: matrix-rain 10s linear infinite;
        }
        
        .system-stressed {
          filter: hue-rotate(10deg) brightness(1.1);
        }
        
        .under-attack {
          animation: screen-flicker 0.2s infinite;
          filter: contrast(1.2) brightness(1.1);
        }

        .nav-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 0.25rem;
          color: #00FF41;
          background: transparent;
          border: none;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          min-height: 56px;
          touch-action: manipulation;
        }

        .nav-tab:hover {
          background: rgba(0, 255, 65, 0.1);
          color: #00FFFF;
        }

        .nav-tab.active {
          background: rgba(0, 255, 65, 0.2);
          color: #00FFFF;
          box-shadow: inset 0 2px 0 0 #00FFFF;
        }

        .quick-cmd-btn {
          background: rgba(0, 255, 65, 0.1);
          border: 1px solid #00FF41;
          color: #00FF41;
          padding: 0.75rem;
          font-family: inherit;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          min-height: 44px;
          touch-action: manipulation;
        }

        .quick-cmd-btn:hover {
          background: rgba(0, 255, 65, 0.2);
          box-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
          transform: scale(1.02);
        }

        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
};

export default IndexEnhanced;
