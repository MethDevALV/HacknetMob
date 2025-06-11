import React, { useState, useEffect } from 'react';
import { Terminal } from '../components/Terminal';
import { NetworkMap } from '../components/NetworkMap';
import { ResourceMonitor } from '../components/ResourceMonitor';
import { FileSystem } from '../components/FileSystem';
import { MissionPanel } from '../components/MissionPanel';
import { ToolkitPanel } from '../components/ToolkitPanel';
import { SettingsPanel } from '../components/SettingsPanel';
import { IntrusionAlert } from '../components/IntrusionAlert';
import { Navigation } from '../components/layout/Navigation';
import { useGameState } from '../hooks/useGameState';
import { useIntrusionDetection } from '../hooks/useIntrusionDetection';
import { Monitor, HardDrive, Network, Target, Wrench, Settings, Zap, X } from 'lucide-react';

const Index = () => {
  const { gameState } = useGameState();
  const { intrusionState, handleTimeExpired } = useIntrusionDetection();
  const [activePanel, setActivePanel] = useState<'terminal' | 'network' | 'files' | 'missions' | 'toolkit' | 'settings'>('terminal');
  const [showQuickCommands, setShowQuickCommands] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = '#000000';
    document.body.style.color = '#00FF41';
    document.body.style.fontFamily = 'Monaco, "Lucida Console", monospace';
  }, []);

  const getTraceStatus = () => {
    if (gameState.traceLevel >= 80) return { status: 'CRITICAL', color: 'bg-red-500', pulse: true };
    if (gameState.traceLevel >= 50) return { status: 'TRACING', color: 'bg-orange-500', pulse: false };
    if (gameState.traceLevel >= 25) return { status: 'DETECTED', color: 'bg-yellow-500', pulse: false };
    return { status: 'SECURE', color: 'bg-green-500', pulse: false };
  };

  const traceStatus = getTraceStatus();

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

  return (
    <div className="min-h-screen bg-black text-matrix-green font-mono flex flex-col overflow-hidden relative">
      {/* Intrusion Detection Alert */}
      <IntrusionAlert
        isActive={intrusionState.isDetected}
        timeRemaining={intrusionState.timeRemaining}
        securityLevel={intrusionState.securityLevel}
        targetNode={intrusionState.targetNode}
        onTimeExpired={handleTimeExpired}
      />

      {/* Matrix background effect */}
      <div className="matrix-rain fixed inset-0 opacity-20 pointer-events-none z-0" />
      
      {/* Header/Top Bar - Optimized for mobile */}
      <div className="relative z-10 flex justify-between items-center p-2 sm:p-3 border-b border-matrix-green/30 bg-black/90 backdrop-blur-sm">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-2 h-2 rounded-full bg-matrix-green animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-matrix-cyan truncate">
              {gameState.currentNode || 'localhost'}
            </span>
          </div>
          <div className="text-xs text-matrix-green/80 hidden sm:block">
            HACKNET MOBILE v1.2.0
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Credits */}
          <div className="text-xs text-yellow-400">
            ${gameState.credits}
          </div>
          
          {/* Trace Status */}
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-xs text-matrix-cyan hidden sm:inline">TRACE:</span>
            <div className="w-12 sm:w-16 h-2 bg-gray-800 border border-matrix-green/50 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${traceStatus.color} ${traceStatus.pulse ? 'animate-pulse' : ''}`}
                style={{ width: `${gameState.traceLevel || 0}%` }}
              />
            </div>
            <span className={`text-xs font-bold ${
              traceStatus.status === 'CRITICAL' ? 'text-red-500 animate-pulse' :
              traceStatus.status === 'TRACING' ? 'text-orange-500' :
              traceStatus.status === 'DETECTED' ? 'text-yellow-500' :
              'text-matrix-green'
            }`}>
              {traceStatus.status}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 relative z-10">
        <div className="flex-1 min-h-0 bg-black/80 backdrop-blur-sm">
          {activePanel === 'terminal' && <Terminal />}
          {activePanel === 'network' && <NetworkMap />}
          {activePanel === 'files' && <FileSystem />}
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

      {/* Quick Commands Modal - Mobile optimized */}
      {showQuickCommands && (
        <div className="fixed inset-0 z-40 flex items-end">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowQuickCommands(false)}
          />
          <div className="relative w-full bg-gray-900/95 backdrop-blur-md border-t border-matrix-green/50 p-3 sm:p-4 transform animate-slide-up safe-area-bottom">
            <h3 className="text-matrix-cyan font-bold mb-3">COMANDOS RÁPIDOS</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {['scan', 'probe', 'ls', 'connect', 'disconnect', 'help'].map(cmd => (
                <button
                  key={cmd}
                  className="quick-cmd-btn"
                  onClick={() => {
                    // TODO: Execute command
                    setShowQuickCommands(false);
                  }}
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .matrix-rain {
          background: linear-gradient(
            0deg,
            transparent 0%,
            rgba(0, 255, 65, 0.05) 50%,
            transparent 100%
          );
          background-size: 100% 200px;
          animation: matrix-fall 10s linear infinite;
        }

        @keyframes matrix-fall {
          0% { background-position: 0% 0%; }
          100% { background-position: 0% 200px; }
        }

        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
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

        .nav-tab.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00FFFF, transparent);
          animation: pulse-line 2s ease-in-out infinite;
        }

        @keyframes pulse-line {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
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

        .quick-cmd-btn:active {
          transform: scale(0.98);
        }

        /* Safe area support for mobile devices */
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }

        /* Critical trace warning overlay */
        ${gameState.traceLevel >= 90 ? `
          .matrix-rain::after {
            content: '';
            position: fixed;
            inset: 0;
            background: rgba(255, 0, 0, 0.1);
            animation: critical-pulse 0.5s ease-in-out infinite alternate;
            pointer-events: none;
            z-index: 5;
          }

          @keyframes critical-pulse {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        ` : ''}

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .nav-tab {
            min-height: 60px;
            padding: 0.5rem 0.25rem;
          }
          
          .nav-tab .text-xs {
            font-size: 0.6875rem;
          }
        }

        @media (max-height: 600px) {
          .nav-tab {
            min-height: 50px;
            padding: 0.5rem 0.25rem;
          }
          
          .nav-tab .text-xs {
            font-size: 0.625rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Index;
