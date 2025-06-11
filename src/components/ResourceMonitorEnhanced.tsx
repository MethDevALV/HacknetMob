
import React, { useState, useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { systemResourceManager, SystemResources } from '../utils/SystemResources';
import { t } from '../utils/i18n';
import { Cpu, HardDrive, Wifi, Thermometer, Zap, Activity } from 'lucide-react';

export const ResourceMonitorEnhanced: React.FC = () => {
  const { gameState } = useGameState();
  const [resources, setResources] = useState<SystemResources>({
    cpu: { current: 5, max: 100, unit: '%' },
    ram: { current: 1200, max: 8192, unit: 'MB' },
    network: { current: 0, max: 1000, unit: 'Mbps' },
    storage: { current: 2500, max: 500000, unit: 'MB' },
    temperature: { current: 35, max: 85, unit: '°C' }
  });
  const [processes, setProcesses] = useState<any[]>([]);

  useEffect(() => {
    const updateResources = (newResources: SystemResources) => {
      setResources(newResources);
    };

    systemResourceManager.onResourceChange(updateResources);
    
    // Update processes periodically
    const processInterval = setInterval(() => {
      setProcesses(systemResourceManager.getAllProcesses());
    }, 1000);

    return () => {
      systemResourceManager.removeResourceCallback(updateResources);
      clearInterval(processInterval);
    };
  }, []);

  const getResourcePercentage = (resource: { current: number; max: number }) => {
    return Math.min((resource.current / resource.max) * 100, 100);
  };

  const getResourceColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-yellow-400';
    return 'bg-matrix-green';
  };

  const getTraceColor = () => {
    if (gameState.traceLevel >= 80) return 'text-red-500';
    if (gameState.traceLevel >= 50) return 'text-orange-500';
    if (gameState.traceLevel >= 25) return 'text-yellow-400';
    return 'text-matrix-green';
  };

  const formatBytes = (bytes: number) => {
    if (bytes >= 1024) {
      return `${(bytes / 1024).toFixed(1)}GB`;
    }
    return `${bytes}MB`;
  };

  const ResourceBar: React.FC<{
    label: string;
    resource: { current: number; max: number; unit: string };
    icon: React.ReactNode;
    warning?: boolean;
  }> = ({ label, resource, icon, warning }) => {
    const percentage = getResourcePercentage(resource);
    const color = getResourceColor(percentage);

    return (
      <div className="flex items-center gap-1 text-xs">
        <div className="flex items-center gap-1 w-10">
          {icon}
          <span className="text-matrix-cyan">{label}:</span>
        </div>
        <div className="flex-1 h-1.5 bg-gray-800 border border-matrix-green/30 rounded overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${color} ${warning ? 'animate-pulse' : ''}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-matrix-green w-12 text-right">
          {resource.unit === 'MB' ? formatBytes(resource.current) : `${resource.current.toFixed(1)}${resource.unit}`}
        </span>
      </div>
    );
  };

  const runningProcesses = processes.filter(p => p.duration && 
    (Date.now() - p.startTime) / 1000 < p.duration
  );

  return (
    <div className="bg-black/80 border border-matrix-green/30 rounded p-2 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-matrix-cyan font-bold text-xs">SYSTEM</h3>
        <div className="flex items-center gap-1">
          <Activity size={10} className="text-matrix-green" />
          <span className="text-xs text-matrix-green">
            {runningProcesses.length}
          </span>
        </div>
      </div>

      {/* Resource bars */}
      <div className="space-y-1">
        <ResourceBar
          label="CPU"
          resource={resources.cpu}
          icon={<Cpu size={10} />}
          warning={resources.cpu.current > 85}
        />
        
        <ResourceBar
          label="RAM"
          resource={resources.ram}
          icon={<HardDrive size={10} />}
          warning={resources.ram.current / resources.ram.max > 0.9}
        />
        
        <ResourceBar
          label="NET"
          resource={resources.network}
          icon={<Wifi size={10} />}
        />
        
        <ResourceBar
          label="TMP"
          resource={resources.temperature}
          icon={<Thermometer size={10} />}
          warning={resources.temperature.current > 75}
        />
      </div>

      {/* Trace Level */}
      <div className="flex items-center gap-1 pt-1 border-t border-matrix-green/30 mt-2">
        <div className="flex items-center gap-1">
          <Zap size={10} />
          <span className="text-xs text-matrix-cyan">TRACE:</span>
        </div>
        <div className="flex-1 h-1.5 bg-gray-800 border border-matrix-green/30 rounded overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              gameState.traceLevel >= 80 ? 'bg-red-500 animate-pulse' :
              gameState.traceLevel >= 50 ? 'bg-orange-500' :
              gameState.traceLevel >= 25 ? 'bg-yellow-400' :
              'bg-matrix-green'
            }`}
            style={{ width: `${gameState.traceLevel || 0}%` }}
          />
        </div>
        <span className={`text-xs font-bold w-8 text-right ${getTraceColor()}`}>
          {gameState.traceLevel || 0}%
        </span>
      </div>
    </div>
  );
};
