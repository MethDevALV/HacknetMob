import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Activity, Zap, Eye, X } from 'lucide-react';
import { systemResourceManager } from '../utils/SystemResources';

interface SecurityStatusPanelProps {
  className?: string;
}

export const SecurityStatusPanel: React.FC<SecurityStatusPanelProps> = ({ className = '' }) => {
  const [alertLevel, setAlertLevel] = useState<'green' | 'yellow' | 'orange' | 'red'>('green');
  const [riskLevel, setRiskLevel] = useState(0);
  const [activeAttacks, setActiveAttacks] = useState<any[]>([]);
  const [activeDefenses, setActiveDefenses] = useState<Map<string, any>>(new Map());
  const [systemIntegrity, setSystemIntegrity] = useState(100);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate system integrity based on resources
      const resources = systemResourceManager.getResources();
      let integrity = 100;
      
      // Reduce integrity based on resource usage
      const cpuUsage = (resources.cpu.current / resources.cpu.max) * 100;
      const ramUsage = (resources.ram.current / resources.ram.max) * 100;
      integrity -= Math.max(0, cpuUsage - 80) * 0.5;
      integrity -= Math.max(0, ramUsage - 80) * 0.5;
      
      setSystemIntegrity(Math.max(0, Math.min(100, integrity)));
      
      // Update alert level based on integrity
      if (integrity >= 80) setAlertLevel('green');
      else if (integrity >= 60) setAlertLevel('yellow');
      else if (integrity >= 40) setAlertLevel('orange');
      else setAlertLevel('red');
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getAlertColor = () => {
    switch (alertLevel) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'orange': return 'bg-orange-500';
      case 'red': return 'bg-red-500 animate-pulse';
      default: return 'bg-gray-500';
    }
  };

  const getIntegrityColor = () => {
    if (systemIntegrity >= 80) return 'bg-green-500';
    if (systemIntegrity >= 60) return 'bg-yellow-500';
    if (systemIntegrity >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getActiveDefensesList = () => {
    const activeList: string[] = [];
    activeDefenses.forEach((state, defense) => {
      if (state.active) {
        activeList.push(defense);
      }
    });
    return activeList;
  };

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      {/* Compact View */}
      <div 
        className={`
          bg-black/90 border-2 rounded-lg p-3 backdrop-blur-sm cursor-pointer transition-all duration-300
          ${alertLevel === 'red' ? 'border-red-500' : 
            alertLevel === 'orange' ? 'border-orange-500' :
            alertLevel === 'yellow' ? 'border-yellow-500' : 
            'border-green-500/50'}
          ${isExpanded ? 'w-80' : 'w-20'}
        `}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {!isExpanded ? (
          /* Compact View Content */
          <div className="flex flex-col items-center space-y-2">
            <div className={`w-4 h-4 rounded-full ${getAlertColor()}`} />
            <Shield size={16} className="text-matrix-green" />
            <div className="w-2 h-8 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`${getIntegrityColor()} transition-all duration-500 rounded-full`}
                style={{ height: `${systemIntegrity}%`, marginTop: `${100 - systemIntegrity}%` }}
              />
            </div>
          </div>
        ) : (
          /* Expanded View Content */
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-matrix-cyan font-bold text-sm">Estado de Seguridad</h3>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="text-matrix-green hover:text-red-400"
              >
                <X size={16} />
              </button>
            </div>

            {/* Threat Level */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-matrix-green text-xs">Nivel de Amenaza:</span>
                <div className={`w-3 h-3 rounded-full ${getAlertColor()}`} />
              </div>
              <div className="text-xs capitalize text-matrix-cyan">
                {alertLevel === 'green' && '🟢 Seguro'}
                {alertLevel === 'yellow' && '🟡 Vigilancia'}
                {alertLevel === 'orange' && '🟠 Alerta'}
                {alertLevel === 'red' && '🔴 CRÍTICO'}
              </div>
            </div>

            {/* System Integrity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-matrix-green text-xs">Integridad:</span>
                <span className="text-matrix-cyan text-xs">{Math.round(systemIntegrity)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`${getIntegrityColor()} h-full transition-all duration-500`}
                  style={{ width: `${systemIntegrity}%` }}
                />
              </div>
            </div>

            {/* Active Attacks */}
            {activeAttacks.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={12} className="text-red-500" />
                  <span className="text-red-400 text-xs font-semibold">
                    Ataques Activos ({activeAttacks.length})
                  </span>
                </div>
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {activeAttacks.map((attack, index) => (
                    <div key={index} className="text-xs bg-red-500/20 p-1 rounded border border-red-500/30">
                      <div className="text-red-400 font-semibold">{attack.type}</div>
                      <div className="text-red-300 text-[10px]">{attack.severity.toUpperCase()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Defenses */}
            {getActiveDefensesList().length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield size={12} className="text-green-500" />
                  <span className="text-green-400 text-xs font-semibold">
                    Defensas Activas ({getActiveDefensesList().length})
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {getActiveDefensesList().slice(0, 4).map((defense, index) => (
                    <div key={index} className="text-xs bg-green-500/20 p-1 rounded border border-green-500/30 text-center">
                      <div className="text-green-400 capitalize">{defense}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risk Level */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-matrix-green text-xs">Nivel de Riesgo:</span>
                <span className="text-matrix-cyan text-xs">{riskLevel}%</span>
              </div>
              <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    riskLevel < 25 ? 'bg-green-500' :
                    riskLevel < 50 ? 'bg-yellow-500' :
                    riskLevel < 75 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${riskLevel}%` }}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-1 pt-2 border-t border-matrix-green/30">
              <button 
                className="text-xs bg-blue-500/20 text-blue-400 p-1 rounded border border-blue-500/30 hover:bg-blue-500/30"
                onClick={(e) => {
                  e.stopPropagation();
                  // Implement firewall activation
                }}
              >
                Firewall
              </button>
              <button 
                className="text-xs bg-red-500/20 text-red-400 p-1 rounded border border-red-500/30 hover:bg-red-500/30"
                onClick={(e) => {
                  e.stopPropagation();
                  // Implement panic command
                }}
              >
                Pánico
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
